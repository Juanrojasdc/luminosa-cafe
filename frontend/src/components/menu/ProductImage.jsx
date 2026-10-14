import { useState } from "react";

function ProductImage({ src, alt }) {
  const [failedSrc, setFailedSrc] = useState(null);

  const hasValidImage = Boolean(src) && failedSrc !== src;

  if (!hasValidImage) {
    return (
      <div
        className="product-card__image-placeholder"
        role="img"
        aria-label={`Photographie non disponible pour ${alt}`}
      >
        <span aria-hidden="true">LUMINOSA</span>
      </div>
    );
  }

  return (
    <img
      className="product-card__image"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}

export default ProductImage;
