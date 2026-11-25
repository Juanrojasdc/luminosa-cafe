import { useState } from "react";

const initialFormData = {
  name: "",
  description: "",
  displayOrder: 0,
};

function AdminCategoryForm({ category = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    ...(category
      ? {
          name: category.name ?? "",
          description: category.description ?? "",
          displayOrder: category.displayOrder ?? 0,
        }
      : {}),
  }));

  const isEditing = category !== null;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (typeof onSubmit !== "function") {
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      displayOrder: Number(formData.displayOrder),
    });
  }

  return (
    <section
      className="admin-category-form"
      aria-labelledby="admin-category-form-title"
    >
      <h2 id="admin-category-form-title">
        {isEditing ? "Modifier une catégorie" : "Créer une catégorie"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="admin-category-form__grid">
          <div className="admin-category-form__field">
            <label htmlFor="category-name">Nom *</label>

            <input
              id="category-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="admin-category-form__field">
            <label htmlFor="category-order">Ordre d'affichage</label>

            <input
              id="category-order"
              name="displayOrder"
              type="number"
              min="0"
              step="1"
              value={formData.displayOrder}
              onChange={handleChange}
            />
          </div>

          <div className="admin-category-form__field admin-category-form__field--full">
            <label htmlFor="category-description">Description</label>

            <textarea
              id="category-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

        </div>

        <div className="admin-category-form__actions">
          <button className="admin-category-form__submit" type="submit">
            Enregistrer
          </button>

          {isEditing && (
            <button
              className="admin-category-form__cancel"
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

export default AdminCategoryForm;
