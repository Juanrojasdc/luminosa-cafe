<?php

namespace App\EventListener;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class AdminCsrfListener
{
    public function __construct(
        private readonly CsrfTokenManagerInterface $csrfTokenManager,
        #[Autowire(service: 'monolog.logger.security')]
        private readonly LoggerInterface $logger,
    ) {
    }

    public function __invoke(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $path = $request->getPathInfo();

        if ($path !== '/api/admin' && !str_starts_with($path, '/api/admin/')) {
            return;
        }

        if (!in_array($request->getMethod(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return;
        }

        // El login se procesa mediante Symfony Security.
        if ($path === '/api/admin/login') {
            return;
        }

        $token = $request->headers->get('X-CSRF-Token');

        if (
            !is_string($token)
            || $token === ''
            || !$this->csrfTokenManager->isTokenValid(new CsrfToken('admin_api', $token))
        ) {
            $this->logger->warning('Requête administrative rejetée : jeton CSRF invalide.');

            $event->setResponse(new JsonResponse([
                'message' => 'Invalid CSRF token',
            ], JsonResponse::HTTP_FORBIDDEN));
        }
    }
}