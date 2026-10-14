import CardImage from "../common/CardImage";
function EventCard({ event, isPast = false }) {
  // Convertimos la fecha al formato francés sin depender
  // de la interpretación de zonas horarias del navegador.
  const [year, month, day] = event.date.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  // Construimos el texto que se mostrará en la tarjeta.
  const eventStatus = isPast ? "ÉVÉNEMENT PASSÉ" : "À VENIR";

  const formattedSchedule = `${formattedDate} · ${event.startTime}–${event.endTime}`;

  return (
    <article
      className={
        isPast
          ? "event-card event-card--past"
          : "event-card event-card--upcoming"
      }
    >
      <CardImage
        src={event.image}
        alt={event.title}
        className="event-card__image"
        placeholderClassName="event-card__image-placeholder"
      />

      <div className="event-card__content">
        <h3 className="event-card__title">{event.title}</h3>

        <p className="event-card__schedule">
          <span>{eventStatus}</span>
          <span aria-hidden="true"> · </span>
          <span>{formattedSchedule}</span>
        </p>

        <p className="event-card__description">{event.description}</p>
      </div>
    </article>
  );
}

export default EventCard;
