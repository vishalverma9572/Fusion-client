// import React from "react";
// import "../../styles/FormTable.css";
// import { BackgroundImage } from "@mantine/core";
// import { Link } from "react-router-dom";
// import CpdaFormHod from "../../pages/cpdaFormHod"; // Import the component you want to render

// const FormTable = ({ headers, data }) => {
//   return (
//     <div className="form-table-container">
//       <table className="form-table">
//         <thead>
//           <tr
//             style={{
//               boxShadow: " inset 0 4px 10px rgba(0, 0, 0, 0.1)",
//               borderRadius: "50px",
//             }}
//           >
//             {headers.map((header, index) => (
//               <th style={{ color: "rgb(121, 121, 180)" }} key={index}>
//                 {header}
//               </th>
//             ))}
//           </tr>
//           {/* <br /> */}
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <>
//               <tr className="form-row" key={index}>
//                 <td className="form-cell">{item.formId}</td>
//                 <td className="form-cell">{item.user}</td>
//                 <td className="form-cell">{item.designation}</td>
//                 <td className="form-cell">{item.date}</td>
//                 <Link to="../../pages/cpdaFormHod">
//                   <td className="form-cell action view-column">View</td>
//                 </Link>
//                 <td className="form-cell action">Track</td>
//               </tr>
//               {/* <br /> */}
//             </>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FormTable;

import React, { useState } from "react";
import "../../styles/FormTable.css";
import CpdaFormHod from "../../pages/cpdaFormHod"; // Import the component you want to render
import LeaveFormHod from "../../pages/leaveFormHod";
import LTCFormHod from "../../pages/LTCFormHod";
import { BackgroundImage } from "@mantine/core";

const FormTable = ({ headers, data, formType }) => {
  const [showForm, setShowForm] = useState(null); // To track which form component to show
  const [selectedFormId, setSelectedFormId] = useState(null);

  // Function to handle View click
  const handleViewClick = (formId) => {
    setSelectedFormId(formId);
    setShowForm(true);
  };

  // Function to render the appropriate form component based on form type
  const renderFormComponent = () => {
    console.log(headers);
    console.log(formType);
    switch (formType) {
      case "Leave":
        return <LeaveFormHod formId={selectedFormId} />;
      case "CPDA":
        return <CpdaFormHod formId={selectedFormId} />;
      case "LTC":
        return <LTCFormHod formId={selectedFormId} />;
      case "Appraisal":
        return <AppraisalFormHod formId={selectedFormId} />;
      default:
        return null;
    }
  };

  return (
    <div className="form-table-container">
      {showForm ? (
        // Conditionally render the appropriate form component when the "View" button is clicked
        renderFormComponent() // Render the appropriate form component
      ) : (
        <table className="form-table">
          <thead>
            <tr
              style={{
                boxShadow: " inset 0 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "50px",
              }}
            >
              {headers.map((header, index) => (
                <th style={{ color: "rgb(121, 121, 180)" }} key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr className="form-row" key={index}>
                <td className="form-cell">{item.formId}</td>
                <td className="form-cell">{item.user}</td>
                <td className="form-cell">{item.designation}</td>
                <td className="form-cell">{item.date}</td>
                <td
                  className="form-cell action view-column"
                  onClick={() => handleViewClick(item.formId, item.formType)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  View
                </td>
                <td className="form-cell action">Track</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FormTable;
