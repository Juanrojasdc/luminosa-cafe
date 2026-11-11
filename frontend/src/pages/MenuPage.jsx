import { useEffect, useState } from "react";
import CategoryNavigation from "../components/menu/CategoryNavigation";
import ProductCard from "../components/menu/ProductCard";

function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch("/api/categories", { signal: controller.signal }),
          fetch("/api/products", { signal: controller.signal }),
        ]);

        if (!categoriesResponse.ok || !productsResponse.ok) {
          throw new Error("Impossible de charger la carte.");
        }

        const [categoriesData, productsData] = await Promise.all([
          categoriesResponse.json(),
          productsResponse.json(),
        ]);

        if (!Array.isArray(categoriesData) || !Array.isArray(productsData)) {
          throw new Error("Format de données inattendu.");
        }

        const sortedCategories = [...categoriesData].sort(
          (firstCategory, secondCategory) =>
            firstCategory.displayOrder - secondCategory.displayOrder,
        );

        const normalizedProducts = productsData.map((product) => ({
          ...product,
          categoryId: product.category?.id ?? null,
          price: Number(product.price),
        }));

        setCategories(sortedCategories);
        setProducts(normalizedProducts);
        setActiveCategoryId(sortedCategories[0]?.id ?? null);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadMenu();

    return () => controller.abort();
  }, []);

  const activeCategory = categories.find(
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

        {isLoading ? (
          <p role="status">Chargement de la carte...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : categories.length === 0 ? (
          <p className="menu-page__empty">
            Aucune catégorie disponible pour le moment.
          </p>
        ) : (
          <>
            <CategoryNavigation
              categories={categories}
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
                    Aucun produit dans cette catégorie pour le moment.
                  </p>
                )}
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default MenuPage;
