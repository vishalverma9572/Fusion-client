import React from "react";
import Form from "../../components/FormComponent/Form"; // Adjust the import as needed

function Cpda_ADVANCERequests() {
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
      formId: "101208",
      user: "Mithilesh Lal Das",
      designation: "Asst. Professor",
      date: "09 November 2023",
    },
  ];
  return <Form title="CPDA Adv Requests" data={requestData} />;
}

export default Cpda_ADVANCERequests;
