// src/Modules/HR/components/CPDA_ClaimRequests.js
import React from "react";
import Form from "../../components/FormComponent/Form"; // Adjust the import as needed

function CPDA_ClaimRequests() {
  const requestData = [
    {
      formId: "101205",
      user: "Rajesh Kumar",
      designation: "Professor",
      date: "07 November 2024",
    },
    {
      formId: "101204",
      user: "Vishal Kumar",
      designation: "Asst. Professor",
      date: "07 November 2024",
    },
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
  return <Form title="CPDA Claim Requests" data={requestData} />;
}

export default CPDA_ClaimRequests;
