import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AdminHeader from "../components/admin/AdminHeader.jsx";
import AdminNavigation from "../components/admin/AdminNavigation.jsx";
import { getCurrentAdmin } from "../services/api.js";

function AdminLayout() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    getCurrentAdmin()
      .then(() => {
        if (active) setStatus("authenticated");
      })
      .catch(() => {
        if (active) setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <p role="status">Vérification de la session...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminHeader />

      <div className="admin-layout__body">
        <AdminNavigation />

        <main className="admin-layout__main" id="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
