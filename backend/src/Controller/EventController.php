<?php

namespace App\Controller;

use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class EventController extends AbstractController
{
    #[Route('/api/events', name: 'api_events', methods: ['GET'])]
    public function index(EventRepository $eventRepository): JsonResponse
    {
        $events = $eventRepository->findBy([], ['eventDate' => 'ASC', 'startTime' => 'ASC']);

        $data = [];

        foreach ($events as $event) {
            $data[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'eventDate' => $event->getEventDate()->format('Y-m-d'),
                'startTime' => $event->getStartTime()->format('H:i'),
                'endTime' => $event->getEndTime()->format('H:i'),
                'image' => $event->getImage(),
            ];
        }

        return $this->json($data);
    }
}
