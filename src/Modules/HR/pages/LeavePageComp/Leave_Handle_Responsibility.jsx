import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Button,
  Title,
  Box,
  Grid,
  Text,
  Badge,
  Divider,
  Anchor,
  Group,
} from "@mantine/core";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import { get_leave_form_by_id } from "../../../../routes/hr";
import {
  handle_leave_academic_responsibility,
  handle_leave_administrative_responsibility,
} from "../../../../routes/hr"; // Replace with the correct API route

const LeaveHandleResponsibility = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [fetchedformData, setFetchedFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);

  const responsibilityType = searchParams.get("query"); // "academic" or "administrative"

  const exampleItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "Leave", path: "/hr/leave" },
    {
      title: "Handle Responsibility",
      path: `/hr/leave/handle/${id}?query=${responsibilityType}`,
    },
  ];

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
        console.log(data);
        setFetchedFormData(data.leave_form); // Assuming the API returns data in a `leave_form` key
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setError("Failed to fetch form data.");
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  const handleAction = async (action) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    // if query is academic, then handle academic responsibility
    let apiurl = "";
    if (responsibilityType === "academic") {
      apiurl = handle_leave_academic_responsibility;
    } else {
      apiurl = handle_leave_administrative_responsibility;
    }

    try {
      console.log({ action });
      const response = await fetch(`${apiurl}/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ action }), // "accept" or "reject"
      });

      if (!response.ok) {
        throw new Error("Failed to handle responsibility.");
      }

      const result = await response.json();
      setActionStatus(result.message);
      setFetchedFormData((prev) => ({
        ...prev,
        [`${responsibilityType}ResponsibilityStatus`]:
          action === "accept" ? "Accepted" : "Rejected",
        status: action === "reject" ? "Rejected" : prev.status,
      }));
    } catch (error) {
      console.error("Error handling responsibility:", error);
      setError("Failed to handle responsibility.");
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
      {/* Title */}
      <Box
        style={{
          padding: "25px 30px",
          margin: "20px 5px",
        }}
      >
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
              Handle academic or administrative responsibility
            </div>
          </div>
        </div>
        {/* Form Data Display */}
        <Box
          sx={{
            maxWidth: "850px",
            margin: "auto",
            padding: "30px",
          }}
        >
          {/* Section 1: Leave Form Details */}
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
                Leave Form Details
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
              <Text
                style={{
                  padding: "0 20px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#4a5568",
                }}
              >
                Not Applicable
              </Text>
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
                        <Title
                          order={5}
                          style={{ margin: 0, color: "#2b6cb0" }}
                        >
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
                        <Title
                          order={5}
                          style={{ margin: 0, color: "#2b6cb0" }}
                        >
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

          {/* Action Buttons */}
          <Group position="center" mt="xl" mb="xl">
            <Button
              leftIcon={<CheckCircle size={20} weight="bold" />}
              onClick={() => handleAction("accept")}
              disabled={
                fetchedformData[`${responsibilityType}ResponsibilityStatus`] !==
                "Pending"
              }
              style={{
                backgroundColor: "#10B981",
                color: "white",
                fontWeight: "700",
                fontSize: "15px",
                padding: "12px 24px",
                height: "auto",
                "&:hover": {
                  backgroundColor: "#059669",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  backgroundColor: "#9CA3AF",
                  cursor: "not-allowed",
                },
              }}
            >
              Accept
            </Button>
            <Button
              leftIcon={<XCircle size={20} weight="bold" />}
              onClick={() => handleAction("reject")}
              disabled={
                fetchedformData[`${responsibilityType}ResponsibilityStatus`] !==
                "Pending"
              }
              style={{
                backgroundColor: "#EF4444",
                color: "white",
                fontWeight: "700",
                fontSize: "15px",
                padding: "12px 24px",
                height: "auto",
                "&:hover": {
                  backgroundColor: "#DC2626",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  backgroundColor: "#9CA3AF",
                  cursor: "not-allowed",
                },
              }}
            >
              Reject
            </Button>
          </Group>

          {/* Action Status Message */}
          {actionStatus && (
            <Text
              align="center"
              mt="md"
              color="green"
              style={{ fontSize: "15px", fontWeight: "600" }}
            >
              {actionStatus}
            </Text>
          )}

          {/* Error Message */}
          {error && (
            <Text
              align="center"
              mt="md"
              color="red"
              style={{ fontSize: "15px", fontWeight: "600" }}
            >
              {error}
            </Text>
          )}
        </Box>
      </Box>
    </>
  );
};

export default LeaveHandleResponsibility;
