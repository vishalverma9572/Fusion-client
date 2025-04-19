import React, { useEffect, useState } from "react";
import { Title, Select, TextInput, ActionIcon } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Eye, CaretUp, CaretDown } from "@phosphor-icons/react";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import { get_leave_requests } from "../../../../routes/hr/index";
import "./LeaveRequests.css";

function LeaveRequests() {
  const [requestData, setRequestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        if (selectedDate) queryParams.append("date", selectedDate);

        const response = await fetch(
          `${get_leave_requests}?${queryParams.toString()}`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        const data = await response.json();

        const sortedData = data.leave_requests.sort(
          (a, b) => new Date(b.submissionDate) - new Date(a.submissionDate),
        );

        setRequestData(sortedData);
        setFilteredData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [selectedDate]);

  const handleViewClick = (view) => {
    navigate(`./view/${view}`);
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

  const handleStatusFilterChange = (value) => {
    setSelectedStatus(value);
    if (value === "All") {
      setFilteredData(requestData);
    } else {
      const filtered = requestData.filter((item) => item.status === value);
      setFilteredData(filtered);
    }
  };

  const handleDateFilterChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // General sorting function
  const sortByColumn = (key, isDate = false) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = isDate ? new Date(a[key]) : a[key];
      const bVal = isDate ? new Date(b[key]) : b[key];
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    });

    setSortConfig({ key, direction });
    setFilteredData(sorted);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <CaretUp size={14} opacity={0.3} />;
    return sortConfig.direction === "asc" ? (
      <CaretUp size={14} />
    ) : (
      <CaretDown size={14} />
    );
  };

  if (loading) {
    return <LoadingComponent loadingMsg="Fetching Leave Requests..." />;
  }

  return (
    <div className="app-container">
      <Title
        order={2}
        style={{ fontWeight: "500", marginTop: "40px", marginLeft: "15px" }}
      >
        Leave Requests
      </Title>

      {/* Filters */}
      <div style={{ margin: "20px 15px", display: "flex", gap: "20px" }}>
        <TextInput
          label="Filter by Date"
          type="date"
          value={selectedDate}
          onChange={handleDateFilterChange}
          style={{ maxWidth: "300px" }}
        />
        <Select
          label="Filter by Status"
          value={selectedStatus}
          onChange={handleStatusFilterChange}
          data={[
            { value: "All", label: "All" },
            { value: "Pending", label: "Pending" },
            { value: "Accepted", label: "Accepted" },
            { value: "Rejected", label: "Rejected" },
          ]}
        />
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <EmptyTable
          title="No Leave Requests Found"
          message="There are no leave requests available. Please check back later."
        />
      ) : (
        <div className="form-table-container">
          <table className="form-table">
            <thead>
              <tr>
                <th className="table-header">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    ID
                    <ActionIcon
                      variant="subtle"
                      onClick={() => sortByColumn("id")}
                      ml={5}
                    >
                      {renderSortIcon("id")}
                    </ActionIcon>
                  </div>
                </th>

                <th className="table-header">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Submission Date
                    <ActionIcon
                      variant="subtle"
                      onClick={() => sortByColumn("submissionDate", true)}
                      ml={5}
                    >
                      {renderSortIcon("submissionDate")}
                    </ActionIcon>
                  </div>
                </th>

                <th className="table-header">Status</th>

                <th className="table-header">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Leave Start Date
                    <ActionIcon
                      variant="subtle"
                      onClick={() => sortByColumn("leaveStartDate", true)}
                      ml={5}
                    >
                      {renderSortIcon("leaveStartDate")}
                    </ActionIcon>
                  </div>
                </th>

                <th className="table-header">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Leave End Date
                    <ActionIcon
                      variant="subtle"
                      onClick={() => sortByColumn("leaveEndDate", true)}
                      ml={5}
                    >
                      {renderSortIcon("leaveEndDate")}
                    </ActionIcon>
                  </div>
                </th>

                <th className="table-header">View</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  className="table-row"
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewClick(item.id)}
                >
                  <td>{item.id}</td>
                  <td>{item.submissionDate}</td>
                  <td>
                    <span
                      style={{
                        color: getStatusColor(item.status),
                        fontWeight: "bold",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.leaveStartDate}</td>
                  <td>{item.leaveEndDate}</td>
                  <td>
                    <span className="text-link">
                      <Eye size={20} />
                      View
                    </span>
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
