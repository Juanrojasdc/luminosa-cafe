<?php 

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class HealthController 
{ 
    #[route('/api/health', name: 'api_health', methods: ['GET'])]
    public function check(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'ok',
            'application' =>'Luminosa API',
        ]);
    }
}