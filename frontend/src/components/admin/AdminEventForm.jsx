import { useRef, useState } from "react";

const initialFormData = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  image: null,
  removeImage: false,
};

function AdminEventForm({
  event = null,
  onSubmit,
  onCancel,
  error = "",
  isSaving = false,
}) {
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
  const imageInputRef = useRef(null);
  const [validationError, setValidationError] = useState("");

  const isEditing = event !== null;

  // Actualiza los campos de texto, fecha y hora.
  function handleChange(changeEvent) {
    const { name, value } = changeEvent.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setValidationError("");
  }

  // Conservamos el archivo seleccionado para enviarlo después a Symfony.
  function handleImageChange(changeEvent) {
    const file = changeEvent.target.files?.[0] ?? null;

    setFormData((previousData) => ({
      ...previousData,
      image: file,
      removeImage: file ? false : previousData.removeImage,
    }));

    setImageName(file?.name ?? "");
  }

  function handleRemoveImage() {
    setFormData((previousData) => ({
      ...previousData,
      image: null,
      removeImage: true,
    }));
    setImageName("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault();

    if (formData.endTime <= formData.startTime) {
      setValidationError(
        "L'heure de fin doit être postérieure à l'heure de début.",
      );
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
              ref={imageInputRef}
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

            {isEditing && event.image && !formData.removeImage && (
              <button type="button" onClick={handleRemoveImage}>
                Retirer l’image
              </button>
            )}

            {formData.removeImage && <p>L’image sera retirée après enregistrement.</p>}

            <p className="admin-event-form__hint">
              JPG, PNG ou WebP — facultatif.
              {isEditing && !formData.removeImage && " Laissez vide pour conserver l'image actuelle."}
            </p>
          </div>
        </div>

        {(validationError || error) && (
          <p className="admin-event-form__error" role="alert">
            {validationError || error}
          </p>
        )}

        <div className="admin-event-form__actions">
          <button
            className="admin-event-form__submit"
            type="submit"
            disabled={isSaving}
          >
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
