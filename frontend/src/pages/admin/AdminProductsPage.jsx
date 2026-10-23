import { useState } from "react";

import AdminProductForm from "../../components/admin/AdminProductForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";

import {
  categories,
  foodCharacteristics,
  products as initialProducts,
} from "../../data/menuData";

// Formato de precios utilizado en la administración.
const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function AdminProductsPage() {
  // Los datos se gestionan temporalmente en React.
  // Symfony sustituirá esta lógica cuando esté disponible la API.
  const [products, setProducts] = useState(initialProducts);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [formKey, setFormKey] = useState(0);

  // Categoría seleccionada para filtrar la lista de productos.
  // El valor vacío representa todas las categorías.
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // El filtro afecta únicamente a la visualización.
  // No modifica ni elimina productos del estado original.
  const filteredProducts =
    selectedCategoryId === ""
      ? products
      : products.filter(
          (product) => String(product.categoryId) === selectedCategoryId,
        );

  // Muestra un formulario vacío para crear un producto.
  function handleAddProduct() {
    setSelectedProduct(null);
    setProductToDelete(null);
    setFormKey((previousKey) => previousKey + 1);

    document.getElementById("admin-product-form-title")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Carga los datos del producto seleccionado en el formulario.
  function handleEditProduct(product) {
    setSelectedProduct({
      ...product,
      foodCharacteristicIds: product.foodCharacteristics.map(
        (characteristic) => characteristic.id,
      ),
    });

    setProductToDelete(null);
    setFormKey((previousKey) => previousKey + 1);

    document.getElementById("admin-product-form-title")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Crea o modifica un producto en el estado local.
  function handleSaveProduct(formData) {
    const selectedCharacteristics = foodCharacteristics.filter(
      (characteristic) =>
        formData.foodCharacteristicIds.includes(characteristic.id),
    );

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price,
      categoryId: formData.categoryId,
      foodCharacteristics: selectedCharacteristics,
      isAvailable: formData.isAvailable,
      isFeatured: formData.isFeatured,
      displayOrder: formData.displayOrder,
    };

    if (selectedProduct) {
      // Edición: conservamos la imagen si no se elige otra.
      const updatedProduct = {
        ...productData,
        id: selectedProduct.id,
        image: formData.image
          ? URL.createObjectURL(formData.image)
          : selectedProduct.image,
      };

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.id === selectedProduct.id ? updatedProduct : product,
        ),
      );
    } else {
      // Creación: asignamos un identificador local provisional.
      const newProduct = {
        ...productData,
        id: Math.max(0, ...products.map((product) => product.id)) + 1,
        image: formData.image ? URL.createObjectURL(formData.image) : null,
      };

      setProducts((previousProducts) => [...previousProducts, newProduct]);
    }

    setSelectedProduct(null);
    setFormKey((previousKey) => previousKey + 1);
  }

  // Cancela la edición y devuelve el formulario a su estado inicial.
  function handleCancelEdit() {
    setSelectedProduct(null);
    setFormKey((previousKey) => previousKey + 1);
  }

  // Solicita confirmación antes de eliminar.
  function handleRequestDelete(product) {
    setProductToDelete(product);
  }

  // Elimina el producto únicamente después de confirmar.
  function handleConfirmDelete() {
    if (!productToDelete) {
      return;
    }

    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== productToDelete.id),
    );

    if (selectedProduct?.id === productToDelete.id) {
      setSelectedProduct(null);
      setFormKey((previousKey) => previousKey + 1);
    }

    setProductToDelete(null);
  }

  function handleCancelDelete() {
    setProductToDelete(null);
  }

  // Recupera el nombre de la categoría asociada al producto.
  function getCategoryName(categoryId) {
    return (
      categories.find((category) => category.id === categoryId)?.name ??
      "Sans catégorie"
    );
  }

  return (
    <div className="admin-products">
      {/* Encabezado de la página */}
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
        >
          Ajouter un produit
        </button>
      </div>

      {/* Información sobre los datos temporales */}
      <p className="admin-products__notice">
        Mode démonstration : les modifications ne sont pas encore enregistrées
        dans la base de données.
      </p>

      {/* Lista de productos */}
      <section
        className="admin-products__list"
        aria-labelledby="admin-products-list-title"
      >
        <h2 id="admin-products-list-title" className="admin-products__subtitle">
          Liste des produits
        </h2>

        {/* Filtro por categoría */}
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

        {products.length === 0 ? (
          <p className="admin-products__empty">Aucun produit pour le moment.</p>
        ) : filteredProducts.length === 0 ? (
          <p className="admin-products__empty">
            Aucun produit dans cette catégorie.
          </p>
        ) : (
          <>
            {/* Tabla para escritorio */}
            <div className="admin-products__table-wrapper">
              <table className="admin-products__table">
                <thead>
                  <tr>
                    <th scope="col">Produit</th>
                    <th scope="col">Catégorie</th>
                    <th scope="col">Prix</th>
                    <th scope="col">Disponibilité</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>

                      <td>{getCategoryName(product.categoryId)}</td>

                      <td>{priceFormatter.format(product.price)}</td>

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

                      <td>
                        <div className="admin-products__actions">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            className="admin-products__delete-button"
                            onClick={() => handleRequestDelete(product)}
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

            {/* Tarjetas para móvil */}
            <div className="admin-products__cards">
              {filteredProducts.map((product) => (
                <article className="admin-products__card" key={product.id}>
                  <h3>{product.name}</h3>

                  <p>
                    <strong>Catégorie :</strong>{" "}
                    {getCategoryName(product.categoryId)}
                  </p>

                  <p>
                    <strong>Prix :</strong>{" "}
                    {priceFormatter.format(product.price)}
                  </p>

                  <p>
                    <strong>Disponibilité :</strong>{" "}
                    {product.isAvailable ? "Disponible" : "Indisponible"}
                  </p>

                  <div className="admin-products__actions">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(product)}
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      className="admin-products__delete-button"
                      onClick={() => handleRequestDelete(product)}
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
      {productToDelete && (
        <ConfirmDelete
          itemName={productToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Formulario de creación y edición */}
      <AdminProductForm
        key={formKey}
        product={selectedProduct}
        categories={categories}
        foodCharacteristics={foodCharacteristics}
        onSubmit={handleSaveProduct}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}

export default AdminProductsPage;
