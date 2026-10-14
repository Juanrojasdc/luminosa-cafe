import { useState } from "react";
import CategoryNavigation from "../components/menu/CategoryNavigation";
import ProductCard from "../components/menu/ProductCard";
import { categories, products } from "../data/menuData";

function MenuPage() {
  const sortedCategories = [...categories].sort(
    (firstCategory, secondCategory) =>
      firstCategory.displayOrder - secondCategory.displayOrder,
  );

  const [activeCategoryId, setActiveCategoryId] = useState(
    sortedCategories[0]?.id ?? null,
  );

  const activeCategory = sortedCategories.find(
    (category) => category.id === activeCategoryId,
  );

  const visibleProducts = products
    .filter((product) => product.categoryId === activeCategoryId)
    .sort(
      (firstProduct, secondProduct) =>
        firstProduct.displayOrder - secondProduct.displayOrder,
    );

  return (
    <main className="menu-page">
      <section className="menu-page__catalog">
        <header className="menu-page__header">
          <p className="menu-page__eyebrow">MENU</p>

          <h1>La carte</h1>

          <p className="menu-page__intro">
            Découvrez notre sélection, organisée par catégorie.
          </p>
        </header>

        <CategoryNavigation
          categories={sortedCategories}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setActiveCategoryId}
        />

        {activeCategory && (
          <section
            className="menu-page__category"
            aria-labelledby="active-category-title"
          >
            <h2 id="active-category-title">{activeCategory.name}</h2>

            {visibleProducts.length > 0 ? (
              <div className="menu-page__products">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="menu-page__empty">
                Aucun produit disponible dans cette catégorie.
              </p>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default MenuPage;
