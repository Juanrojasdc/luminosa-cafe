import { useState } from "react";

import AdminCategoryForm from "../../components/admin/AdminCategoryForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";

import { categories as initialCategories, products } from "../../data/menuData";

function AdminCategoriesPage() {
  // Datos temporales para probar la administración.
  const [categories, setCategories] = useState(initialCategories);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [formKey, setFormKey] = useState(0);
  const [message, setMessage] = useState("");

  // Prepara un formulario vacío.
  function handleAddCategory() {
    setSelectedCategory(null);
    setCategoryToDelete(null);
    setMessage("");
    setFormKey((previousKey) => previousKey + 1);
  }

  // Selecciona una categoría para modificarla.
  function handleEditCategory(category) {
    setSelectedCategory(category);
    setCategoryToDelete(null);
    setMessage("");
    setFormKey((previousKey) => previousKey + 1);
  }

  // Crea o actualiza una categoría en React.
  function handleSaveCategory(formData) {
    const categoryData = {
      name: formData.name,
      description: formData.description,
      displayOrder: formData.displayOrder,
    };

    if (selectedCategory) {
      const updatedCategory = {
        ...categoryData,
        id: selectedCategory.id,
        image: formData.image
          ? URL.createObjectURL(formData.image)
          : selectedCategory.image,
      };

      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.id === selectedCategory.id ? updatedCategory : category,
        ),
      );

      setMessage("La catégorie a été modifiée (mode démonstration).");
    } else {
      const newCategory = {
        ...categoryData,
        id: Math.max(0, ...categories.map((category) => category.id)) + 1,
        image: formData.image ? URL.createObjectURL(formData.image) : null,
      };

      setCategories((previousCategories) => [
        ...previousCategories,
        newCategory,
      ]);

      setMessage("La catégorie a été ajoutée (mode démonstration).");
    }

    setSelectedCategory(null);
    setFormKey((previousKey) => previousKey + 1);
  }

  function handleCancelEdit() {
    setSelectedCategory(null);
    setFormKey((previousKey) => previousKey + 1);
  }

  // Verifica si una categoría tiene productos asociados.
  function getProductCount(categoryId) {
    return products.filter((product) => product.categoryId === categoryId)
      .length;
  }

  // Solicita confirmación antes de eliminar.
  function handleRequestDelete(category) {
    setMessage("");

    if (getProductCount(category.id) > 0) {
      setCategoryToDelete(null);
      setMessage(
        `Impossible de supprimer « ${category.name} » : des produits sont associés à cette catégorie.`,
      );
      return;
    }

    setCategoryToDelete(category);
  }

  // Elimina una categoría después de la confirmación.
  function handleConfirmDelete() {
    if (!categoryToDelete) {
      return;
    }

    setCategories((previousCategories) =>
      previousCategories.filter(
        (category) => category.id !== categoryToDelete.id,
      ),
    );

    if (selectedCategory?.id === categoryToDelete.id) {
      setSelectedCategory(null);
      setFormKey((previousKey) => previousKey + 1);
    }

    setMessage("La catégorie a été supprimée (mode démonstration).");
    setCategoryToDelete(null);
  }

  function handleCancelDelete() {
    setCategoryToDelete(null);
  }

  // Presenta las categorías según su orden de visualización.
  const sortedCategories = [...categories].sort(
    (firstCategory, secondCategory) =>
      firstCategory.displayOrder - secondCategory.displayOrder,
  );

  return (
    <div className="admin-categories">
      {/* Encabezado */}
      <div className="admin-categories__header">
        <div>
          <h1>Catégories</h1>

          <p className="admin-categories__intro">
            Gérez les catégories de la carte du café.
          </p>
        </div>

        <button
          type="button"
          className="admin-categories__add-button"
          onClick={handleAddCategory}
        >
          Ajouter une catégorie
        </button>
      </div>

      <p className="admin-categories__notice">
        Mode démonstration : les modifications ne sont pas encore enregistrées
        dans la base de données.
      </p>

      {message && (
        <p className="admin-categories__message" role="status">
          {message}
        </p>
      )}

      {/* Lista de categorías */}
      <section
        className="admin-categories__list"
        aria-labelledby="admin-categories-list-title"
      >
        <h2
          id="admin-categories-list-title"
          className="admin-categories__subtitle"
        >
          Liste des catégories
        </h2>

        {sortedCategories.length === 0 ? (
          <p className="admin-categories__empty">
            Aucune catégorie pour le moment.
          </p>
        ) : (
          <>
            {/* Tabla de escritorio */}
            <div className="admin-categories__table-wrapper">
              <table className="admin-categories__table">
                <thead>
                  <tr>
                    <th scope="col">Catégorie</th>
                    <th scope="col">Description</th>
                    <th scope="col">Ordre</th>
                    <th scope="col">Produits</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedCategories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description || "—"}</td>
                      <td>{category.displayOrder}</td>
                      <td>{getProductCount(category.id)}</td>

                      <td>
                        <div className="admin-categories__actions">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(category)}
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRequestDelete(category)}
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
            <div className="admin-categories__cards">
              {sortedCategories.map((category) => (
                <article key={category.id} className="admin-categories__card">
                  <h3>{category.name}</h3>

                  <p>{category.description || "Sans description"}</p>

                  <p>
                    <strong>Ordre :</strong> {category.displayOrder}
                  </p>

                  <p>
                    <strong>Produits :</strong> {getProductCount(category.id)}
                  </p>

                  <div className="admin-categories__actions">
                    <button
                      type="button"
                      onClick={() => handleEditCategory(category)}
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestDelete(category)}
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
      {categoryToDelete && (
        <ConfirmDelete
          itemName={categoryToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Formulario */}
      <AdminCategoryForm
        key={formKey}
        category={selectedCategory}
        onSubmit={handleSaveCategory}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}

export default AdminCategoriesPage;
