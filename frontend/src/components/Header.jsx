import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icon/logo.webp";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__inner">
        <Link className="header__logo" to="/" onClick={closeMenu}>
          <img
            className="header__logo-image"
            src={logo}
            alt="Luminosa – Accueil"
          />
        </Link>

        <nav
          id="main-navigation"
          className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}
          aria-label="Navigation principale"
        >
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "header__nav-link--active" : undefined
            }
          >
            HOME
          </NavLink>

          <NavLink
            to="/menu"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "header__nav-link--active" : undefined
            }
          >
            MENU
          </NavLink>

          <NavLink
            to="/events"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "header__nav-link--active" : undefined
            }
          >
            EVENTS
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "header__nav-link--active" : undefined
            }
          >
            CONTACT
          </NavLink>
        </nav>

        <button
          className={`header__menu-button ${
            isMenuOpen ? "header__menu-button--open" : ""
          }`}
          type="button"
          aria-label={
            isMenuOpen
              ? "Fermer le menu de navigation"
              : "Ouvrir le menu de navigation"
          }
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMenuOpen((previousState) => !previousState)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
