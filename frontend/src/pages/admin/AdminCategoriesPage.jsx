import { useEffect, useState } from "react";

import AdminCategoryForm from "../../components/admin/AdminCategoryForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import { adminRequest, apiRequest } from "../../services/api.js";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [formKey, setFormKey] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    const [categoriesData, productsData] = await Promise.all([
      apiRequest("/categories"),
      apiRequest("/products"),
    ]);

    setCategories(categoriesData);
    setProducts(productsData);
  }

  useEffect(() => {
    let active = true;

    Promise.all([apiRequest("/categories"), apiRequest("/products")])
      .then(([categoriesData, productsData]) => {
        if (!active) return;
        setCategories(categoriesData);
        setProducts(productsData);
      })
      .catch(() => {
        if (active) {
          setError("Impossible de charger les catégories.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleAddCategory() {
    setSelectedCategory(null);
    setCategoryToDelete(null);
    setMessage("");
    setError("");
    setFormKey((key) => key + 1);
  }

  function handleEditCategory(category) {
    setSelectedCategory(category);
    setCategoryToDelete(null);
    setMessage("");
    setError("");
    setFormKey((key) => key + 1);
  }

  async function handleSaveCategory(formData) {
    setMessage("");
    setError("");

    if (formData.image instanceof File) {
      setError("L'envoi d'images n'est pas encore disponible.");
      return;
    }

    const categoryData = {
      name: formData.name,
      description: formData.description,
      displayOrder: formData.displayOrder,
      image: selectedCategory?.image ?? null,
    };

    const isEditing = selectedCategory !== null;

    try {
      await adminRequest(
        isEditing ? `/categories/${selectedCategory.id}` : "/categories",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        },
      );

      await loadData();

      setSelectedCategory(null);
      setFormKey((key) => key + 1);

      setMessage(
        isEditing
          ? "La catégorie a été modifiée."
          : "La catégorie a été ajoutée.",
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleCancelEdit() {
    setSelectedCategory(null);
    setFormKey((key) => key + 1);
  }

  function getProductCount(categoryId) {
    return products.filter((product) => product.category?.id === categoryId)
      .length;
  }

  function handleRequestDelete(category) {
    setMessage("");
    setError("");
    setCategoryToDelete(category);
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) return;

    setMessage("");
    setError("");

    try {
      await adminRequest(`/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      await loadData();

      if (selectedCategory?.id === categoryToDelete.id) {
        setSelectedCategory(null);
        setFormKey((key) => key + 1);
      }

      setCategoryToDelete(null);
      setMessage("La catégorie a été supprimée.");
    } catch (requestError) {
      setCategoryToDelete(null);

      setError(
        requestError.status === 409
          ? "Impossible de supprimer cette catégorie : des produits y sont associés."
          : requestError.message,
      );
    }
  }

  function handleCancelDelete() {
    setCategoryToDelete(null);
  }

  const sortedCategories = [...categories].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="admin-categories">
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

      {message && (
        <p className="admin-categories__message" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-categories__message" role="alert">
          {error}
        </p>
      )}

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

        {isLoading ? (
          <p role="status">Chargement des catégories...</p>
        ) : sortedCategories.length === 0 ? (
          <p className="admin-categories__empty">
            Aucune catégorie pour le moment.
          </p>
        ) : (
          <>
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

      {categoryToDelete && (
        <ConfirmDelete
          itemName={categoryToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

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
