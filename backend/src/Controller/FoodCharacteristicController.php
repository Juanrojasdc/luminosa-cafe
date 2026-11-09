<?php

namespace App\Controller;

use App\Repository\FoodCharacteristicRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class FoodCharacteristicController extends AbstractController
{
    #[Route('/api/food-characteristics', name: 'api_food_characteristics', methods: ['GET'])]
    public function index(FoodCharacteristicRepository $foodCharacteristicRepository): JsonResponse
    {
        $characteristics = $foodCharacteristicRepository->findBy([], ['name' => 'ASC']);

        $data = [];

        foreach ($characteristics as $characteristic) {
            $data[] = [
                'id' => $characteristic->getId(),
                'name' => $characteristic->getName(),
            ];
        }

        return $this->json($data);
    }
}
