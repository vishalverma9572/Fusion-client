// src/Modules/HR/components/LeaveArchive.js
import React from "react";

import Form from "../../components/FormComponent/Form"; // Adjust the import as needed

function LeaveArchive() {
  const archiveData = [
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
  return <Form title="Leave Archive" data={archiveData} />;
}

export default LeaveArchive;
