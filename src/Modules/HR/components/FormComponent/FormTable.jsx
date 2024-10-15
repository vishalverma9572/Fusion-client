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
import { BackgroundImage } from "@mantine/core";

const FormTable = ({ headers, data }) => {
  const [showCpdaFormHod, setShowCpdaFormHod] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null); // To track which form was clicked

  // Function to handle View click
  const handleViewClick = (formId) => {
    setSelectedFormId(formId); // Set the selected form
    setShowCpdaFormHod(true); // Show the form
  };

  return (
    <div className="form-table-container">
      {showCpdaFormHod ? (
        // Conditionally render the CpdaFormHod component when the "View" button is clicked
        <CpdaFormHod formId={selectedFormId} /> // Pass any props you want to the CpdaFormHod
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
                  onClick={() => handleViewClick(item.formId)}
                  // style={{ cursor: "pointer", color: "blue" }}
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
