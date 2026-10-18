import { useState } from "react";

const initialFormData = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  image: null,
};

function AdminEventForm({ event = null, onSubmit, onCancel }) {
  // Inicializamos el formulario con los datos del evento seleccionado.
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    ...(event
      ? {
          title: event.title ?? "",
          description: event.description ?? "",
          date: event.date ?? "",
          startTime: event.startTime ?? "",
          endTime: event.endTime ?? "",
        }
      : {}),
  }));

  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");

  const isEditing = event !== null;

  // Actualiza los campos de texto, fecha y hora.
  function handleChange(changeEvent) {
    const { name, value } = changeEvent.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  }

  // Conservamos el archivo seleccionado para enviarlo después a Symfony.
  function handleImageChange(changeEvent) {
    const file = changeEvent.target.files?.[0] ?? null;

    setFormData((previousData) => ({
      ...previousData,
      image: file,
    }));

    setImageName(file?.name ?? "");
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault();

    if (formData.endTime <= formData.startTime) {
      setError("L'heure de fin doit être postérieure à l'heure de début.");
      return;
    }

    if (typeof onSubmit !== "function") {
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
  }

  return (
    <section
      className="admin-event-form"
      aria-labelledby="admin-event-form-title"
    >
      <h2 id="admin-event-form-title">
        {isEditing ? "Modifier un événement" : "Créer un événement"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="admin-event-form__grid">
          {/* Información principal */}
          <div className="admin-event-form__field admin-event-form__field--full">
            <label htmlFor="event-title">Titre *</label>

            <input
              id="event-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="admin-event-form__field admin-event-form__field--full">
            <label htmlFor="event-description">Description *</label>

            <textarea
              id="event-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          {/* Fecha y horario */}
          <div className="admin-event-form__field">
            <label htmlFor="event-date">Date *</label>

            <input
              id="event-date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-event-form__field">
            <label htmlFor="event-start-time">Heure de début *</label>

            <input
              id="event-start-time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-event-form__field">
            <label htmlFor="event-end-time">Heure de fin *</label>

            <input
              id="event-end-time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Imagen opcional */}
          <div className="admin-event-form__field admin-event-form__field--full">
            <label htmlFor="event-image">Image</label>

            <input
              id="event-image"
              name="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            {imageName && (
              <p className="admin-event-form__image-name">
                Fichier sélectionné : {imageName}
              </p>
            )}

            <p className="admin-event-form__hint">
              JPG, PNG ou WebP — facultatif.
              {isEditing && " Laissez vide pour conserver l'image actuelle."}
            </p>
          </div>
        </div>

        {error && (
          <p className="admin-event-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="admin-event-form__actions">
          <button className="admin-event-form__submit" type="submit">
            Enregistrer
          </button>

          {isEditing && (
            <button
              className="admin-event-form__cancel"
              type="button"
              onClick={onCancel}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AdminEventForm;
