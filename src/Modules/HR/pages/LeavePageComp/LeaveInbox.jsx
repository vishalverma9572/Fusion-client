import React, { useEffect, useState } from "react";
import { Title, Select, TextInput } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Eye } from "@phosphor-icons/react";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import { get_leave_inbox } from "../../../../routes/hr/index";
import "./LeaveInbox.css";

function LeaveInbox() {
  const [inboxData, setInboxData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInboxData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const queryParams = new URLSearchParams();
        if (fromDate) queryParams.append("date", fromDate);

        const response = await fetch(
          `${get_leave_inbox}?${queryParams.toString()}`,
          { headers: { Authorization: `Token ${token}` } },
        );

        const data = await response.json();
        const combinedData = [
          ...data.leave_inbox.map((item) => ({
            ...item,
            type: "Leave Request",
            date: item.upload_date.split("T")[0],
          })),
          ...data.academic_res_inbox.map((item) => ({
            ...item,
            type: "Academic Responsibility",
            date: item.submissionDate,
          })),
          ...data.administrative_res_inbox.map((item) => ({
            ...item,
            type: "Administrative Responsibility",
            date: item.submissionDate,
          })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setInboxData(combinedData);
        applyFilters(selectedStatus, selectedType, combinedData);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    fetchInboxData();
  }, [fromDate]);

  const applyFilters = (status, type, data = inboxData) => {
    let filtered = data;

    if (status !== "All") {
      filtered = filtered.filter((item) => item.status === status);
    }

    if (type !== "All") {
      filtered = filtered.filter((item) => item.type === type);
    }

    setFilteredData(filtered);
  };

  const handleStatusFilterChange = (value) => {
    setSelectedStatus(value);
    applyFilters(value, selectedType);
  };

  const handleTypeFilterChange = (value) => {
    setSelectedType(value);
    applyFilters(selectedStatus, value);
  };

  const handleDateFilterChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleNavigation = (item) => {
    switch (item.type) {
      case "Academic Responsibility":
        navigate(`./handle_responsibility/${item.id}?query=academic`);
        break;
      case "Administrative Responsibility":
        navigate(`./handle_responsibility/${item.id}?query=administrative`);
        break;
      default:
        navigate(`./file_handler/${item.src_object_id}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFD700";
      case "Accepted":
        return "#32CD32";
      case "Rejected":
        return "#FF0000";
      default:
        return "#333";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Leave Request":
        return "#2b6cb0";
      case "Academic Responsibility":
        return "#0d98ba";
      case "Administrative Responsibility":
        return "#4a5568";
      default:
        return "#333";
    }
  };

  const headers = [
    "ID",
    "Submission Date",
    "Status",
    "Name",
    "Designation",
    "Type",
    "View",
  ];

  if (loading) return <LoadingComponent loadingMsg="Fetching Leave Inbox..." />;

  return (
    <div className="app-container" style={{ padding: "20px" }}>
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
          Below is the list of leave inbox entries. Click on view to see more
          details.
        </span>

        <div style={{ display: "flex", gap: "16px" }}>
          <TextInput
            label="Filter from Date"
            type="date"
            value={fromDate}
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
                },
              },
            }}
          />
          <Select
            label="Filter by Status"
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            data={["All", "Pending", "Accepted", "Rejected"].map((s) => ({
              value: s,
              label: s,
            }))}
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
                "&:hover": { backgroundColor: "#f8fafc" },
              },
            }}
          />
          <Select
            label="Filter by Type"
            value={selectedType}
            onChange={handleTypeFilterChange}
            data={[
              "All",
              "Leave Request",
              "Academic Responsibility",
              "Administrative Responsibility",
            ].map((t) => ({ value: t, label: t }))}
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
                "&:hover": { backgroundColor: "#f8fafc" },
              },
            }}
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <EmptyTable
          title="No Records Found"
          message="There are no records available."
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
                  onClick={() => handleNavigation(item)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f7fafc",
                    transition: "all 0.2s ease",
                    ":hover": {
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#edf2f7",
                    },
                  }}
                >
                  {/* ID Column */}
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

                  {/* Submission Date */}
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
                    {item.date}
                  </td>

                  {/* Status */}
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
                        color: getStatusColor(item.status),
                        display: "inline-block",
                        border: `2px solid ${getStatusColor(item.status)}`,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Name */}
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
                    {item.name || item.sent_by_user}
                  </td>

                  {/* Designation */}
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
                    {item.designation || item.sent_by_designation}
                  </td>

                  {/* Type */}
                  <td
                    style={{
                      padding: "8px 4px",
                      color: getTypeColor(item.type),
                      fontSize: "14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    {item.type}
                  </td>

                  {/* View */}
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

export default LeaveInbox;
