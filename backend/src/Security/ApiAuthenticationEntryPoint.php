<?php

namespace App\Security;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

final class ApiAuthenticationEntryPoint implements AuthenticationEntryPointInterface
{
    public function __construct(
        #[Autowire(service: 'monolog.logger.security')]
        private readonly LoggerInterface $logger,
    ) {
    }

    public function start(
        Request $request,
        ?AuthenticationException $authException = null
    ): JsonResponse {
        $this->logger->info('Accès non authentifié à une ressource protégée.');

        return new JsonResponse([
            'message' => 'Authentication required',
        ], JsonResponse::HTTP_UNAUTHORIZED);
    }
}