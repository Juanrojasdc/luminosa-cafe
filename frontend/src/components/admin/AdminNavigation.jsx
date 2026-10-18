import { NavLink } from "react-router-dom";

function AdminNavigation() {
  return (
    <nav className="admin-navigation" aria-label="Navigation administrative">
      <NavLink
        to="/admin/products"
        className={({ isActive }) =>
          `admin-navigation__link${isActive ? " admin-navigation__link--active" : ""}`
        }
      >
        Produits
      </NavLink>

      <NavLink
        to="/admin/categories"
        className={({ isActive }) =>
          `admin-navigation__link${isActive ? " admin-navigation__link--active" : ""}`
        }
      >
        Catégories
      </NavLink>

      <NavLink
        to="/admin/events"
        className={({ isActive }) =>
          `admin-navigation__link${isActive ? " admin-navigation__link--active" : ""}`
        }
      >
        Événements
      </NavLink>

      <button
        type="button"
        className="admin-navigation__logout"
        disabled
        title="Disponible après l'intégration de l'authentification"
      >
        Déconnexion
      </button>
    </nav>
  );
}

export default AdminNavigation;
