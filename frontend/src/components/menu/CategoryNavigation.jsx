function CategoryNavigation({
  categories,
  activeCategoryId,
  onCategoryChange,
}) {
  const sortedCategories = [...categories].sort(
    (firstCategory, secondCategory) =>
      firstCategory.displayOrder - secondCategory.displayOrder,
  );

  return (
    <nav className="category-navigation" aria-label="Catégories de la carte">
      {sortedCategories.map((category) => (
        <button
          key={category.id}
          className={`category-navigation__button ${
            activeCategoryId === category.id
              ? "category-navigation__button--active"
              : ""
          }`}
          type="button"
          aria-pressed={activeCategoryId === category.id}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}

export default CategoryNavigation;
