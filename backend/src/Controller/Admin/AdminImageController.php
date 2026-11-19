<?php

namespace App\Controller\Admin;

use App\Service\ImageUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/images')]
final class AdminImageController extends AbstractController
{
    #[Route('', name: 'api_admin_images_upload', methods: ['POST'])]
    public function upload(
        Request $request,
        ImageUploader $imageUploader
    ): JsonResponse {
        $file = $request->files->get('image');

        if ($file === null) {
            return $this->json([
                'message' => 'Veuillez sélectionner une image.',
            ], 422);
        }

        if (!$file instanceof UploadedFile || !$file->isValid()) {
            if (
                $file instanceof UploadedFile
                && in_array(
                    $file->getError(),
                    [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE],
                    true
                )
            ) {
                return $this->json([
                    'message' => "L'image ne doit pas dépasser 2 Mo.",
                ], 422);
            }

            return $this->json([
                'message' => "Le téléchargement de l'image a échoué.",
            ], 422);
        }

        try {
            $path = $imageUploader->upload($file);
        } catch (\InvalidArgumentException $exception) {
            return $this->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return $this->json([
            'image' => $path,
        ], 201);
    }
}
