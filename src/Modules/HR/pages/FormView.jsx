import React from "react";
import { Routes, Route } from "react-router-dom";
import LeaveFormView from "./LeavePageComp/LeaveFormView";
// import LTCFormView from './LTCFormView'; // Ensure the path is correct

const FormView = () => {
  return (
    <Routes>
      <Route path="leaveform" element={<LeaveFormView />} />
      {/* <Route path="/ltc" element={<LTCFormView />} /> */}
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default FormView;
