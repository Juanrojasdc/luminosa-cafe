<?php

namespace App\Security;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Event\LogoutEvent;

#[AsEventListener(event: LogoutEvent::class)]
final class AdminLogoutSuccessHandler
{
    public function __construct(
        #[Autowire(service: 'monolog.logger.security')]
        private readonly LoggerInterface $logger,
    ) {
    }

    public function __invoke(LogoutEvent $event): void
    {
        $this->logger->info('Déconnexion de l’espace d’administration.');

        $event->setResponse(new JsonResponse([
            'message' => 'Logged out successfully',
        ]));
    }
}