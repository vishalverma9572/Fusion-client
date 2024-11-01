import React from "react";
import { Routes, Route } from "react-router-dom";
import Hr_Dashboard from "./pages/Hr_Dashboard"; // Ensure correct path
import LeavePage from "./pages/LeavePage"; // Adjust the import path if necessary
import CPDA_ADVANCE from "./pages/CPDA_ADVANCE";
import LTC from "./pages/LTC";
import Appraisal from "./pages/Appraisel";
import CPDA_Claim from "./pages/CPDA_Claim";
import FormView from "./pages/FormView";
import CPDA_ADVANCEView from "./pages/CPDA_ADVANCEPageComp/CPDA_ADVANCEView";

export default function HR() {
  return (
    <Routes>
      {/* Show welcome message at /hr */}
      <Route path="/" element={<Hr_Dashboard />} />
      {/* Render LeavePage at /hr/leave */}
      <Route path="leave/*" element={<LeavePage />} />
      <Route path="leave/*" element={<LeavePage />} />
      {/* Route for the CPDA Advance View page */}
      <Route path="cpda_adv/view/:id" element={<CPDA_ADVANCEView />} />
      <Route path="cpda_adv/*" element={<CPDA_ADVANCE />} />
      <Route path="ltc/*" element={<LTC />} />
      <Route path="appraisal/*" element={<Appraisal />} />
      <Route path="cpda_claim/*" element={<CPDA_Claim />} />
      <Route path="FormView/*" element={<FormView />} />
    </Routes>
  );
}
