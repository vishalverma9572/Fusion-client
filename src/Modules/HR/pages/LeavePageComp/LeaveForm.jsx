import React, { useState, useEffect } from "react";
import {
  TextInput,
  Checkbox,
  Button,
  Title,
  Box,
  Grid,
  Group,
  Textarea,
} from "@mantine/core";

import { IconInfoCircle } from "@tabler/icons-react";
import { Loader } from "@mantine/core";

import { get_form_initials, submit_leave_form } from "../../../../routes/hr";
import "./LeaveForm.css";
import SearchAndSelectUser from "../../components/SearchAndSelectUser";
import { useNavigate } from "react-router-dom";

const LeaveForm = () => {
  const [stationLeave, setStationLeave] = useState(false);
  const [academicResponsibility, setAcademicResponsibility] = useState(null);
  const [administrativeResponsibility, setAdministrativeResponsibility] =
    useState(null);
  const [forwardTo, setForwardTo] = useState(null);
  const [attachedPdf, setAttachedPdf] = useState(null);
  const [formData, setFormData] = useState({
    leaveStartDate: "",
    leaveEndDate: "",
    purpose: "",
    casualLeave: "0",
    vacationLeave: "0",
    earnedLeave: "0",
    commutedLeave: "0",
    specialCasualLeave: "0",
    restrictedHoliday: "0",
    halfPayLeave: "0",
    maternityLeave: "0",
    childCareLeave: "0",
    paternityLeave: "0",
    remarks: "",
    stationLeaveStartDate: "",
    stationLeaveEndDate: "",
    stationLeaveAddress: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    name: "",
    last_selected_role: "",
    pfno: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSubmit, setActiveSubmit] = useState(true);

  const fetchDetails = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found!");
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(get_form_initials, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Error fetching details: ${response.statusText}`);
      }
      const data = await response.json();
      setDetails(data);
    } catch (err) {
      setError("Failed to fetch user details.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setAttachedPdf(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async () => {
    setActiveSubmit(false);

    // Validation Checks
    if (
      !formData.leaveStartDate ||
      !formData.leaveEndDate ||
      !formData.purpose ||
      !forwardTo
    ) {
      alert("Required fields: Leave dates, purpose, and forward to!");
      setActiveSubmit(true);
      return;
    }

    if (
      stationLeave &&
      (!formData.stationLeaveStartDate ||
        !formData.stationLeaveEndDate ||
        !formData.stationLeaveAddress)
    ) {
      alert(
        "Station leave details are required when station leave is checked!",
      );
      setActiveSubmit(true);
      return;
    }

    // Ensure number of leaves are non-negative integers
    const leaveFields = [
      "casualLeave",
      "vacationLeave",
      "earnedLeave",
      "commutedLeave",
      "specialCasualLeave",
      "restrictedHoliday",
      "halfPayLeave",
      "maternityLeave",
      "childCareLeave",
      "paternityLeave",
    ];

    for (const field of leaveFields) {
      if (!/^\d+$/.test(formData[field])) {
        alert(
          `"${field.replace(/([A-Z])/g, " $1")}" must be a non-negative integer!`,
        );
        setActiveSubmit(true);
        return;
      }
    }

    // Prepare form data for submission
    const finalFormData = new FormData();
    finalFormData.append("name", details.name);
    finalFormData.append("designation", details.last_selected_role);
    finalFormData.append("pfno", details.pfno);
    finalFormData.append("department", details.department);
    finalFormData.append("date", today);
    finalFormData.append("leaveStartDate", formData.leaveStartDate);
    finalFormData.append("leaveEndDate", formData.leaveEndDate);
    finalFormData.append("purpose", formData.purpose);

    // Append all leave types
    finalFormData.append("casualLeave", formData.casualLeave);
    finalFormData.append("vacationLeave", formData.vacationLeave);
    finalFormData.append("earnedLeave", formData.earnedLeave);
    finalFormData.append("commutedLeave", formData.commutedLeave);
    finalFormData.append("specialCasualLeave", formData.specialCasualLeave);
    finalFormData.append("restrictedHoliday", formData.restrictedHoliday);
    finalFormData.append("halfPayLeave", formData.halfPayLeave);
    finalFormData.append("maternityLeave", formData.maternityLeave);
    finalFormData.append("childCareLeave", formData.childCareLeave);
    finalFormData.append("paternityLeave", formData.paternityLeave);

    finalFormData.append("remarks", formData.remarks || "N/A");
    finalFormData.append("stationLeave", stationLeave);
    finalFormData.append(
      "stationLeaveStartDate",
      formData.stationLeaveStartDate,
    );
    finalFormData.append("stationLeaveEndDate", formData.stationLeaveEndDate);
    finalFormData.append("stationLeaveAddress", formData.stationLeaveAddress);

    // Only append if selected
    if (academicResponsibility) {
      finalFormData.append("academicResponsibility", academicResponsibility.id);
      finalFormData.append(
        "academicResponsibility_designation",
        academicResponsibility.designation,
      );
    }

    if (administrativeResponsibility) {
      finalFormData.append(
        "administrativeResponsibility",
        administrativeResponsibility.id,
      );
      finalFormData.append(
        "administrativeResponsibility_designation",
        administrativeResponsibility.designation,
      );
    }

    finalFormData.append("forwardTo", forwardTo.id);
    finalFormData.append("forwardTo_designation", forwardTo.designation);

    if (attachedPdf) {
      finalFormData.append("attached_pdf", attachedPdf);
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(submit_leave_form, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: finalFormData,
      });

      if (!response.ok) {
        setActiveSubmit(true);
        throw new Error(`Error submitting form: ${response.statusText}`);
      }

      const result = await response.json();
      alert("Form submitted successfully!");
      setActiveSubmit(true);
      navigate("/hr/leave/leaverequests");
    } catch (err) {
      console.error("Form submission failed:", err.message);
      alert("Form submission failed. Please try again.");
      setActiveSubmit(true);
    }
  };

  // Style Constants (define outside component)
  const labelStyles = {
    color: "#404040",
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    marginBottom: "12px",
  };

  const inputStyles = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "15px",
    color: "#1a1a1a",
    backgroundColor: "#f8f9fa",
    transition: "all 0.2s ease",
    "&:focus": {
      borderColor: "#1a73e8",
      boxShadow: "0 0 0 2px rgba(26, 115, 232, 0.2)",
    },
  };

  const textAreaStyles = {
    ...inputStyles,
    padding: "14px 16px",
    fontSize: "15px",
    resize: "vertical",
  };

  const noteBoxStyles = {
    backgroundColor: "#f8f9fe",
    padding: "18px 24px",
    borderRadius: "8px",
    border: "1px solid #e8eaf6",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  };

  const infoIconStyles = {
    width: "24px",
    height: "24px",
    backgroundColor: "#1a73e8",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
    fontSize: "14px",
    flexShrink: 0,
  };

  return (
    <div style={{ padding: "32px 48px" }}>
      {/* Section 1: Your Details */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: "32px",
          border: "1px solid #f0f0f0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Top Border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2b6cb0, #4299e1, #63b3ed)",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />

        {/* Section Header */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "28px",
              background: "linear-gradient(to bottom, #2b6cb0, #4299e1)",
              borderRadius: "2px",
              boxShadow: "0 2px 4px rgba(66, 153, 225, 0.2)",
            }}
          />
          <Title
            order={4}
            style={{
              color: "#1a1a1a",
              margin: 0,
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.2px",
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            Your Details
          </Title>
        </div>

        <Grid gutter={32} style={{ padding: "0 16px" }}>
          {/* Loading and Error States */}
          <Grid.Col span={12} mb={20}>
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#606060",
                  padding: "12px",
                  backgroundColor: "#f8f8f8",
                  borderRadius: "6px",
                  fontSize: "13px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="loader"
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #e0e0e0",
                    borderTopColor: "#4299e1",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Loading details...
              </div>
            )}
            {error && (
              <div
                style={{
                  backgroundColor: "#fff5f5",
                  color: "#c53030",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #fed7d7",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c53030"
                >
                  <path
                    d="M12 2L2 22h20L12 2zM12 8v6M12 16h0"
                    strokeWidth="2"
                  />
                </svg>
                {error}
              </div>
            )}
          </Grid.Col>

          {/* Input Fields - First Row */}
          <Grid.Col span={6} mb={24} style={{ padding: "0 12px" }}>
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={details.name || "N/A"}
                disabled
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  ":disabled": {
                    cursor: "not-allowed",
                    backgroundColor: "#f8f9fa",
                  },
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                }}
              />
            </div>
          </Grid.Col>

          <Grid.Col span={6} mb={24} style={{ padding: "0 12px" }}>
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Designation
              </label>
              <input
                type="text"
                value={details.last_selected_role || "N/A"}
                disabled
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  ":disabled": {
                    cursor: "not-allowed",
                    backgroundColor: "#f8f9fa",
                  },
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                }}
              />
            </div>
          </Grid.Col>

          {/* Input Fields - Second Row */}
          <Grid.Col span={4} mb={24} style={{ padding: "0 12px" }}>
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                PF No.
              </label>
              <input
                type="text"
                value={details.pfno || "N/A"}
                disabled
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  ":disabled": {
                    cursor: "not-allowed",
                    backgroundColor: "#f8f9fa",
                  },
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                }}
              />
            </div>
          </Grid.Col>

          <Grid.Col span={4} mb={24} style={{ padding: "0 12px" }}>
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Department
              </label>
              <input
                type="text"
                value={details.department || "N/A"}
                disabled
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  ":disabled": {
                    cursor: "not-allowed",
                    backgroundColor: "#f8f9fa",
                  },
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                }}
              />
            </div>
          </Grid.Col>

          <Grid.Col span={4} mb={24} style={{ padding: "0 12px" }}>
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Date
              </label>
              <input
                type="date"
                value={today}
                disabled
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  ":disabled": {
                    cursor: "not-allowed",
                    backgroundColor: "#f8f9fa",
                  },
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                }}
              />
            </div>
          </Grid.Col>
        </Grid>

        {/* Note Section */}
        <div
          style={{
            backgroundColor: "#f7fafc",
            padding: "14px 16px",
            borderRadius: "6px",
            marginTop: "20px",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              background: "linear-gradient(to bottom, #1a365d, #2b6cb0)",
              boxShadow: "0 2px 4px rgba(43, 108, 176, 0.2)",
            }}
          />
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #2b6cb0, #4299e1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 4px rgba(66, 153, 225, 0.2)",
              marginLeft: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <p
            style={{
              margin: 0,
              color: "#4a5568",
              fontSize: "13px",
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            <span style={{ fontWeight: 700, color: "#2b6cb0" }}>
              Important:
            </span>{" "}
            If your details are not correct, please contact HR Admin.
          </p>
        </div>
      </div>

      <style>{`
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`}</style>

      {/* Section 2: Leave Details */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: "32px",
          border: "1px solid #f0f0f0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Top Border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2b6cb0, #4299e1, #63b3ed)",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />

        {/* Section Header */}
        <div
          style={{
            marginBottom: "32px",
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "32px",
              background: "linear-gradient(to bottom, #2b6cb0, #4299e1)",
              borderRadius: "2px",
              boxShadow: "0 2px 4px rgba(66, 153, 225, 0.2)",
            }}
          />
          <Title
            order={4}
            style={{
              color: "#1a1a1a",
              margin: 0,
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.2px",
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            Leave Details
          </Title>
        </div>

        <Grid gutter={16} style={{ padding: "0 20px" }}>
          {/* Date Inputs and Purpose */}
          <Grid.Col
            span={4}
            mb={32}
            style={{ padding: "0 8px", marginTop: "16px" }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Leave Start Date
              </label>
              <input
                type="date"
                name="leaveStartDate"
                value={formData.leaveStartDate}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                  "&:focus": {
                    borderColor: "#2b6cb0",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                    outline: "none",
                  },
                }}
              />
            </div>
          </Grid.Col>

          <Grid.Col
            span={4}
            mb={32}
            style={{ padding: "0 8px", marginTop: "16px" }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Leave End Date
              </label>
              <input
                type="date"
                name="leaveEndDate"
                value={formData.leaveEndDate}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                  "&:focus": {
                    borderColor: "#2b6cb0",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                    outline: "none",
                  },
                }}
              />
            </div>
          </Grid.Col>

          <Grid.Col
            span={4}
            mb={32}
            style={{ padding: "0 8px", marginTop: "16px" }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Purpose of Leave
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                placeholder="Enter purpose..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                  "&:focus": {
                    borderColor: "#2b6cb0",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                    outline: "none",
                  },
                }}
              />
            </div>
          </Grid.Col>

          {/* Leave Balance Note */}
          <Grid.Col span={12} mb={32} style={{ padding: "0 8px" }}>
            <div
              style={{
                backgroundColor: "#f7fafc",
                padding: "16px 20px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: "linear-gradient(to bottom, #1a365d, #2b6cb0)",
                  boxShadow: "0 2px 4px rgba(43, 108, 176, 0.2)",
                }}
              />
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg, #2b6cb0, #4299e1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 4px rgba(66, 153, 225, 0.2)",
                  marginLeft: "8px",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#4a5568",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                <span style={{ fontWeight: 700, color: "#2b6cb0" }}>Note:</span>{" "}
                Please check your leave balance before applying to avoid
                rejection
              </p>
            </div>
          </Grid.Col>

          {/* Leave Type Inputs */}
          <Grid.Col
            span={12}
            mb={32}
            style={{ padding: "0 16px", marginTop: "16px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "16px",
                width: "100%",
              }}
            >
              {[
                ["Casual Leave", "casualLeave", "#4299e1"],
                ["Vacation Leave", "vacationLeave", "#48bb78"],
                ["Earned Leave", "earnedLeave", "#ed8936"],
                ["Commuted Leave", "commutedLeave", "#9f7aea"],
                ["Special Casual Leave", "specialCasualLeave", "#f56565"],
                ["Restricted Holiday", "restrictedHoliday", "#667eea"],
                ["Half Pay Leave", "halfPayLeave", "#ed64a6"],
                ["Maternity Leave", "maternityLeave", "#38b2ac"],
                ["Child Care Leave", "childCareLeave", "#f6ad55"],
                ["Paternity Leave", "paternityLeave", "#4fd1c5"],
              ].map(([label, name, color], index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      borderColor: color,
                    },
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      background: `linear-gradient(to bottom, ${color}, ${color}80)`,
                      boxShadow: `0 2px 4px ${color}20`,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      marginLeft: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor: `${color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 2px 4px ${color}20`,
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={color}
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </div>
                      <span
                        style={{
                          color: "#2d3748",
                          fontSize: "14px",
                          fontWeight: 600,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = parseInt(formData[name]) || 0;
                          if (currentValue > 0) {
                            handleInputChange({
                              target: { name, value: currentValue - 1 },
                            });
                          }
                        }}
                        style={{
                          minWidth: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          border: `1px solid ${color}40`,
                          backgroundColor: `${color}20`,
                          color: color,
                          fontSize: "18px",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: `${color}30`,
                            borderColor: color,
                            transform: "scale(1.05)",
                          },
                          "&:active": {
                            transform: "scale(0.95)",
                            backgroundColor: `${color}40`,
                          },
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        placeholder="0"
                        style={{
                          width: "48px",
                          padding: "8px",
                          border: `1px solid ${color}40`,
                          borderRadius: "8px",
                          backgroundColor: `${color}20`,
                          color: "#2d3748",
                          fontSize: "16px",
                          fontWeight: 700,
                          textAlign: "center",
                          "&:focus": {
                            borderColor: color,
                            boxShadow: `0 0 0 2px ${color}20`,
                            outline: "none",
                            backgroundColor: `${color}30`,
                          },
                          "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                            {
                              "-webkit-appearance": "none",
                              margin: 0,
                            },
                          "-moz-appearance": "textfield",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = parseInt(formData[name]) || 0;
                          handleInputChange({
                            target: { name, value: currentValue + 1 },
                          });
                        }}
                        style={{
                          minWidth: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          border: `1px solid ${color}40`,
                          backgroundColor: `${color}20`,
                          color: color,
                          fontSize: "18px",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: `${color}30`,
                            borderColor: color,
                            transform: "scale(1.05)",
                          },
                          "&:active": {
                            transform: "scale(0.95)",
                            backgroundColor: `${color}40`,
                          },
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Grid.Col>

          {/* Remarks and Document Upload Row */}
          <Grid.Col
            span={6}
            mb={32}
            style={{ padding: "0 8px", marginTop: "16px" }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Remarks (optional)
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Add any additional remarks here..."
                style={{
                  width: "100%",
                  padding: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  minHeight: "80px",
                  resize: "vertical",
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                  "&:focus": {
                    borderColor: "#2b6cb0",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                    outline: "none",
                  },
                }}
              />
            </div>
          </Grid.Col>

          <Grid.Col
            span={6}
            mb={32}
            style={{ padding: "0 8px", marginTop: "16px" }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Attach Supporting Document (PDF, optional)
              </label>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "400px",
                }}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    cursor: "pointer",
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    "&:focus": {
                      borderColor: "#4299e1",
                      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                      outline: "none",
                    },
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    pointerEvents: "none",
                    "&:hover": {
                      borderColor: "#4299e1",
                      boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                    },
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      backgroundColor: "#4299e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                  </div>
                  <span>Choose a PDF file</span>
                </div>
              </div>
            </div>
          </Grid.Col>

          {/* Station Leave Subsection */}
          <Grid.Col
            span={12}
            mb={32}
            style={{ padding: "0 8px", marginTop: "24px" }}
          >
            <div
              style={{
                marginBottom: "24px",
                borderBottom: "1px solid #e0e0e0",
                paddingBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "28px",
                  background: "linear-gradient(to bottom, #2b6cb0, #4299e1)",
                  borderRadius: "2px",
                  boxShadow: "0 2px 4px rgba(66, 153, 225, 0.2)",
                }}
              />
              <Title
                order={4}
                style={{
                  color: "#1a1a1a",
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "-0.2px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                Station Leave Details
              </Title>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
                padding: "12px 0",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  color: "#2d3748",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                Do you want to take station leave?
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginLeft: "8px",
                }}
              >
                <span style={{ color: "#4a5568", fontSize: "14px" }}>YES</span>
                <input
                  type="checkbox"
                  checked={stationLeave}
                  onChange={(e) => setStationLeave(e.currentTarget.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "#2b6cb0",
                  }}
                />
              </div>
            </div>

            {stationLeave && (
              <Grid gutter={0} style={{ padding: "0 16px" }}>
                <Grid.Col span={3} style={{ paddingRight: "12px" }}>
                  <div style={{ position: "relative" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#2b6cb0",
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      STATION LEAVE START DATE
                    </label>
                    <input
                      type="date"
                      name="stationLeaveStartDate"
                      value={formData.stationLeaveStartDate}
                      onChange={handleInputChange}
                      required={stationLeave}
                      placeholder="dd-mm-yyyy"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                        color: "#2d3748",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#4299e1",
                        },
                        "&:focus": {
                          borderColor: "#2563eb",
                          outline: "none",
                        },
                      }}
                    />
                  </div>
                </Grid.Col>

                <Grid.Col span={3} style={{ paddingRight: "12px" }}>
                  <div style={{ position: "relative" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#2b6cb0",
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      STATION LEAVE END DATE
                    </label>
                    <input
                      type="date"
                      name="stationLeaveEndDate"
                      value={formData.stationLeaveEndDate}
                      onChange={handleInputChange}
                      required={stationLeave}
                      placeholder="dd-mm-yyyy"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                        color: "#2d3748",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#4299e1",
                        },
                        "&:focus": {
                          borderColor: "#2563eb",
                          outline: "none",
                        },
                      }}
                    />
                  </div>
                </Grid.Col>

                <Grid.Col span={6}>
                  <div style={{ position: "relative" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#2b6cb0",
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      ADDRESS DURING STATION LEAVE
                    </label>
                    <input
                      type="text"
                      name="stationLeaveAddress"
                      value={formData.stationLeaveAddress}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                      required={stationLeave}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                        color: "#2d3748",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#4299e1",
                        },
                        "&:focus": {
                          borderColor: "#2563eb",
                          outline: "none",
                        },
                      }}
                    />
                  </div>
                </Grid.Col>
              </Grid>
            )}
          </Grid.Col>
        </Grid>
      </div>

      {/* Section 3: Responsibility Transfer */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: "32px",
          border: "1px solid #f0f0f0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Top Border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2b6cb0, #4299e1, #63b3ed)",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />

        {/* Section Header */}
        <div
          style={{
            marginBottom: "32px",
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "32px",
              background: "linear-gradient(to bottom, #2b6cb0, #4299e1)",
              borderRadius: "2px",
              boxShadow: "0 2px 4px rgba(66, 153, 225, 0.2)",
            }}
          />
          <Title
            order={4}
            style={{
              color: "#1a1a1a",
              margin: 0,
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.2px",
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            Responsibility Transfer During Leave (Optional)
          </Title>
        </div>

        <Grid gutter={24} style={{ padding: "0 20px" }}>
          <Grid.Col span={6} mb={32} style={{ padding: "0 16px" }}>
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Academic Responsibility
              </label>
              <SearchAndSelectUser
                onUserSelect={(user) => setAcademicResponsibility(user)}
                styles={{
                  root: {
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    "&:hover": {
                      borderColor: "#4299e1",
                      boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                    },
                    "&:focus": {
                      borderColor: "#2b6cb0",
                      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                      outline: "none",
                    },
                  },
                  input: { backgroundColor: "#ffffff" },
                }}
              />
            </div>
          </Grid.Col>

          <Grid.Col span={6} mb={32} style={{ padding: "0 16px" }}>
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Administrative Responsibility
              </label>
              <SearchAndSelectUser
                onUserSelect={(user) => setAdministrativeResponsibility(user)}
                styles={{
                  root: {
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    "&:hover": {
                      borderColor: "#4299e1",
                      boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                    },
                    "&:focus": {
                      borderColor: "#2b6cb0",
                      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                      outline: "none",
                    },
                  },
                  input: { backgroundColor: "#ffffff" },
                }}
              />
            </div>
          </Grid.Col>
        </Grid>
      </div>

      {/* Section 4: Forward Application */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: "32px",
          border: "1px solid #f0f0f0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Top Border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2b6cb0, #4299e1, #63b3ed)",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />

        {/* Section Header */}
        <div
          style={{
            marginBottom: "32px",
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "32px",
              background: "linear-gradient(to bottom, #2b6cb0, #4299e1)",
              borderRadius: "2px",
              boxShadow: "0 2px 4px rgba(66, 153, 225, 0.2)",
            }}
          />
          <Title
            order={4}
            style={{
              color: "#1a1a1a",
              margin: 0,
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.2px",
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            Forward Application
          </Title>
        </div>

        <Grid gutter={24} style={{ padding: "0 20px" }}>
          <Grid.Col span={12} mb={32} style={{ padding: "0 16px" }}>
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#2b6cb0",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Select Forward To
              </label>
              <SearchAndSelectUser
                onUserSelect={(user) => setForwardTo(user)}
                styles={{
                  root: {
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    "&:hover": {
                      borderColor: "#4299e1",
                      boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                    },
                    "&:focus": {
                      borderColor: "#2b6cb0",
                      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                      outline: "none",
                    },
                  },
                  input: { backgroundColor: "#ffffff" },
                }}
              />
            </div>
          </Grid.Col>
        </Grid>
      </div>

      {/* Submit Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "32px",
          marginBottom: "32px",
        }}
      >
        <Button
          onClick={handleSubmit}
          disabled={!activeSubmit}
          sx={(theme) => ({
            padding: "16px 48px",
            backgroundColor: "#2563eb", // Updated to deeper blue
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.3px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
            position: "relative",
            overflow: "hidden",

            "&:hover": {
              backgroundColor: "#1d4ed8", // Darker blue on hover
              transform: "translateY(-2px)",
              boxShadow: "0 4px 8px rgba(29, 78, 216, 0.3)",
            },

            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
            },

            "&:disabled": {
              backgroundColor: "#94a3b8", // Updated disabled color
              cursor: "not-allowed",
              transform: "none",
              boxShadow: "none",
            },

            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent)",
              transform: "translateX(-100%)",
              transition: "transform 0.6s ease",
            },

            "&:hover::before": {
              transform: "translateX(100%)",
            },

            // Mobile hover fix
            "@media (hover: hover) and (pointer: fine)": {
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            },
          })}
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
};

export default LeaveForm;
