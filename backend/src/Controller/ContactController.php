<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class ContactController
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly LoggerInterface $logger,
        #[Autowire('%env(RESEND_API_KEY)%')]
        private readonly string $resendApiKey,
        #[Autowire('%env(CONTACT_FROM_EMAIL)%')]
        private readonly string $fromEmail,
        #[Autowire('%env(CONTACT_TO_EMAIL)%')]
        private readonly string $toEmail,
        #[Autowire(service: 'limiter.contact')]
        private readonly RateLimiterFactory $contactLimiter,
    ) {
    }

    #[Route('/api/contact', name: 'api_contact', methods: ['POST'])]
    public function send(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return new JsonResponse([
                'message' => 'Données invalides.',
            ], 400);
        }

        $limits = [
            'name' => 100,
            'email' => 254,
            'subject' => 150,
            'message' => 5000,
        ];

        foreach ($limits as $field => $maxLength) {
            if (!isset($data[$field]) || !is_string($data[$field])) {
                return new JsonResponse([
                    'message' => 'Veuillez remplir correctement tous les champs.',
                ], 400);
            }

            $data[$field] = trim($data[$field]);

            if ($data[$field] === '' || mb_strlen($data[$field]) > $maxLength) {
                return new JsonResponse([
                    'message' => 'Veuillez remplir correctement tous les champs.',
                ], 400);
            }
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse([
                'message' => 'Veuillez saisir une adresse email valide.',
            ], 400);
        }

        // Limite les envois à 3 demandes par 15 minutes et par IP.
        $limiter = $this->contactLimiter->create(
            $request->getClientIp() ?? 'unknown'
        );

        $limit = $limiter->consume(1);

        if (!$limit->isAccepted()) {
            return new JsonResponse([
                'message' => 'Trop de messages envoyés. Veuillez réessayer plus tard.',
            ], 429);
        }

        $message = sprintf(
            "Nom : %s\nEmail : %s\nSujet : %s\n\nMessage :\n%s",
            $data['name'],
            $data['email'],
            $data['subject'],
            $data['message']
        );

        try {
            $response = $this->httpClient->request(
                'POST',
                'https://api.resend.com/emails',
                [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $this->resendApiKey,
                    ],
                    'json' => [
                        'from' => $this->fromEmail,
                        'to' => [$this->toEmail],
                        'reply_to' => $data['email'],
                        'subject' => 'Contact Luminosa - ' . $data['subject'],
                        'text' => $message,
                    ],
                    'timeout' => 10,
                ]
            );

            $statusCode = $response->getStatusCode();
            $result = $response->toArray(false);

            if ($statusCode !== 200 || empty($result['id'])) {
                $this->logger->warning('Resend a refusé un message.', [
                    'http_status' => $statusCode,
                    'provider_message' => $result['message'] ?? 'Aucun détail',
                ]);

                return new JsonResponse([
                    'message' => "Le message n'a pas pu être envoyé. Veuillez réessayer.",
                ], 502);
            }
        } catch (TransportExceptionInterface $exception) {
            $this->logger->error('Erreur de connexion à Resend.', [
                'error' => $exception->getMessage(),
            ]);

            return new JsonResponse([
                'message' => 'Le service de contact est temporairement indisponible.',
            ], 503);
        } catch (\Throwable $exception) {
            $this->logger->error('Erreur lors du traitement de la réponse Resend.', [
                'error_type' => get_class($exception),
            ]);

            return new JsonResponse([
                'message' => 'Le service de contact est temporairement indisponible.',
            ], 503);
        }

        return new JsonResponse([
            'message' => 'Votre message a bien été envoyé.',
        ]);
    }
}
