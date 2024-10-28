import React from "react";
import { Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Eye, MapPin } from "@phosphor-icons/react";
import "./Table.css"; // Ensure this path is correct
import { EmptyTable } from "./EmptyTable";

const ArchiveTable = ({ title, data }) => {
  const navigate = useNavigate();

  const headers = ["FormID", "User", "Designation", "Date", "View", "Track"];

  const handleViewClick = (view) => {
    navigate(view); // Redirect to the form view
  };

  return (
    <div className="app-container">
      <Title
        order={2}
        style={{ fontWeight: "500", marginTop: "40px", marginLeft: "15px" }}
      >
        {title}
      </Title>
      {data.length == 0 && (
        <EmptyTable
          title="No new Archive requests found!"
          message="There is no new Archive request available. Please check back later."
        />
      )}
      {headers.length > 0 && data.length > 0 ? (
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
                  <td>{item.id}</td>
                  <td>{item.uploader}</td>
                  <td>{item.designation}</td>
                  <td>{item.upload_date}</td>
                  <td>
                    <span
                      className="text-link"
                      onClick={() => handleViewClick(`/archive/${item.id}`)}
                    >
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
      ) : (
        <div className="loading-spinner">Loading</div>
      )}
    </div>
  );
};

export default ArchiveTable;
