import { Link } from "react-router-dom";
import homeInterior from "../assets/img/home-interior.png";

function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero__content">
          <h1>Bienvenue chez Luminosa</h1>

          <p className="home-hero__intro">
            Cafés, matchas et douceurs dans une atmosphère calme au cœur de
            Bordeaux.
          </p>

          <p className="home-hero__intro-desktop">
            Cafés, matchas et douceurs dans une atmosphère calme au cœur de
            Bordeaux. Un lieu pensé pour prendre le temps, se retrouver et
            profiter d'une pause.
          </p>

          <Link className="home-hero__cta home-hero__cta--desktop" to="/menu">
            Découvrir la carte
          </Link>
        </div>

        <img
          className="home-hero__image"
          src={homeInterior}
          alt="Intérieur de la cafétéria Luminosa à Bordeaux"
        />

        <div className="home-hero__mobile-actions">
          <p className="home-hero__selection">
            Découvrez notre sélection de cafés, matchas et douceurs, à savourer
            selon vos envies.
          </p>

          <Link className="home-hero__cta" to="/menu">
            Découvrir la carte
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
