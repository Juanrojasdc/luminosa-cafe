<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class AdminAuthController extends AbstractController
{
    #[Route('/api/admin/login', name: 'api_admin_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        return $this->json([
            'message' => 'Login successful',
        ]);
    }

#[Route('/api/admin/me', name: 'api_admin_me', methods: ['GET'])]
public function me(): JsonResponse
{
    $admin = $this->getUser();

    if ($admin === null) {
        return $this->json([
            'message' => 'Not authenticated',
        ], 401);
    }

    return $this->json([
        'email' => $admin->getUserIdentifier(),
        'roles' => $admin->getRoles(),
    ]);
}


#[Route('/api/admin/logout', name: 'api_admin_logout', methods: ['POST'])]
public function logout(): void
{
    throw new \LogicException(
        'Symfony Security debe interceptar esta ruta.'
    );
}


}
