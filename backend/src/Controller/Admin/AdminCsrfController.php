<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class AdminCsrfController extends AbstractController
{
    #[Route('/api/admin/csrf-token', name: 'api_admin_csrf_token', methods: ['GET'])]
    public function token(CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        return $this->json([
            'csrfToken' => $csrfTokenManager->getToken('admin_api')->getValue(),
        ]);
    }
}
