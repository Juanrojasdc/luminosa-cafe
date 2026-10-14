function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={product.image}
        alt={product.name}
      />

      <div className="product-card__content">
        <div className="product-card__header">
          <h3>{product.name}</h3>

          <p className="product-card__price">
            {product.price.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__details">
          <span
            className={
              product.isAvailable
                ? "product-card__availability"
                : "product-card__availability product-card__availability--unavailable"
            }
          >
            {product.isAvailable ? "Disponible" : "Indisponible"}
          </span>

          {product.foodCharacteristics.length > 0 && (
            <>
              <span aria-hidden="true"> · </span>

              <span className="product-card__characteristics">
                {product.foodCharacteristics
                  .map((characteristic) => characteristic.name)
                  .join(", ")}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
