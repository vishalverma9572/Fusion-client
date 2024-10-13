import React from "react";
import "../../styles/FormTable.css";
import { BackgroundImage } from "@mantine/core";

const FormTable = ({ headers, data }) => {
  return (
    <div className="form-table-container">
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
          {/* <br /> */}
        </thead>
        <tbody>
          {data.map((item, index) => (
            <>
              <tr className="form-row" key={index}>
                <td className="form-cell">{item.formId}</td>
                <td className="form-cell">{item.user}</td>
                <td className="form-cell">{item.designation}</td>
                <td className="form-cell">{item.date}</td>
                <td className="form-cell action view-column">View</td>
                <td className="form-cell action">Track</td>
              </tr>
              {/* <br /> */}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormTable;
