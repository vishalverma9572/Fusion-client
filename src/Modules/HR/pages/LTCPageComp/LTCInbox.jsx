// src/Modules/HR/components/LTCInbox.js
import React from "react";

import Form from "../../components/FormComponent/Form"; // Adjust the import as needed

function LTCInbox() {
  const inboxData = [
    {
      formId: "101206",
      user: "Suresh Yadav",
      designation: "Professor",
      date: "01 October 2024",
    },
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
      formId: "101208",
      user: "Mithilesh Lal Das",
      designation: "Asst. Professor",
      date: "09 November 2023",
    },
  ];
  return <Form title="LTC Inbox" data={inboxData} />;
}

export default LTCInbox;
