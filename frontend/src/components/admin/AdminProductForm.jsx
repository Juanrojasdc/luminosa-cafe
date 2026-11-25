import { useRef, useState } from "react";

const initialFormData = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  foodCharacteristicIds: [],
  isAvailable: true,
  isFeatured: false,
  displayOrder: 0,
  image: null,
  removeImage: false,
};

function AdminProductForm({
  product = null,
  products = [],
  categories = [],
  foodCharacteristics = [],
  onSubmit,
  onCancel,
  error = "",
  isSaving = false,
}) {
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    ...(product
      ? {
          name: product.name ?? "",
          description: product.description ?? "",
          price: product.price ?? "",
          categoryId: product.categoryId ?? "",
          foodCharacteristicIds: [...(product.foodCharacteristicIds ?? [])],
          isAvailable: product.isAvailable ?? true,
          isFeatured: product.isFeatured ?? false,
          displayOrder: product.displayOrder ?? 0,
        }
      : {}),
  }));

  const [imageName, setImageName] = useState("");
  const imageInputRef = useRef(null);

  const isEditing = product !== null;

  const categoryProducts = products
    .filter(
      (item) =>
        String(item.categoryId) === String(formData.categoryId) &&
        item.id !== product?.id,
    )
    .sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);

  const maximumPosition = categoryProducts.length + 1;

  const selectedPosition =
    Number(formData.displayOrder) === 0
      ? maximumPosition
      : Math.min(Number(formData.displayOrder), maximumPosition);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCharacteristicChange(characteristicId) {
    setFormData((previousData) => {
      const isSelected =
        previousData.foodCharacteristicIds.includes(characteristicId);

      return {
        ...previousData,
        foodCharacteristicIds: isSelected
          ? previousData.foodCharacteristicIds.filter(
              (id) => id !== characteristicId,
            )
          : [...previousData.foodCharacteristicIds, characteristicId],
      };
    });
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] ?? null;

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

  function handleSubmit(event) {
    event.preventDefault();

    if (typeof onSubmit !== "function" || isSaving) {
      return;
    }

    onSubmit({
      ...formData,
      price: formData.price,
      categoryId: Number(formData.categoryId),
      displayOrder: Number(formData.displayOrder),
    });
  }

  return (
    <section
      className="admin-product-form"
      aria-labelledby="admin-product-form-title"
    >
      <h2 id="admin-product-form-title">
        {isEditing ? "Modifier un produit" : "Créer un produit"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="admin-product-form__grid">
          <div className="admin-product-form__field">
            <label htmlFor="product-name">Nom *</label>

            <input
              id="product-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="admin-product-form__field">
            <label htmlFor="product-price">Prix (€) *</label>

            <input
              id="product-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-product-form__field admin-product-form__field--full">
            <label htmlFor="product-description">Description *</label>

            <textarea
              id="product-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="admin-product-form__field">
            <label htmlFor="product-category">Catégorie *</label>

            <select
              id="product-category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une catégorie</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-product-form__field">
            <label htmlFor="product-order">Ordre d'affichage</label>

            <select
              id="product-order"
              name="displayOrder"
              value={selectedPosition}
              onChange={handleChange}
              disabled={!formData.categoryId}
            >
              {categoryProducts.map((item, index) => (
                <option key={item.id} value={index + 1}>
                  {index + 1} — Avant {item.name}
                </option>
              ))}

              <option value={maximumPosition}>
                {maximumPosition} — À la fin
              </option>
            </select>
          </div>

          <fieldset className="admin-product-form__fieldset">
            <legend>Caractéristiques alimentaires</legend>

            <div className="admin-product-form__characteristics">
              {foodCharacteristics.map((characteristic) => (
                <label
                  key={characteristic.id}
                  className="admin-product-form__checkbox"
                >
                  <input
                    type="checkbox"
                    checked={formData.foodCharacteristicIds.includes(
                      characteristic.id,
                    )}
                    onChange={() =>
                      handleCharacteristicChange(characteristic.id)
                    }
                  />

                  <span>{characteristic.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="admin-product-form__fieldset">
            <legend>Options du produit</legend>

            <div className="admin-product-form__options">
              <div className="admin-product-form__field">
                <label htmlFor="product-availability">Disponibilité</label>

                <select
                  id="product-availability"
                  name="isAvailable"
                  value={String(formData.isAvailable)}
                  onChange={(event) =>
                    setFormData((previousData) => ({
                      ...previousData,
                      isAvailable: event.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Disponible</option>
                  <option value="false">Indisponible</option>
                </select>
              </div>

            </div>
          </fieldset>

          <div className="admin-product-form__field admin-product-form__field--full">
            <label htmlFor="product-image">Image</label>

            <input
              id="product-image"
              ref={imageInputRef}
              name="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            {imageName && (
              <p className="admin-product-form__image-name">
                Fichier sélectionné : {imageName}
              </p>
            )}

            {isEditing && product.image && !formData.removeImage && (
              <button type="button" onClick={handleRemoveImage}>
                Retirer l’image
              </button>
            )}

            {formData.removeImage && <p>L’image sera retirée après enregistrement.</p>}

            <p className="admin-product-form__hint">
              JPG, PNG ou WebP — facultatif.
              {isEditing && !formData.removeImage && " Laissez vide pour conserver l'image actuelle."}
            </p>
          </div>
        </div>

        {error && (
          <p className="admin-product-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="admin-product-form__actions">
          <button
            className="admin-product-form__submit"
            type="submit"
            disabled={isSaving}
          >
            Enregistrer
          </button>

          {isEditing && (
            <button
              className="admin-product-form__cancel"
              type="button"
              onClick={onCancel}
              disabled={isSaving}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AdminProductForm;
