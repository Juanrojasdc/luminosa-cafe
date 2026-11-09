<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class ProductController extends AbstractController
{
    #[Route('/api/products', name: 'api_products', methods: ['GET'])]
    public function index(ProductRepository $productRepository): JsonResponse
    {
        $products = $productRepository->findBy([], ['displayOrder' => 'ASC']);

        $data = [];

        foreach ($products as $product) {
            $characteristics = [];

            foreach ($product->getFoodCharacteristics() as $characteristic) {
                $characteristics[] = [
                    'id' => $characteristic->getId(),
                    'name' => $characteristic->getName(),
                ];
            }

            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'image' => $product->getImage(),
                'isAvailable' => $product->isAvailable(),
                'displayOrder' => $product->getDisplayOrder(),
                'isFeatured' => $product->isFeatured(),
                'category' => [
                    'id' => $product->getCategory()->getId(),
                    'name' => $product->getCategory()->getName(),
                ],
                'foodCharacteristics' => $characteristics,
            ];
        }

        return $this->json($data);
    }
}
