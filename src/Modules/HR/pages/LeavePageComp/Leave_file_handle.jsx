import React, { useEffect, useState } from "react";
import {
  Button,
  Title,
  Box,
  Grid,
  Text,
  Badge,
  Divider,
  Textarea,
  Group,
  Anchor,
  Table,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, PaperPlaneRight } from "@phosphor-icons/react";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import SearchAndSelectUser from "../../components/SearchAndSelectUser";
import {
  get_leave_form_by_id,
  handle_leave_file,
  download_leave_form_pdf,
} from "../../../../routes/hr";
// import "./LeaveFileHandle.css";

const LeaveFileHandle = () => {
  const { id } = useParams();
  const [fetchedformData, setFetchedFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(null); // "accept", "reject", or "forward"
  const [forwardToUser, setForwardToUser] = useState(null); // Selected user for forwarding
  const [forwardToDesignation, setForwardToDesignation] = useState(""); // Designation for forwarding [Not used in the API call
  const [fileRemarks, setFileRemarks] = useState(""); // Remarks for the action
  const [submitting, setSubmitting] = useState(false); // Loading state for submission
  const navigate = useNavigate();

  const exampleItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "Leave", path: "/hr/leave" },
    { title: "Handle Leave", path: `/hr/leave/handle/${id}` },
  ];

  useEffect(() => {
    const fetchFormData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${get_leave_form_by_id}/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setFetchedFormData(data.leave_form); // Assuming the API returns data in a `leave_form` key
        console.log("Fetched form data:", data.leave_form);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setError("Failed to fetch form data. Please try again.");
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  const handleActionSubmit = async () => {
    if (!action) {
      alert("Please select an action (Accept, Reject, or Forward).");
      return;
    }

    if (action === "forward" && !forwardToUser) {
      alert("Please select a user to forward the leave form.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${handle_leave_file}/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action, // "accept", "reject", or "forward"
          forwardTo: forwardToUser?.id, // User ID for forwarding
          forwardToDesignation: forwardToUser?.designation, // Designation for forwarding
          fileRemarks, // Remarks for the action
        }),
      });

      if (!response.ok) {
        alert(
          result.message || "Failed to handle leave action. Please try again.",
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      alert(result.message || "Action completed successfully.");
      setFetchedFormData((prev) => ({
        ...prev,
        status:
          action === "accept"
            ? "Accepted"
            : action === "reject"
              ? "Rejected"
              : "Forwarded",
      }));
    } catch (error) {
      console.error("Failed to handle leave action:", error);
      alert("You are not authorized to perform this action.");
      setError("Failed to handle leave action. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDownloadPdf = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    try {
      const response = await fetch(`${download_leave_form_pdf}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fetchedformData.attachedPdfName;
      a.click();
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };
  if (loading) {
    return <LoadingComponent />;
  }

  if (!fetchedformData) {
    return (
      <>
        <HrBreadcrumbs items={exampleItems} />
        <EmptyTable message="No leave form data found." />
      </>
    );
  }

  return (
    <>
      <HrBreadcrumbs items={exampleItems} />
      <Box style={{ padding: "0 48px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              disabled
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor:
                  fetchedformData.status === "Accepted"
                    ? "#38a169"
                    : fetchedformData.status === "Rejected"
                      ? "#e53e3e"
                      : "#d69e2e",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor:
                    fetchedformData.status === "Accepted"
                      ? "#38a169"
                      : fetchedformData.status === "Rejected"
                        ? "#e53e3e"
                        : "#d69e2e",
                },
              }}
            >
              {fetchedformData.status}
            </Button>
            <Text
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#2d3748",
                letterSpacing: "-0.2px",
              }}
            >
              Leave Application Management Interface
            </Text>
          </div>
          <Button
            variant="filled"
            color="blue"
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: "#2b6cb0",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#2c5282",
              },
            }}
            onClick={() => {
              navigate(
                `../FormView/leaveform_track/${fetchedformData.file_id}`,
              );
            }}
            sx={(theme) => ({
              backgroundColor: "#2b6cb0 !important",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              transition: "all 0.2s ease",
              minWidth: "120px",

              "&:hover": {
                backgroundColor: "#4a5568 !important",
                transform: "translateY(-1px)",
              },

              "&:active": {
                transform: "translateY(0)",
              },
            })}
          >
            Track Status
          </Button>
        </div>

        {/* Employee Details Section */}
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
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.2px",
                textShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Employee Details
            </Title>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* First Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
              }}
            >
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={fetchedformData.name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
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
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Designation
                </label>
                <input
                  type="text"
                  value={fetchedformData.designation}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
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
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Personal File Number
                </label>
                <input
                  type="text"
                  value={fetchedformData.pfno}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
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
            </div>

            {/* Second Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
              }}
            >
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Department
                </label>
                <input
                  type="text"
                  value={fetchedformData.department}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
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
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Application Type
                </label>
                <input
                  type="text"
                  value={fetchedformData.application_type}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
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
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Submission Date
                </label>
                <input
                  type="text"
                  value={fetchedformData.submissionDate}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
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
            </div>
          </div>
        </div>

        {/* Leave Details Section */}
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
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.2px",
                textShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Leave Details
            </Title>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* First Row - Leave Dates */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
              }}
            >
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Leave Start Date
                </label>
                <input
                  type="text"
                  value={fetchedformData.leaveStartDate}
                  disabled
                  style={{
                    width: "80%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
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
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Leave End Date
                </label>
                <input
                  type="text"
                  value={fetchedformData.leaveEndDate}
                  disabled
                  style={{
                    width: "80%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
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
            </div>

            {/* Second Row - Purpose and Remarks */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
              }}
            >
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Purpose
                </label>
                <textarea
                  value={fetchedformData.purpose}
                  disabled
                  style={{
                    width: "80%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    minHeight: "48px",
                    resize: "none",
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
              <div style={{ flex: 1, maxWidth: "80%" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#2b6cb0",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Remarks
                </label>
                <textarea
                  value={fetchedformData.remarks}
                  disabled
                  style={{
                    width: "80%",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#2d3748",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    minHeight: "48px",
                    resize: "none",
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
            </div>
          </div>
        </div>

        {/* Leave Types and Balances Section */}
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
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.2px",
                textShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Leave Types and Balances
            </Title>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "48px",
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Title
                order={5}
                mb="sm"
                style={{
                  textAlign: "center",
                  color: "#2b6cb0",
                  marginBottom: "16px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Leave Types Applied
              </Title>
              <Table>
                <thead>
                  <tr style={{ backgroundColor: "#f7fafc" }}>
                    <th
                      style={{
                        padding: "12px 16px",
                        border: "1px solid #e2e8f0",
                        textAlign: "left",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#2d3748",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Leave Type
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        border: "1px solid #e2e8f0",
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#2d3748",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Days Applied
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      type: "Casual Leave",
                      applied: fetchedformData.casualLeave,
                    },
                    {
                      type: "Vacation Leave",
                      applied: fetchedformData.vacationLeave,
                    },
                    {
                      type: "Earned Leave",
                      applied: fetchedformData.earnedLeave,
                    },
                    {
                      type: "Commuted Leave",
                      applied: fetchedformData.commutedLeave,
                    },
                    {
                      type: "Special Casual Leave",
                      applied: fetchedformData.specialCasualLeave,
                    },
                    {
                      type: "Restricted Holiday",
                      applied: fetchedformData.restrictedHoliday,
                    },
                    {
                      type: "Half Pay Leave",
                      applied: fetchedformData.halfPayLeave,
                    },
                    {
                      type: "Maternity Leave",
                      applied: fetchedformData.maternityLeave,
                    },
                    {
                      type: "Child Care Leave",
                      applied: fetchedformData.childCareLeave,
                    },
                    {
                      type: "Paternity Leave",
                      applied: fetchedformData.paternityLeave,
                    },
                  ].map((leave, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f8fafc",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e2e8f0",
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#4a5568",
                        }}
                      >
                        {leave.type}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontSize: "14px",
                          color: "#4a5568",
                          fontWeight: leave.applied > 0 ? 600 : 400,
                        }}
                      >
                        {leave.applied || "0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Title
                order={5}
                mb="sm"
                style={{
                  textAlign: "center",
                  color: "#2b6cb0",
                  marginBottom: "16px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Leave Balances
              </Title>
              <Table>
                <thead>
                  <tr style={{ backgroundColor: "#f7fafc" }}>
                    <th
                      style={{
                        padding: "12px 16px",
                        border: "1px solid #e2e8f0",
                        textAlign: "left",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#2d3748",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Leave Type
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        border: "1px solid #e2e8f0",
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#2d3748",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Balance (Days)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      type: "Casual Leave",
                      balance: fetchedformData.casualLeaveBalance,
                    },
                    {
                      type: "Special Casual Leave",
                      balance: fetchedformData.special_casual_leaveBalance,
                    },
                    {
                      type: "Earned Leave",
                      balance: fetchedformData.earned_leaveBalance,
                    },
                    {
                      type: "Half Pay Leave",
                      balance: fetchedformData.half_pay_leaveBalance,
                    },
                    {
                      type: "Maternity Leave",
                      balance: fetchedformData.maternity_leaveBalance,
                    },
                    {
                      type: "Child Care Leave",
                      balance: fetchedformData.child_care_leaveBalance,
                    },
                    {
                      type: "Paternity Leave",
                      balance: fetchedformData.paternity_leaveBalance,
                    },
                  ].map((leave, index) => {
                    const balance = parseFloat(leave.balance) || 0;
                    const isNegative = balance < 0;
                    const isPositive = balance > 0;

                    return (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f8fafc",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            border: "1px solid #e2e8f0",
                            textAlign: "left",
                            fontSize: "14px",
                            color: "#4a5568",
                          }}
                        >
                          {leave.type}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                            fontSize: "14px",
                            color: isNegative
                              ? "#e53e3e"
                              : isPositive
                                ? "#4299e1"
                                : "#4a5568",
                            fontWeight: isNegative || isPositive ? 600 : 400,
                          }}
                        >
                          {leave.balance || "0"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        {/* Section 4: Station Leave */}
        {fetchedformData.stationLeave && (
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
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "-0.2px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                Station Leave Details
              </Title>
            </div>

            <Grid gutter={32} style={{ padding: "0 16px" }}>
              <Grid.Col span={4}>
                <div style={{ position: "relative", marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#2b6cb0",
                      fontSize: "14px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                    }}
                  >
                    Station Leave Start Date
                  </label>
                  <input
                    type="text"
                    value={fetchedformData.stationLeaveStartDate}
                    disabled
                    style={{
                      width: "80%",
                      padding: "12px 16px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: "#2d3748",
                      fontSize: "14px",
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
              <Grid.Col span={4}>
                <div style={{ position: "relative", marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#2b6cb0",
                      fontSize: "14px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                    }}
                  >
                    Station Leave End Date
                  </label>
                  <input
                    type="text"
                    value={fetchedformData.stationLeaveEndDate}
                    disabled
                    style={{
                      width: "80%",
                      padding: "12px 16px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: "#2d3748",
                      fontSize: "14px",
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
              <Grid.Col span={4}>
                <div style={{ position: "relative", marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#2b6cb0",
                      fontSize: "14px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                    }}
                  >
                    Address During Station Leave
                  </label>
                  <input
                    type="text"
                    value={fetchedformData.stationLeaveAddress}
                    disabled
                    style={{
                      width: "80%",
                      padding: "12px 16px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: "#2d3748",
                      fontSize: "14px",
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
          </div>
        )}

        {/* Section 5: Responsibility Transfer */}
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
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.2px",
                textShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Responsibility Transfer
            </Title>
          </div>

          {!fetchedformData.academicResponsibility &&
          !fetchedformData.administrativeResponsibility ? (
            <Text style={{ padding: "0 20px" }}>Not Applicable</Text>
          ) : (
            <Grid gutter={32} style={{ padding: "0 16px" }}>
              {fetchedformData.academicResponsibility && (
                <Grid.Col span={6}>
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "20px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      marginBottom: "24px",
                      marginRight: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Title order={5} style={{ margin: 0, color: "#2b6cb0" }}>
                        Academic Responsibility
                      </Title>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 700,
                          backgroundColor:
                            fetchedformData.academicResponsibilityStatus ===
                            "Pending"
                              ? "#F59E0B"
                              : fetchedformData.academicResponsibilityStatus ===
                                  "Accepted"
                                ? "#10B981"
                                : "#EF4444",
                          color: "#ffffff",
                          display: "inline-block",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {fetchedformData.academicResponsibilityStatus}
                      </span>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          color: "#4a5568",
                          fontSize: "14px",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                      >
                        {fetchedformData.academicResponsibility}
                      </div>
                      <div
                        style={{
                          color: "#718096",
                          fontSize: "13px",
                        }}
                      >
                        {fetchedformData.academicResponsibilityDesignation}
                      </div>
                    </div>
                  </div>
                </Grid.Col>
              )}

              {fetchedformData.administrativeResponsibility && (
                <Grid.Col span={6}>
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "20px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      marginBottom: "24px",
                      marginLeft: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Title order={5} style={{ margin: 0, color: "#2b6cb0" }}>
                        Administrative Responsibility
                      </Title>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 700,
                          backgroundColor:
                            fetchedformData.administrativeResponsibilityStatus ===
                            "Pending"
                              ? "#F59E0B"
                              : fetchedformData.administrativeResponsibilityStatus ===
                                  "Accepted"
                                ? "#10B981"
                                : "#EF4444",
                          color: "#ffffff",
                          display: "inline-block",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {fetchedformData.administrativeResponsibilityStatus}
                      </span>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          color: "#4a5568",
                          fontSize: "14px",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                      >
                        {fetchedformData.administrativeResponsibility}
                      </div>
                      <div
                        style={{
                          color: "#718096",
                          fontSize: "13px",
                        }}
                      >
                        {
                          fetchedformData.administrativeResponsibilityDesignation
                        }
                      </div>
                    </div>
                  </div>
                </Grid.Col>
              )}
            </Grid>
          )}
        </div>

        {/* Section 6: Attachments */}
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
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.2px",
                textShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Attachments
            </Title>
          </div>

          <Grid gutter={32} style={{ padding: "0 16px" }}>
            {/* Attachments Section */}
            <Grid.Col span={6}>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  marginRight: "16px",
                }}
              >
                <Title
                  order={5}
                  style={{
                    margin: 0,
                    color: "#2b6cb0",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  Attachments
                </Title>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px 16px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
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
                  <Text>
                    <strong>Attached PDF:</strong>{" "}
                    {fetchedformData.attachedPdfName ? (
                      <Anchor onClick={(e) => handleDownloadPdf(e)} download>
                        {fetchedformData.attachedPdfName}
                      </Anchor>
                    ) : (
                      "No file attached"
                    )}
                  </Text>
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </div>

        {/* Action Buttons Section */}
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
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.2px",
                textShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Select Action
            </Title>
          </div>

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
              marginBottom: "24px",
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
              Please track the status of the file before performing any actions.
              If you don't have current ownership, the action will not be
              performed.
            </p>
          </div>

          <Group position="center" mt="xl" style={{ gap: "16px" }}>
            <Button
              leftIcon={<CheckCircle size={20} />}
              onClick={() => setAction("accept")}
              variant="filled"
              disabled={fetchedformData.status !== "Pending"}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "#38a169",
                color: "white",
                border: "none",
                "&:hover": {
                  backgroundColor: "#2f855a",
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                  color: "#a0aec0",
                  cursor: "not-allowed",
                },
              }}
            >
              Accept
            </Button>
            <Button
              leftIcon={<XCircle size={20} />}
              onClick={() => setAction("reject")}
              variant="filled"
              disabled={fetchedformData.status !== "Pending"}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "#e53e3e",
                color: "white",
                border: "none",
                "&:hover": {
                  backgroundColor: "#c53030",
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                  color: "#a0aec0",
                  cursor: "not-allowed",
                },
              }}
            >
              Reject
            </Button>
            <Button
              leftIcon={<PaperPlaneRight size={20} />}
              onClick={() => setAction("forward")}
              variant="filled"
              disabled={fetchedformData.status !== "Pending"}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "#d69e2e",
                color: "white",
                border: "none",
                "&:hover": {
                  backgroundColor: "#b7791f",
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                  color: "#a0aec0",
                  cursor: "not-allowed",
                },
              }}
            >
              Forward
            </Button>
          </Group>

          {/* Forward User Selection */}
          {action === "forward" && (
            <div style={{ marginTop: "32px" }}>
              <Title
                order={4}
                style={{
                  marginBottom: "16px",
                  color: "#2b6cb0",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                Forward To
              </Title>
              <SearchAndSelectUser
                onUserSelect={(user) => setForwardToUser(user)}
              />
            </div>
          )}

          {/* File Remarks */}
          <div style={{ marginTop: "32px" }}>
            <Title
              order={4}
              style={{
                marginBottom: "16px",
                color: "#2b6cb0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              File Remarks
            </Title>
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
                marginBottom: "24px",
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
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
              <Textarea
                placeholder="Enter remarks for the action"
                value={fileRemarks}
                onChange={(e) => setFileRemarks(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#2d3748",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  minHeight: "100px",
                  resize: "vertical",
                  "&:hover": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                  },
                  "&:focus": {
                    borderColor: "#4299e1",
                    boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                    outline: "none",
                  },
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Group position="center" mt="xl">
            <Button
              onClick={handleActionSubmit}
              loading={submitting}
              disabled={!action || (action === "forward" && !forwardToUser)}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "#4299e1",
                color: "white",
                border: "none",
                "&:hover": {
                  backgroundColor: "#3182ce",
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                  color: "#a0aec0",
                  cursor: "not-allowed",
                },
              }}
            >
              Submit Action
            </Button>
          </Group>
        </div>
      </Box>
    </>
  );
};

export default LeaveFileHandle;
