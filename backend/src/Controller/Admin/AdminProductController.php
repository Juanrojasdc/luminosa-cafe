<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use App\Repository\CategoryRepository;
use App\Repository\FoodCharacteristicRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/products')]
final class AdminProductController extends AbstractController
{
    #[Route('', name: 'api_admin_products_create', methods: ['POST'])]
    public function create(
        Request $request,
        CategoryRepository $categories,
        FoodCharacteristicRepository $characteristics,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $product = new Product();

        $error = $this->fillProduct(
            $product,
            $request->toArray(),
            $categories,
            $characteristics
        );

        if ($error !== null) {
            return $this->json(['message' => $error], 422);
        }

        $entityManager->persist($product);
        $entityManager->flush();

        return $this->json([
            'id' => $product->getId(),
            'message' => 'Product created successfully',
        ], 201);
    }

    #[Route('/{id}', name: 'api_admin_products_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        ProductRepository $products,
        CategoryRepository $categories,
        FoodCharacteristicRepository $characteristics,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $product = $products->find($id);

        if ($product === null) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        $error = $this->fillProduct(
            $product,
            $request->toArray(),
            $categories,
            $characteristics
        );

        if ($error !== null) {
            return $this->json(['message' => $error], 422);
        }

        $entityManager->flush();

        return $this->json([
            'id' => $product->getId(),
            'message' => 'Product updated successfully',
        ]);
    }

    #[Route('/{id}', name: 'api_admin_products_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        ProductRepository $products,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $product = $products->find($id);

        if ($product === null) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        $entityManager->remove($product);
        $entityManager->flush();

        return $this->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    private function fillProduct(
        Product $product,
        array $data,
        CategoryRepository $categories,
        FoodCharacteristicRepository $characteristics
    ): ?string {
        $name = $data['name'] ?? null;
        $description = $data['description'] ?? null;
        $price = $data['price'] ?? null;
        $categoryId = $data['categoryId'] ?? null;
        $displayOrder = $data['displayOrder'] ?? null;
        $characteristicIds = $data['foodCharacteristicIds'] ?? null;

        if (!is_string($name) || trim($name) === '' || mb_strlen($name) > 255) {
            return 'Invalid product name';
        }

        if (!is_string($description) || trim($description) === '') {
            return 'Product description is required';
        }

        if (
            !(is_string($price) || is_int($price) || is_float($price))
            || !preg_match('/^\d{1,8}(\.\d{1,2})?$/', (string) $price)
        ) {
            return 'Invalid product price';
        }

        if (!is_int($categoryId)) {
            return 'Invalid category ID';
        }

        $category = $categories->find($categoryId);

        if ($category === null) {
            return 'Category not found';
        }

        if (!is_int($displayOrder) || $displayOrder < 0) {
            return 'Invalid display order';
        }

        if (
            !isset($data['isAvailable'])
            || !is_bool($data['isAvailable'])
            || !isset($data['isFeatured'])
            || !is_bool($data['isFeatured'])
        ) {
            return 'Invalid product options';
        }

        if (!is_array($characteristicIds) || !array_is_list($characteristicIds)) {
            return 'Invalid food characteristics';
        }

        if (
            count($characteristicIds) !== count(array_unique($characteristicIds))
        ) {
            return 'Duplicate food characteristics';
        }

        $selectedCharacteristics = [];

        foreach ($characteristicIds as $id) {
            if (!is_int($id)) {
                return 'Invalid food characteristic ID';
            }

            $characteristic = $characteristics->find($id);

            if ($characteristic === null) {
                return 'Food characteristic not found';
            }

            $selectedCharacteristics[] = $characteristic;
        }

        // La subida de archivos se implementará por separado.
        // No aceptamos rutas de imagen arbitrarias desde el cliente.
        if (array_key_exists('image', $data) && $data['image'] !== null) {
            return 'Image upload is not yet supported';
        }

        $product
            ->setName(trim($name))
            ->setDescription(trim($description))
            ->setPrice((string) $price)
            ->setCategory($category)
            ->setDisplayOrder($displayOrder)
            ->setIsAvailable($data['isAvailable'])
            ->setIsFeatured($data['isFeatured']);

        foreach ($product->getFoodCharacteristics()->toArray() as $existing) {
            $product->removeFoodCharacteristic($existing);
        }

        foreach ($selectedCharacteristics as $characteristic) {
            $product->addFoodCharacteristic($characteristic);
        }

        return null;
    }
}
