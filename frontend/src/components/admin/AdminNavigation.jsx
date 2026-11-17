import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "../../services/api.js";

function AdminNavigation() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setIsLoggingOut(true);
    setError("");

    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch {
      setError("Impossible de se déconnecter. Veuillez réessayer.");
    } finally {
      setIsLoggingOut(false);
    }
  }

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
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
      </button>

      {error && <p role="alert">{error}</p>}
    </nav>
  );
}

export default AdminNavigation;
