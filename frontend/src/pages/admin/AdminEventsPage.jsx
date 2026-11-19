import { useEffect, useState } from "react";

import AdminEventForm from "../../components/admin/AdminEventForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import { apiRequest, adminRequest, uploadImage } from "../../services/api";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatEventDate(date) {
  return dateFormatter.format(new Date(`${date}T12:00:00Z`));
}

// Symfony devuelve "eventDate", mientras que el formulario utiliza "date".
function normalizeEvent(event) {
  return {
    ...event,
    date: event.eventDate,
  };
}

function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [formKey, setFormKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  // Recupera los eventos almacenados en MySQL mediante Symfony.
  async function loadEvents() {
    const data = await apiRequest("/events");
    setEvents(data.map(normalizeEvent));
  }

  useEffect(() => {
    let active = true;

    async function loadInitialEvents() {
      try {
        const data = await apiRequest("/events");

        if (active) {
          setEvents(data.map(normalizeEvent));
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadInitialEvents();

    return () => {
      active = false;
    };
  }, []);

  function handleAddEvent() {
    setSelectedEvent(null);
    setEventToDelete(null);
    setMessage("");
    setError("");
    setSaveError("");
    setFormKey((previousKey) => previousKey + 1);
  }

  function handleEditEvent(event) {
    setSelectedEvent(event);
    setEventToDelete(null);
    setMessage("");
    setError("");
    setSaveError("");
    setFormKey((previousKey) => previousKey + 1);
  }

  // Envía el formulario a Symfony para crear o modificar un evento.
  async function handleSaveEvent(formData) {
    if (isSaving) return;

    setIsSaving(true);
    setMessage("");
    setSaveError("");

    try {
      let imagePath = null;

      if (formData.image instanceof File) {
        const result = await uploadImage(formData.image);
        imagePath = result.image;
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventDate: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        image: imagePath,
      };

      const isEditing = selectedEvent !== null;

      await adminRequest(
        isEditing ? `/events/${selectedEvent.id}` : "/events",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      await loadEvents();

      setSelectedEvent(null);
      setFormKey((previousKey) => previousKey + 1);

      setMessage(
        isEditing
          ? "L'événement a été modifié avec succès."
          : "L'événement a été ajouté avec succès.",
      );
    } catch (requestError) {
      setSaveError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit() {
    if (isSaving) return;

    setSelectedEvent(null);
    setSaveError("");
    setFormKey((previousKey) => previousKey + 1);
  }

  function handleRequestDelete(event) {
    if (isSaving) return;

    setEventToDelete(event);
    setMessage("");
    setError("");
  }

  async function handleConfirmDelete() {
    if (!eventToDelete || isSaving) return;

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await adminRequest(`/events/${eventToDelete.id}`, {
        method: "DELETE",
      });

      await loadEvents();

      if (selectedEvent?.id === eventToDelete.id) {
        setSelectedEvent(null);
        setFormKey((previousKey) => previousKey + 1);
      }

      setEventToDelete(null);
      setMessage("L'événement a été supprimé avec succès.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelDelete() {
    if (isSaving) return;
    setEventToDelete(null);
  }

  const sortedEvents = [...events].sort((firstEvent, secondEvent) => {
    const firstDateTime = `${firstEvent.date}T${firstEvent.startTime}`;
    const secondDateTime = `${secondEvent.date}T${secondEvent.startTime}`;

    return firstDateTime.localeCompare(secondDateTime);
  });

  return (
    <div className="admin-events">
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
          disabled={isLoading || isSaving}
        >
          Ajouter un événement
        </button>
      </div>

      {message && (
        <p className="admin-events__message" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-events__error" role="alert">
          {error}
        </p>
      )}

      <section
        className="admin-events__list"
        aria-labelledby="admin-events-list-title"
      >
        <h2 id="admin-events-list-title" className="admin-events__subtitle">
          Liste des événements
        </h2>

        {isLoading ? (
          <p role="status">Chargement des événements...</p>
        ) : sortedEvents.length === 0 ? (
          <p className="admin-events__empty">Aucun événement pour le moment.</p>
        ) : (
          <>
            <div className="admin-events__table-wrapper">
              <table className="admin-events__table">
                <thead>
                  <tr>
                    <th scope="col">Événement</th>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Horaires</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{formatEventDate(event.date)}</td>
                      <td>{event.description}</td>
                      <td>
                        {event.startTime} – {event.endTime}
                      </td>
                      <td>
                        <div className="admin-events__actions">
                          <button
                            type="button"
                            onClick={() => handleEditEvent(event)}
                            disabled={isSaving}
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRequestDelete(event)}
                            disabled={isSaving}
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

            <div className="admin-events__cards">
              {sortedEvents.map((event) => (
                <article key={event.id} className="admin-events__card">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
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
                      disabled={isSaving}
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestDelete(event)}
                      disabled={isSaving}
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

      {eventToDelete && (
        <ConfirmDelete
          itemName={eventToDelete.title}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isSaving}
        />
      )}

      {!isLoading && (
        <AdminEventForm
          key={formKey}
          event={selectedEvent}
          onSubmit={handleSaveEvent}
          onCancel={handleCancelEdit}
          error={saveError}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

export default AdminEventsPage;
