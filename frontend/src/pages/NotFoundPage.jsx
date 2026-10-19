import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-page__content">
        <p className="not-found-page__eyebrow">
          OUPS, CETTE PAGE EST INTROUVABLE
        </p>

        <h1 className="not-found-page__title">404</h1>

        <p className="not-found-page__message">
          Il semblerait que cette page se soit égarée. Heureusement, une pause
          café n'est jamais très loin.
        </p>

        <Link to="/" className="not-found-page__link">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
