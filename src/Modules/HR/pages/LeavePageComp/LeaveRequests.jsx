import React, { useEffect, useState } from "react";
import { Title, Select, TextInput, Container, Paper, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Eye } from "@phosphor-icons/react";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import { get_leave_requests } from "../../../../routes/hr/index";
import "./LeaveRequests.css";

function LeaveRequests() {
  const [requestData, setRequestData] = useState([]); // State for leave requests
  const [filteredData, setFilteredData] = useState([]); // State for filtered leave requests
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedStatus, setSelectedStatus] = useState("All"); // State for status filter
  const [selectedDate, setSelectedDate] = useState(""); // State for date filter (as string)
  const navigate = useNavigate();

  // Fetch leave requests from the backend
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      console.log("Fetching leave requests...");
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }
      try {
        const queryParams = new URLSearchParams();
        if (selectedDate) {
          queryParams.append("date", selectedDate);
        }
        const response = await fetch(
          `${get_leave_requests}?${queryParams.toString()}`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        const data = await response.json();

        // Sort the data by submissionDate in descending order (latest first)
        const sortedData = data.leave_requests.sort((a, b) => {
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        });

        setRequestData(sortedData); // Set fetched and sorted data
        setFilteredData(sortedData); // Initialize filtered data
        setLoading(false); // Set loading to false once data is fetched
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
        setLoading(false); // Set loading to false if there's an error
      }
    };
    fetchLeaveRequests(); // Call the function to fetch data
  }, [selectedDate]); // Re-fetch data when selectedDate changes

  // Handle "View" button click
  const handleViewClick = (view) => {
    navigate(`./view/${view}`);
  };

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFD700"; // Yellow
      case "Accepted":
        return "#32CD32"; // Green
      case "Rejected":
        return "#FF0000"; // Red
      default:
        return "#333"; // Default color
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setSelectedStatus(value);
    if (value === "All") {
      setFilteredData(requestData); // Show all data
    } else {
      const filtered = requestData.filter((item) => item.status === value);
      setFilteredData(filtered); // Filter by status
    }
  };

  // Handle date filter change
  const handleDateFilterChange = (event) => {
    setSelectedDate(event.target.value); // Update selectedDate state
  };

  // Table headers
  const headers = [
    "ID",
    "Submission Date",
    "Status",
    "Leave Start Date",
    "Leave End Date",
    "View",
  ];

  // Render loading component if data is still being fetched
  if (loading) {
    return <LoadingComponent loadingMsg="Fetching Leave Requests..." />;
  }

  return (
    <div className="app-container" style={{ padding: "20px" }}>
      {/* Filter Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "32px",
          padding: "0",
        }}
      >
        <span
          style={{
            color: "#4a5568",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          Below is the list of leave requests. Click on view to see more
          details.
        </span>
        <div style={{ display: "flex", gap: "16px" }}>
          <TextInput
            label="Filter by Date"
            placeholder="Select or enter a date"
            type="date"
            value={selectedDate}
            onChange={handleDateFilterChange}
            styles={{
              root: { width: "200px" },
              label: {
                color: "#1a365d",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "8px",
              },
              input: {
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                color: "#1a365d",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#2b6cb0",
                  boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                },
                "&:focus": {
                  borderColor: "#2b6cb0",
                  boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                  outline: "none",
                },
              },
            }}
          />
          <Select
            label="Filter by Status"
            placeholder="Select a status"
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            data={[
              { value: "All", label: "All" },
              { value: "Pending", label: "Pending" },
              { value: "Accepted", label: "Accepted" },
              { value: "Rejected", label: "Rejected" },
            ]}
            styles={{
              root: { width: "200px" },
              label: {
                color: "#1a365d",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "8px",
              },
              input: {
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                color: "#1a365d",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#2b6cb0",
                  boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                },
                "&:focus": {
                  borderColor: "#2b6cb0",
                  boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                  outline: "none",
                },
              },
              dropdown: {
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              },
              item: {
                padding: "8px 12px",
                "&[data-selected]": {
                  backgroundColor: "#2b6cb0",
                  color: "#ffffff",
                },
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      {filteredData.length === 0 ? (
        <EmptyTable
          title="No Leave Requests Found"
          message="There are no leave requests available. Please check back later."
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
              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handleViewClick(item.id)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f7fafc",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#edf2f7",
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
                    {item.submissionDate}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 700,
                        backgroundColor: "#ffffff",
                        color:
                          item.status === "Pending"
                            ? "#F59E0B"
                            : item.status === "Accepted"
                              ? "#10B981"
                              : "#EF4444",
                        display: "inline-block",
                        border: "2px solid",
                        borderColor:
                          item.status === "Pending"
                            ? "#F59E0B"
                            : item.status === "Accepted"
                              ? "#10B981"
                              : "#EF4444",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {item.status}
                    </span>
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
                    {item.leaveStartDate}
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
                    {item.leaveEndDate}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    <button
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        backgroundColor: "#ffffff",
                        border: "2px solid #2b6cb0",
                        borderRadius: "6px",
                        color: "#2b6cb0",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(43, 108, 176, 0.15)",
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 6px rgba(43, 108, 176, 0.2)",
                        },
                      }}
                    >
                      <Eye size={16} weight="bold" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeaveRequests;
