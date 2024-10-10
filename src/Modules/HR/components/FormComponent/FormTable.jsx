import React from "react";
import "./FormTable.css";

const FormTable = ({ headers, data }) => {
  return (
    <div className="form-table-container">
      <table className="form-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.formId}</td>
              <td>{item.user}</td>
              <td>{item.designation}</td>
              <td>{item.date}</td>
              <td className="action">View</td>
              <td className="action">Track</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormTable;
