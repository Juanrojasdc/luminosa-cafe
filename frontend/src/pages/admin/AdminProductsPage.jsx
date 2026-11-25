import { useEffect, useState } from "react";

import AdminProductForm from "../../components/admin/AdminProductForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import { apiRequest, adminRequest, uploadImage } from "../../services/api";

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foodCharacteristics, setFoodCharacteristics] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  // Adapta la respuesta Symfony al formato del formulario React.
  function normalizeProduct(product) {
    if (!product?.category || !Array.isArray(product.foodCharacteristics)) {
      throw new Error("Format des données des produits inattendu.");
    }

    return {
      ...product,
      categoryId: product.category.id,
      foodCharacteristicIds: product.foodCharacteristics.map(
        (characteristic) => characteristic.id,
      ),
    };
  }

  async function loadProducts() {
    const data = await apiRequest("/products");
    if (!Array.isArray(data)) {
      throw new Error("Format des données des produits inattendu.");
    }
    setProducts(data.map(normalizeProduct));
  }

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [productsData, categoriesData, characteristicsData] =
          await Promise.all([
            apiRequest("/products"),
            apiRequest("/categories"),
            apiRequest("/food-characteristics"),
          ]);

        if (
          !Array.isArray(productsData) ||
          !Array.isArray(categoriesData) ||
          !Array.isArray(characteristicsData)
        ) {
          throw new Error("Format des données administratives inattendu.");
        }

        if (!active) return;

        setProducts(productsData.map(normalizeProduct));
        setCategories(categoriesData);
        setFoodCharacteristics(characteristicsData);
      } catch (err) {
        if (active) {
          setLoadFailed(true);
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts =
    selectedCategoryId === ""
      ? products
      : products.filter(
          (product) => String(product.categoryId) === selectedCategoryId,
        );

  function scrollToForm() {
    document.getElementById("admin-product-form-title")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleAddProduct() {
    setSelectedProduct(null);
    setProductToDelete(null);
    setMessage("");
    setError("");
    setSaveError("");
    setFormKey((key) => key + 1);
    scrollToForm();
  }

  function handleEditProduct(product) {
    setSelectedProduct(product);
    setProductToDelete(null);
    setMessage("");
    setError("");
    setSaveError("");
    setFormKey((key) => key + 1);
    scrollToForm();
  }

  async function handleSaveProduct(formData) {
    if (saving) return;

    setSaving(true);
    setSaveError("");
    setMessage("");
    let saved = false;

    try {
      let imagePath = null;

      if (formData.image instanceof File) {
        const result = await uploadImage(formData.image);
        imagePath = result.image;
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price,
        image: imagePath,
        removeImage: formData.removeImage,
        categoryId: formData.categoryId,
        foodCharacteristicIds: formData.foodCharacteristicIds,
        isAvailable: formData.isAvailable,
        isFeatured: formData.isFeatured,
        displayOrder: formData.displayOrder,
      };

      const isEditing = selectedProduct !== null;

      await adminRequest(
        isEditing ? `/products/${selectedProduct.id}` : "/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      saved = true;

      await loadProducts();

      setSelectedProduct(null);
      setFormKey((key) => key + 1);
      setMessage(
        isEditing
          ? "Le produit a été modifié avec succès."
          : "Le produit a été créé avec succès.",
      );
    } catch (err) {
      if (saved) {
        setSelectedProduct(null);
        setFormKey((key) => key + 1);
        setMessage("Le produit a été enregistré, mais la liste n'a pas pu être actualisée. Rechargez la page.");
      } else {
        setSaveError(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    if (saving) return;

    setSelectedProduct(null);
    setSaveError("");
    setFormKey((key) => key + 1);
  }

  function handleRequestDelete(product) {
    if (saving) return;

    setProductToDelete(product);
    setMessage("");
    setError("");
    setSaveError("");
  }

  async function handleConfirmDelete() {
    if (!productToDelete || saving) return;

    setSaving(true);
    setError("");
    let deleted = false;

    try {
      await adminRequest(`/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      deleted = true;

      await loadProducts();

      if (selectedProduct?.id === productToDelete.id) {
        setSelectedProduct(null);
        setFormKey((key) => key + 1);
      }

      setProductToDelete(null);
      setMessage("Le produit a été supprimé avec succès.");
    } catch (err) {
      if (deleted) {
        if (selectedProduct?.id === productToDelete.id) {
          setSelectedProduct(null);
          setFormKey((key) => key + 1);
        }
        setProductToDelete(null);
        setMessage("Le produit a été supprimé, mais la liste n'a pas pu être actualisée. Rechargez la page.");
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  function handleCancelDelete() {
    if (saving) return;

    setProductToDelete(null);
  }

  function getCategoryName(categoryId) {
    return (
      categories.find((category) => category.id === categoryId)?.name ??
      "Sans catégorie"
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <div>
          <h1>Produits</h1>
          <p className="admin-products__intro">
            Gérez les produits affichés sur la carte du café.
          </p>
        </div>

        <button
          type="button"
          className="admin-products__add-button"
          onClick={handleAddProduct}
          disabled={loading || saving}
        >
          Ajouter un produit
        </button>
      </div>

      {message && (
        <p className="admin-products__notice" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-products__notice" role="alert">
          {error}
        </p>
      )}

      <section
        className="admin-products__list"
        aria-labelledby="admin-products-list-title"
      >
        <h2 id="admin-products-list-title" className="admin-products__subtitle">
          Liste des produits
        </h2>

        <div className="admin-products__filter">
          <label htmlFor="admin-products-category-filter">
            Filtrer par catégorie
          </label>

          <select
            id="admin-products-category-filter"
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
          >
            <option value="">Toutes les catégories</option>

            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p role="status">Chargement des produits...</p>
        ) : loadFailed ? (
          null
        ) : products.length === 0 ? (
          <p className="admin-products__empty">Aucun produit pour le moment.</p>
        ) : filteredProducts.length === 0 ? (
          <p className="admin-products__empty">
            Aucun produit dans cette catégorie.
          </p>
        ) : (
          <>
            <div className="admin-products__table-wrapper">
              <table className="admin-products__table">
                <thead>
                  <tr>
                    <th scope="col">Produit</th>
                    <th scope="col">Catégorie</th>
                    <th scope="col">Prix</th>
                    <th scope="col">Disponibilité</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{getCategoryName(product.categoryId)}</td>
                      <td>{priceFormatter.format(Number(product.price))}</td>
                      <td>
                        <span
                          className={
                            product.isAvailable
                              ? "admin-products__status admin-products__status--available"
                              : "admin-products__status admin-products__status--unavailable"
                          }
                        >
                          {product.isAvailable ? "Disponible" : "Indisponible"}
                        </span>
                      </td>
                      <td>{product.description}</td>
                      <td>
                        <div className="admin-products__actions">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            disabled={saving}
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            className="admin-products__delete-button"
                            onClick={() => handleRequestDelete(product)}
                            disabled={saving}
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

            <div className="admin-products__cards">
              {filteredProducts.map((product) => (
                <article className="admin-products__card" key={product.id}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <p>
                    <strong>Catégorie :</strong>{" "}
                    {getCategoryName(product.categoryId)}
                  </p>

                  <p>
                    <strong>Prix :</strong>{" "}
                    {priceFormatter.format(Number(product.price))}
                  </p>

                  <p>
                    <strong>Disponibilité :</strong>{" "}
                    {product.isAvailable ? "Disponible" : "Indisponible"}
                  </p>

                  <div className="admin-products__actions">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(product)}
                      disabled={saving}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="admin-products__delete-button"
                      onClick={() => handleRequestDelete(product)}
                      disabled={saving}
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

      {productToDelete && (
        <ConfirmDelete
          itemName={productToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {!loading && (
        <AdminProductForm
          key={formKey}
          product={selectedProduct}
          products={products}
          categories={categories}
          foodCharacteristics={foodCharacteristics}
          onSubmit={handleSaveProduct}
          onCancel={handleCancelEdit}
          error={saveError}
          isSaving={saving}
        />
      )}
    </div>
  );
}

export default AdminProductsPage;
