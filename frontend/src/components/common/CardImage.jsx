import { useState } from "react";

function CardImage({ src, alt, className, placeholderClassName }) {
  // Guardamos la ruta que ha fallado al cargar.
  const [failedSrc, setFailedSrc] = useState(null);

  // Si no hay imagen o falla la carga, mostramos el placeholder.
  const hasImage = Boolean(src) && failedSrc !== src;

  if (!hasImage) {
    return (
      <div
        className={placeholderClassName}
        role="img"
        aria-label={`Photographie non disponible pour ${alt}`}
      >
        <span aria-hidden="true">LUMINOSA</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}

export default CardImage;
