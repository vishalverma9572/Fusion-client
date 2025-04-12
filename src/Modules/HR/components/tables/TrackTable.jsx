import React from "react";
import { Title } from "@mantine/core";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import { EmptyTable } from "../../components/tables/EmptyTable";

const TrackTable = ({ title, data, exampleItems }) => {
  const headers = [
    "Record Id",
    "Receive Date",
    "Forward Date",
    "Remarks",
    "Sender's username",
    "Receiver's name",
    "Receiver's Designation",
  ];

  return (
    <div className="app-container" style={{ padding: "20px" }}>
      <HrBreadcrumbs items={exampleItems} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "32px",
          padding: "0",
        }}
      ></div>

      {data.length === 0 ? (
        <EmptyTable
          title="No Tracking Records Found"
          message="There are no tracking records available."
        />
      ) : (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow:
              "0 4px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              backgroundColor: "#ffffff",
            }}
          >
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      padding: "14px 4px",
                      textAlign: "center",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                      whiteSpace: "nowrap",
                      backgroundColor: "#2b6cb0",
                      borderBottom: "2px solid #2c5282",
                      borderRight:
                        index !== headers.length - 1
                          ? "1px solid #4a90e2"
                          : "none",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    cursor: "pointer",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f7fafc",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  <td
                    style={{
                      padding: "8px 4px",
                      color: "#1a365d",
                      fontSize: "14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    {item.id}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      color: "#1a365d",
                      fontSize: "14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    {item.receive_date && (
                      <>
                        {item.receive_date.split("T")[0]}
                        <br />
                        {item.receive_date.split("T")[1].split(".")[0]}
                      </>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      color: "#1a365d",
                      fontSize: "14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    {item.forward_date && (
                      <>
                        {item.forward_date.split("T")[0]}
                        <br />
                        {item.forward_date.split("T")[1].split(".")[0]}
                      </>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      color: "#1a365d",
                      fontSize: "14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    {item.remarks}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      color: "#1a365d",
                      fontSize: "14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    {item.current_id}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      color: "#1a365d",
                      fontSize: "14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    {item.receiver_id}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      color: "#1a365d",
                      fontSize: "14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    {item.receive_design}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrackTable;
