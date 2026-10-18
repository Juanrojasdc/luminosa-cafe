import { Outlet } from "react-router-dom";

import AdminHeader from "../components/admin/AdminHeader.jsx";
import AdminNavigation from "../components/admin/AdminNavigation.jsx";

function AdminLayout() {
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
