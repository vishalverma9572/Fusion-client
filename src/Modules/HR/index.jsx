import React from "react";
import { Routes, Route } from "react-router-dom";
import LeavePage from "./pages/LeavePage"; // Adjust the import path if necessary
import LeaveArchive from "./pages/LeavePageComp/LeaveArchive";
import CPDA_ADVANCE from "./pages/CPDA_ADVANCE";
import LTC from "./pages/LTC";
import Appraisal from "./pages/Appraisel";
import CPDA_Claim from "./pages/CPDA_Claim";
// import CpdaForm from "./pages/CpdaForm"; // Import CpdaForm if needed

export default function HR() {
  return (
    <Routes>
      {/* Show welcome message at /hr */}
      <Route path="/" element={<div>Welcome to HR Management</div>} />

      {/* Render LeavePage at /hr/leave */}
      <Route path="leave" element={<LeavePage />} />
      <Route path="cpda_adv" element={<CPDA_ADVANCE />} />
      <Route path="ltc" element={<LTC />} />
      <Route path="appraisal" element={<Appraisal />} />
      <Route path="cpda_claim" element={<CPDA_Claim />} />

      {/* Render CpdaForm at /hr/cpda */}
      {/* <Route path="cpda" element={<CpdaForm />} /> */}
    </Routes>
  );
}
