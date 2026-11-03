
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import PetRegistration from "../pages/PetRegistration";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro-pet" element={<PetRegistration />} />

      {/* Futuras rotas administrativas */}
    </Routes>
  );
}
