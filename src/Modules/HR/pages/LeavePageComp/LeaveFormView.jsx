import React, { useEffect, useState } from "react";
import {
  Button,
  Title,
  Box,
  Grid,
  Text,
  Badge,
  Divider,
  Anchor,
  Table,
  SimpleGrid,
  ActionIcon,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import {
  get_leave_form_by_id,
  download_leave_form_pdf,
} from "../../../../routes/hr";
import { IconDownload, IconHistory } from "@tabler/icons-react";
import "./LeaveFormView.css";
import { Bold } from "lucide-react";

const LeaveFormView = () => {
  const { id } = useParams();
  const [fetchedformData, setFetchedFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const admin = new URLSearchParams(window.location.search).get("admin");
  const [exampleItems, setExampleItems] = useState([]);

  useEffect(() => {
    if (admin) {
      setExampleItems([
        { title: "Home", path: "/dashboard" },
        { title: "Human Resources", path: "/hr" },
        { title: "Admin Leave Management", path: "/hr/admin_leave" },
        {
          title: "Leave Requests",
          path: "/hr/admin_leave/review_leave_requests",
        },
        { title: "View Form", path: `/hr/leave/view/${id}?admin=true` },
      ]);
    } else {
      setExampleItems([
        { title: "Home", path: "/dashboard" },
        { title: "Human Resources", path: "/hr" },
        { title: "Leave", path: "/hr/leave" },
        { title: "View Form", path: `/hr/leave/view/${id}` },
      ]);
    }
  }, [admin]);

  useEffect(() => {
    const fetchFormData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
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
        // Adjust status for null responsibilities
        const adjustedData = {
          ...data.leave_form,
          academicResponsibilityStatus: data.leave_form.academicResponsibility
            ? data.leave_form.academicResponsibilityStatus
            : "Accepted",
          administrativeResponsibilityStatus: data.leave_form
            .administrativeResponsibility
            ? data.leave_form.administrativeResponsibilityStatus
            : "Accepted",
        };
        setFetchedFormData(adjustedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

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
        <EmptyTable message="No view data found." />
      </>
    );
  }

  // Leave balances table data
  const leaveBalances = [
    { type: "Casual Leave", balance: fetchedformData.casualLeaveBalance },
    {
      type: "Special Casual Leave",
      balance: fetchedformData.special_casual_leaveBalance,
    },
    { type: "Earned Leave", balance: fetchedformData.earned_leaveBalance },
    { type: "Half Pay Leave", balance: fetchedformData.half_pay_leaveBalance },
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
  ];

  // Leave types applied data
  const leaveTypesApplied = [
    { type: "Casual Leave", applied: fetchedformData.casualLeave },
    { type: "Vacation Leave", applied: fetchedformData.vacationLeave },
    { type: "Earned Leave", applied: fetchedformData.earnedLeave },
    { type: "Commuted Leave", applied: fetchedformData.commutedLeave },
    {
      type: "Special Casual Leave",
      applied: fetchedformData.specialCasualLeave,
    },
    { type: "Restricted Holiday", applied: fetchedformData.restrictedHoliday },
    { type: "Half Pay Leave", applied: fetchedformData.halfPayLeave },
    { type: "Maternity Leave", applied: fetchedformData.maternityLeave },
    { type: "Child Care Leave", applied: fetchedformData.childCareLeave },
    { type: "Paternity Leave", applied: fetchedformData.paternityLeave },
  ];

  return (
    <>
      <HrBreadcrumbs items={exampleItems} />
      <Box
        style={{
          padding: "32px 48px",
        }}
      >
        {/* Status and Track Status Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor:
                  fetchedformData.status === "Pending"
                    ? "#F59E0B"
                    : fetchedformData.status === "Accepted"
                      ? "#10B981"
                      : "#EF4444",
                color: "#ffffff",
                display: "inline-block",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                minWidth: "120px",
                textAlign: "center",
              }}
            >
              {fetchedformData.status}
            </span>
            <div
              style={{
                color: "#4A5568",
                fontSize: "14px",
                lineHeight: "1.5",
                fontWeight: "bold",
              }}
            >
              {fetchedformData.status === "Pending"
                ? "Your leave application is currently under review. The status will be updated once a decision is made."
                : fetchedformData.status === "Accepted"
                  ? "Your leave application has been approved. You can proceed with your leave as per the approved dates."
                  : "Your leave application has been rejected. Please contact the concerned authority for more details."}
            </div>
          </div>
          <Button
            variant="filled"
            onClick={() => {
              if (admin) {
                navigate(
                  `../FormView/leaveform_track/${fetchedformData.file_id}?admin=true`,
                );
              } else {
                navigate(
                  `../FormView/leaveform_track/${fetchedformData.file_id}`,
                );
              }
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

        {/* Section 1: Employee Details */}
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
                  Name
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={fetchedformData.name}
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
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "4px",
                      height: "100%",

                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    }}
                  />
                </div>
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
                  Designation
                </label>
                <input
                  type="text"
                  value={fetchedformData.designation}
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
                  Personal File Number
                </label>
                <input
                  type="text"
                  value={fetchedformData.pfno}
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
                  Department
                </label>
                <input
                  type="text"
                  value={fetchedformData.department}
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
                  Application Type
                </label>
                <input
                  type="text"
                  value={fetchedformData.application_type}
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
                  Submission Date
                </label>
                <input
                  type="text"
                  value={fetchedformData.submissionDate}
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

        {/* Leave Details */}
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

          <Grid gutter={32} style={{ padding: "0 16px" }}>
            <Grid.Col span={6}>
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
            </Grid.Col>
            <Grid.Col span={6}>
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
            </Grid.Col>
            <Grid.Col span={6}>
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
                  Purpose of Leave
                </label>
                <input
                  type="text"
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
            <Grid.Col span={6}>
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
                  Remarks
                </label>
                <input
                  type="text"
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

        {/* Combined Leave Types and Balances Section */}
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
              Leave Type Details
            </Title>
          </div>

          <Grid gutter={32} style={{ padding: "0 16px" }}>
            <Grid.Col span={6}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  marginRight: "16px",
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
                    <tr
                      style={{
                        backgroundColor: "#f7fafc",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
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
                    {leaveTypesApplied.map((leave, index) => (
                      <tr
                        key={`applied-${index}`}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f8fafc",
                          borderBottom: "1px solid #e2e8f0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#f1f5f9",
                          },
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            border: "1px solid #e2e8f0",
                            textAlign: "left",
                            fontSize: "13px",
                            color: "#4a5568",
                            fontWeight: 500,
                          }}
                        >
                          {leave.type}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                            fontSize: "13px",
                            color: "#4a5568",
                            fontWeight: 600,
                          }}
                        >
                          {leave.applied || "0"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Grid.Col>

            <Grid.Col span={6}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  marginLeft: "16px",
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
                    <tr
                      style={{
                        backgroundColor: "#f7fafc",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
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
                    {leaveBalances.map((leave, index) => {
                      const balance = parseFloat(leave.balance) || 0;
                      const isNegative = balance < 0;
                      const isPositive = balance > 0;

                      return (
                        <tr
                          key={`balance-${index}`}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#ffffff" : "#f8fafc",
                            borderBottom: "1px solid #e2e8f0",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "#f1f5f9",
                            },
                          }}
                        >
                          <td
                            style={{
                              padding: "12px 16px",
                              border: "1px solid #e2e8f0",
                              textAlign: "left",
                              fontSize: "13px",
                              color: "#4a5568",
                              fontWeight: 500,
                            }}
                          >
                            {leave.type}
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              border: "1px solid #e2e8f0",
                              textAlign: "center",
                              fontSize: "13px",
                              color: isNegative
                                ? "#e53e3e"
                                : isPositive
                                  ? "#38a169"
                                  : "#4a5568",
                              fontWeight: isNegative || isPositive ? 700 : 600,
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
            </Grid.Col>
          </Grid>
        </div>

        {/* Station Leave */}
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

        {/* Responsibility Transfer - Only show if at least one exists */}
        {(fetchedformData.academicResponsibility ||
          fetchedformData.administrativeResponsibility) && (
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
          </div>
        )}

        {/* Combined Attachments and Forward/Approval Sections */}
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
              Attachments & Application Status
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
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {fetchedformData.attachedPdfName}
                    </div>
                    <div
                      style={{
                        color: "#718096",
                        fontSize: "13px",
                      }}
                    >
                      PDF Document
                    </div>
                  </div>
                  <ActionIcon
                    variant="filled"
                    color="blue"
                    size="lg"
                    radius="md"
                    onClick={handleDownloadPdf}
                    style={{
                      backgroundColor: "#ebf8ff",
                      color: "#2b6cb0",
                      border: "1px solid #bee3f8",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#bee3f8",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 4px rgba(66, 153, 225, 0.1)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <IconDownload size={20} />
                  </ActionIcon>
                </div>
              </div>
            </Grid.Col>

            {/* Forward/Approval Section */}
            <Grid.Col span={6}>
              {fetchedformData.status === "Pending" &&
              (fetchedformData.academicResponsibilityStatus === "Pending" ||
                fetchedformData.administrativeResponsibilityStatus ===
                  "Pending") ? (
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    marginLeft: "16px",
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
                    Forward Application
                  </Title>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {fetchedformData.firstRecievedBy}
                    </div>
                    <div
                      style={{
                        color: "#718096",
                        fontSize: "13px",
                      }}
                    >
                      {fetchedformData.firstRecievedByDesignation}
                    </div>
                  </div>
                </div>
              ) : fetchedformData.status === "Accepted" &&
                fetchedformData.approvedBy ? (
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    marginLeft: "16px",
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
                    Approval Details
                  </Title>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {fetchedformData.approvedBy}
                    </div>
                    <div
                      style={{
                        color: "#718096",
                        fontSize: "13px",
                        marginBottom: "8px",
                      }}
                    >
                      {fetchedformData.approvedByDesignation}
                    </div>
                    <div
                      style={{
                        color: "#718096",
                        fontSize: "13px",
                      }}
                    >
                      Approved on: {fetchedformData.approvedDate}
                    </div>
                  </div>
                </div>
              ) : null}
            </Grid.Col>
          </Grid>
        </div>
      </Box>
    </>
  );
};

export default LeaveFormView;
