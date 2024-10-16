// src/Modules/HR/components/AppraisalRequests.js
import React from "react";
import Form from "../../components/FormComponent/Form"; // Adjust the import as needed

function AppraisalRequests() {
  const requestData = [
    {
      formId: "101206",
      user: "Suresh Yadav",
      designation: "Professor",
      date: "01 October 2024",
    },
    {
      formId: "101207",
      user: "Amit Sharma",
      designation: "Professor",
      date: "05 October 2024",
    },
  ];
  return <Form title="Appraisal Requests" data={requestData} />;
}

export default AppraisalRequests;
