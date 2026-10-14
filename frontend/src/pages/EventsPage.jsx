import EventCard from "../components/events/EventCard";
import { events } from "../data/eventsData";

function EventsPage() {
  // Fecha y hora actuales para clasificar los eventos.
  const now = new Date();

  // Convertimos los datos de un evento en su fecha de finalización.
  // Usamos una fecha local porque los eventos se celebran en Luminosa.
  const getEventEndDate = (event) => {
    return new Date(`${event.date}T${event.endTime}:00`);
  };

  // Separamos los eventos futuros de los pasados.
  // Un evento sigue siendo próximo mientras no haya terminado.
  const upcomingEvents = events
    .filter((event) => getEventEndDate(event) >= now)
    .sort((firstEvent, secondEvent) => {
      const firstStart = new Date(
        `${firstEvent.date}T${firstEvent.startTime}:00`,
      );
      const secondStart = new Date(
        `${secondEvent.date}T${secondEvent.startTime}:00`,
      );

      return firstStart - secondStart;
    });

  // Los eventos pasados se muestran del más reciente al más antiguo.
  const pastEvents = events
    .filter((event) => getEventEndDate(event) < now)
    .sort((firstEvent, secondEvent) => {
      return getEventEndDate(secondEvent) - getEventEndDate(firstEvent);
    });

  return (
    <main className="events-page">
      <div className="events-page__container">
        <header className="events-page__header">
          <p className="events-page__eyebrow">AGENDA</p>
          <h1>Événements</h1>
        </header>

        <div className="events-page__layout">
          <section
            className="events-page__section events-page__section--upcoming"
            aria-labelledby="upcoming-events-title"
          >
            <h2 id="upcoming-events-title">Événements à venir</h2>

            {upcomingEvents.length > 0 ? (
              <div className="events-page__list">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="events-page__empty">
                Aucun événement à venir pour le moment.
              </p>
            )}
          </section>

          <section
            className="events-page__section events-page__section--past"
            aria-labelledby="past-events-title"
          >
            <h2 id="past-events-title">Événements passés</h2>

            {pastEvents.length > 0 ? (
              <div className="events-page__list">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </div>
            ) : (
              <p className="events-page__empty">
                Aucun événement passé pour le moment.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default EventsPage;
