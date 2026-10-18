import { useState } from "react";

import AdminEventForm from "../../components/admin/AdminEventForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";

import { events as initialEvents } from "../../data/eventsData";

// Formato de fechas para la administración.
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatEventDate(date) {
  return dateFormatter.format(new Date(`${date}T12:00:00Z`));
}

function AdminEventsPage() {
  // Datos temporales hasta conectar la API Symfony.
  const [events, setEvents] = useState(initialEvents);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [formKey, setFormKey] = useState(0);
  const [message, setMessage] = useState("");

  // Prepara un formulario vacío para crear un evento.
  function handleAddEvent() {
    setSelectedEvent(null);
    setEventToDelete(null);
    setMessage("");
    setFormKey((previousKey) => previousKey + 1);
  }

  // Carga los datos del evento seleccionado.
  function handleEditEvent(event) {
    setSelectedEvent(event);
    setEventToDelete(null);
    setMessage("");
    setFormKey((previousKey) => previousKey + 1);
  }

  // Crea o modifica un evento en el estado local.
  function handleSaveEvent(formData) {
    const eventData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    if (selectedEvent) {
      const updatedEvent = {
        ...eventData,
        id: selectedEvent.id,
        image: formData.image
          ? URL.createObjectURL(formData.image)
          : selectedEvent.image,
      };

      setEvents((previousEvents) =>
        previousEvents.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event,
        ),
      );

      setMessage("L'événement a été modifié (mode démonstration).");
    } else {
      const newEvent = {
        ...eventData,
        id: Math.max(0, ...events.map((event) => event.id)) + 1,
        image: formData.image ? URL.createObjectURL(formData.image) : null,
      };

      setEvents((previousEvents) => [...previousEvents, newEvent]);

      setMessage("L'événement a été ajouté (mode démonstration).");
    }

    setSelectedEvent(null);
    setFormKey((previousKey) => previousKey + 1);
  }

  function handleCancelEdit() {
    setSelectedEvent(null);
    setFormKey((previousKey) => previousKey + 1);
  }

  // La eliminación siempre requiere una confirmación.
  function handleRequestDelete(event) {
    setEventToDelete(event);
    setMessage("");
  }

  function handleConfirmDelete() {
    if (!eventToDelete) {
      return;
    }

    setEvents((previousEvents) =>
      previousEvents.filter((event) => event.id !== eventToDelete.id),
    );

    if (selectedEvent?.id === eventToDelete.id) {
      setSelectedEvent(null);
      setFormKey((previousKey) => previousKey + 1);
    }

    setEventToDelete(null);
    setMessage("L'événement a été supprimé (mode démonstration).");
  }

  function handleCancelDelete() {
    setEventToDelete(null);
  }

  // Orden cronológico: primero los eventos más próximos.
  const sortedEvents = [...events].sort((firstEvent, secondEvent) => {
    const firstDateTime = `${firstEvent.date}T${firstEvent.startTime}`;
    const secondDateTime = `${secondEvent.date}T${secondEvent.startTime}`;

    return firstDateTime.localeCompare(secondDateTime);
  });

  return (
    <div className="admin-events">
      {/* Encabezado */}
      <div className="admin-events__header">
        <div>
          <h1>Événements</h1>

          <p className="admin-events__intro">
            Gérez les événements organisés à la cafétéria.
          </p>
        </div>

        <button
          type="button"
          className="admin-events__add-button"
          onClick={handleAddEvent}
        >
          Ajouter un événement
        </button>
      </div>

      <p className="admin-events__notice">
        Mode démonstration : les modifications ne sont pas encore enregistrées
        dans la base de données.
      </p>

      {message && (
        <p className="admin-events__message" role="status">
          {message}
        </p>
      )}

      {/* Listado de eventos */}
      <section
        className="admin-events__list"
        aria-labelledby="admin-events-list-title"
      >
        <h2 id="admin-events-list-title" className="admin-events__subtitle">
          Liste des événements
        </h2>

        {sortedEvents.length === 0 ? (
          <p className="admin-events__empty">Aucun événement pour le moment.</p>
        ) : (
          <>
            {/* Tabla de escritorio */}
            <div className="admin-events__table-wrapper">
              <table className="admin-events__table">
                <thead>
                  <tr>
                    <th scope="col">Événement</th>
                    <th scope="col">Date</th>
                    <th scope="col">Horaires</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>

                      <td>{formatEventDate(event.date)}</td>

                      <td>
                        {event.startTime} – {event.endTime}
                      </td>

                      <td>
                        <div className="admin-events__actions">
                          <button
                            type="button"
                            onClick={() => handleEditEvent(event)}
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRequestDelete(event)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas móviles */}
            <div className="admin-events__cards">
              {sortedEvents.map((event) => (
                <article key={event.id} className="admin-events__card">
                  <h3>{event.title}</h3>

                  <p>
                    <strong>Date :</strong> {formatEventDate(event.date)}
                  </p>

                  <p>
                    <strong>Horaires :</strong> {event.startTime} –{" "}
                    {event.endTime}
                  </p>

                  <div className="admin-events__actions">
                    <button
                      type="button"
                      onClick={() => handleEditEvent(event)}
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestDelete(event)}
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Confirmación de eliminación */}
      {eventToDelete && (
        <ConfirmDelete
          itemName={eventToDelete.title}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Formulario de creación y edición */}
      <AdminEventForm
        key={formKey}
        event={selectedEvent}
        onSubmit={handleSaveEvent}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}

export default AdminEventsPage;
