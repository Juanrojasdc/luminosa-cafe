<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/categories')]
final class AdminCategoryController extends AbstractController
{
    #[Route('', name: 'api_admin_categories_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        CategoryRepository $repository
    ): JsonResponse {
        $data = $request->toArray();

        $category = new Category();

        $error = $this->fillCategory($category, $data, $repository);

        if ($error !== null) {
            return $this->json(['message' => $error], 422);
        }

        $position = $category->getDisplayOrder();

        $entityManager->wrapInTransaction(function () use (
            $entityManager,
            $repository,
            $category,
            $position
        ): void {
            $entityManager->persist($category);
            $entityManager->flush();

            $this->reorderCategories($repository, $entityManager, $category, $position);
        });

        return $this->json([
            'id' => $category->getId(),
            'message' => 'Category created successfully',
        ], 201);
    }

    #[Route('/{id}', name: 'api_admin_categories_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        CategoryRepository $repository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $category = $repository->find($id);

        if ($category === null) {
            return $this->json(['message' => 'Category not found'], 404);
        }

        $error = $this->fillCategory($category, $request->toArray(), $repository);

        if ($error !== null) {
            return $this->json(['message' => $error], 422);
        }

        $position = $category->getDisplayOrder();

        $entityManager->wrapInTransaction(function () use (
            $entityManager,
            $repository,
            $category,
            $position
        ): void {
            $entityManager->flush();

            $this->reorderCategories($repository, $entityManager, $category, $position);
        });

        return $this->json([
            'id' => $category->getId(),
            'message' => 'Category updated successfully',
        ]);
    }


    #[Route('/{id}', name: 'api_admin_categories_delete', methods: ['DELETE'])]
    public function delete(
    int $id,
    CategoryRepository $repository,
    EntityManagerInterface $entityManager
    ): JsonResponse {
    $category = $repository->find($id);

    if ($category === null) {
        return $this->json([
            'message' => 'Category not found',
        ], 404);
    }

    if (!$category->getProducts()->isEmpty()) {
        return $this->json([
            'message' => 'Cannot delete a category containing products',
        ], 409);
    }

    $entityManager->wrapInTransaction(function () use (
        $entityManager,
        $repository,
        $category
    ): void {
        $entityManager->remove($category);
        $entityManager->flush();

        $this->reorderCategories($repository, $entityManager);
    });

    return $this->json([
        'message' => 'Category deleted successfully',
    ]);
        }


    /**
     * Reorganiza las categorías en posiciones consecutivas desde 1.
     * La posición 0 coloca la categoría al final.
     */
    private function reorderCategories(
        CategoryRepository $repository,
        EntityManagerInterface $entityManager,
        ?Category $movingCategory = null,
        int $position = 0
    ): void {
        $orderedCategories = $repository->findBy(
            [],
            ['displayOrder' => 'ASC', 'id' => 'ASC']
        );

        if ($movingCategory !== null) {
            $orderedCategories = array_values(
                array_filter(
                    $orderedCategories,
                    fn (Category $category): bool =>
                        $category->getId() !== $movingCategory->getId()
                )
            );

            $index = $position === 0
                ? count($orderedCategories)
                : min($position - 1, count($orderedCategories));

            array_splice($orderedCategories, $index, 0, [$movingCategory]);
        }

        foreach ($orderedCategories as $index => $category) {
            $category->setDisplayOrder($index + 1);
        }

        $entityManager->flush();
    }

    private function fillCategory(
        Category $category,
        array $data,
        CategoryRepository $repository
    ): ?string {
        $name = $data['name'] ?? null;
        $displayOrder = $data['displayOrder'] ?? null;

        if (!is_string($name) || trim($name) === '') {
            return 'Category name is required';
        }

        $name = trim($name);

        if (mb_strlen($name) > 255) {
            return 'Category name is too long';
        }

        if (!is_int($displayOrder) || $displayOrder < 0) {
            return 'Display order must be a non-negative integer';
        }

        foreach (['description', 'image'] as $field) {
            if (
                array_key_exists($field, $data)
                && $data[$field] !== null
                && !is_string($data[$field])
            ) {
                return "Invalid $field";
            }
        }

        if (
            isset($data['image'])
            && mb_strlen($data['image']) > 255
        ) {
            return 'Image path is too long';
        }

        $existing = $repository->findOneBy(['name' => $name]);

        if ($existing !== null && $existing->getId() !== $category->getId()) {
            return 'Category name already exists';
        }

        $category
            ->setName($name)
            ->setDisplayOrder($displayOrder)
            ->setDescription($data['description'] ?? null)
            ->setImage($data['image'] ?? null);

        return null;
    }
}
