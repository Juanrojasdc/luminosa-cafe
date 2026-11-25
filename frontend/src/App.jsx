import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.jsx";
import AdminEventsPage from "./pages/admin/AdminEventsPage.jsx";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Luminosa — Cafétéria à Bordeaux",
      "/menu": "La carte | Luminosa",
      "/events": "Événements | Luminosa",
      "/contact": "Contact | Luminosa",
    };

    document.title = titles[pathname] ?? "Luminosa";
  }, [pathname]);

  return (
    <Routes>
      {/* Páginas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Ruta para las páginas inexistentes */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Administración */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="events" element={<AdminEventsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
