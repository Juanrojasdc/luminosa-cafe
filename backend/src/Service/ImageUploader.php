<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

final class ImageUploader
{
    private const MAX_SIZE = 2 * 1024 * 1024;

    private const ALLOWED_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    public function __construct(
        private readonly string $projectDir
    ) {
    }

    public function upload(UploadedFile $file): string
    {
        if (!$file->isValid()) {
            throw new \InvalidArgumentException(
                'Le fichier envoyé est invalide.'
            );
        }

        if ($file->getSize() > self::MAX_SIZE) {
            throw new \InvalidArgumentException(
                "L'image ne doit pas dépasser 2 Mo."
            );
        }

        $imageInfo = @getimagesize($file->getPathname());

        if ($imageInfo === false) {
        throw new \InvalidArgumentException(
        "Le fichier n'est pas une image valide."
        );
        }

        $mimeType = $file->getMimeType();

        if (!isset(self::ALLOWED_TYPES[$mimeType])) {
            throw new \InvalidArgumentException(
                'Format non autorisé. Utilisez JPG, PNG ou WebP.'
            );
        }

        $extension = self::ALLOWED_TYPES[$mimeType];

        $filename = bin2hex(random_bytes(16)) . '.' . $extension;

        $directory = $this->projectDir . '/public/uploads';

        $file->move($directory, $filename);

        return '/uploads/' . $filename;
    }
    public function isValidPath(string $path): bool
{
    if (!preg_match(
        '#^/uploads/[a-f0-9]{32}\.(jpg|png|webp)$#',
        $path
    )) {
        return false;
    }

    $filename = basename($path);

    return is_file(
        $this->projectDir . '/public/uploads/' . $filename
    );
}
}
