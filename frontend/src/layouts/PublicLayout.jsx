import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PublicLayout;
