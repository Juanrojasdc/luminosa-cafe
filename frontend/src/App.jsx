import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}

export default App;
