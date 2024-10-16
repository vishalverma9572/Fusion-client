import React from "react";
import "./FormTable.css";
import { Eye, MapPin } from "@phosphor-icons/react"; // Importing the icons

const FormTable = ({ headers, data }) => {
  return (
    <div className="form-table-container">
      <table className="form-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="table-header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr className="table-row" key={index}>
              <td>{item.formId}</td>
              <td>{item.user}</td>
              <td>{item.designation}</td>
              <td>{item.date}</td>
              <td>
                <span className="text-link">
                  <Eye size={20} />
                  View
                </span>
              </td>
              <td>
                <span className="text-link">
                  <MapPin size={20} />
                  Track
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormTable;
