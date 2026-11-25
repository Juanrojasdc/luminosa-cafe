<?php

namespace App\Controller\Admin;

use App\Entity\Event;
use App\Repository\EventRepository;
use App\Service\ImageUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/events')]
final class AdminEventController extends AbstractController
{
    #[Route('', name: 'api_admin_events_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ImageUploader $imageUploader
    ): JsonResponse {
        $event = new Event();

        $error = $this->fillEvent($event, $request->toArray(), $imageUploader);

        if ($error !== null) {
            return $this->json(['message' => $error], 422);
        }

        $entityManager->persist($event);
        $entityManager->flush();

        return $this->json([
            'id' => $event->getId(),
            'message' => 'Event created successfully',
        ], 201);
    }

    #[Route('/{id}', name: 'api_admin_events_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        EventRepository $events,
        EntityManagerInterface $entityManager,
        ImageUploader $imageUploader
    ): JsonResponse {
        $event = $events->find($id);

        if ($event === null) {
            return $this->json(['message' => 'Event not found'], 404);
        }

        $error = $this->fillEvent($event, $request->toArray(), $imageUploader);

        if ($error !== null) {
            return $this->json(['message' => $error], 422);
        }

        $entityManager->flush();

        return $this->json([
            'id' => $event->getId(),
            'message' => 'Event updated successfully',
        ]);
    }

    #[Route('/{id}', name: 'api_admin_events_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        EventRepository $events,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $event = $events->find($id);

        if ($event === null) {
            return $this->json(['message' => 'Event not found'], 404);
        }

        $entityManager->remove($event);
        $entityManager->flush();

        return $this->json([
            'message' => 'Event deleted successfully',
        ]);
    }

    private function fillEvent(Event $event, array $data, ImageUploader $imageUploader): ?string
    {
        $title = $data['title'] ?? null;
        $description = $data['description'] ?? null;
        $eventDate = $data['eventDate'] ?? null;
        $startTime = $data['startTime'] ?? null;
        $endTime = $data['endTime'] ?? null;

        if (
            !is_string($title)
            || trim($title) === ''
            || mb_strlen($title) > 150
        ) {
            return 'Invalid event title';
        }

        if (!is_string($description) || trim($description) === '') {
            return 'Event description is required';
        }

        if (
            !is_string($eventDate)
            || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $eventDate)
        ) {
            return 'Invalid event date';
        }

        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $eventDate);

        if (
            $date === false
            || $date->format('Y-m-d') !== $eventDate
        ) {
            return 'Invalid event date';
        }

        if (
            !is_string($startTime)
            || !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $startTime)
            || !is_string($endTime)
            || !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $endTime)
        ) {
            return 'Invalid event time';
        }

        if ($endTime <= $startTime) {
            return 'End time must be later than start time';
        }

        if (isset($data['removeImage']) && !is_bool($data['removeImage'])) {
            return 'Invalid image option';
        }

        if (($data['removeImage'] ?? false) === true) {
            if (($data['image'] ?? null) !== null) {
                return 'Invalid image option';
            }

            $event->setImage(null);
        } elseif (array_key_exists('image', $data) && $data['image'] !== null) {
            if (
                !is_string($data['image'])
                || !$imageUploader->isValidPath($data['image'])
            ) {
                return 'Invalid image path';
            }

            $event->setImage($data['image']);
        }

        $event
            ->setTitle(trim($title))
            ->setDescription(trim($description))
            ->setEventDate($date)
            ->setStartTime(
                \DateTimeImmutable::createFromFormat('!H:i', $startTime)
            )
            ->setEndTime(
                \DateTimeImmutable::createFromFormat('!H:i', $endTime)
            );

        return null;
    }
}
