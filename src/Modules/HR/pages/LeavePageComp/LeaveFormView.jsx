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
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import {
  get_leave_form_by_id,
  download_leave_form_pdf,
} from "../../../../routes/hr";
import "./LeaveFormView.css";

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

  return (
    <>
      <HrBreadcrumbs items={exampleItems} />
      <Box
        style={{
          padding: "25px 30px",
          margin: "20px 5px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
        }}
      >
        <Title order={2} style={{ fontWeight: "500", marginBottom: "20px" }}>
          Leave Form Details
        </Title>
        <Grid>
          <Grid.Col span={6}>
            <Text>
              <strong>Status:</strong>{" "}
              <Badge
                color={
                  fetchedformData.status === "Accepted"
                    ? "green"
                    : fetchedformData.status === "Rejected"
                      ? "red"
                      : "yellow"
                }
              >
                {fetchedformData.status}
              </Badge>
            </Text>
          </Grid.Col>

          {fetchedformData.academicResponsibilityStatus === "Accepted" &&
            fetchedformData.administrativeResponsibilityStatus ===
              "Accepted" && (
              <Grid.Col
                span={6}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="outline"
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
                >
                  Track Status
                </Button>
              </Grid.Col>
            )}
        </Grid>

        <Box
          sx={{
            maxWidth: "850px",
            margin: "auto",
            padding: "30px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Employee Details */}
          <Title order={4} style={{ marginTop: "30px" }}>
            Employee Details
          </Title>
          <Divider my="sm" />
          <Grid gutter="lg" style={{ padding: "0 20px" }}>
            <Grid.Col span={6}>
              <Text>
                <strong>Name:</strong> {fetchedformData.name}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Designation:</strong> {fetchedformData.designation}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Personal File Number:</strong> {fetchedformData.pfno}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Department:</strong> {fetchedformData.department}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Application Type:</strong>{" "}
                <Badge
                  color={
                    fetchedformData.application_type === "Online"
                      ? "blue"
                      : "green"
                  }
                >
                  {fetchedformData.application_type}
                </Badge>
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Submission Date:</strong>{" "}
                {fetchedformData.submissionDate}
              </Text>
            </Grid.Col>
          </Grid>

          {/* Leave Details */}
          <Title order={4} mt="xl" style={{ marginTop: "30px" }}>
            Leave Details
          </Title>
          <Divider my="sm" />
          <Grid gutter="lg" style={{ padding: "0 20px" }}>
            <Grid.Col span={6}>
              <Text>
                <strong>Leave Start Date:</strong>{" "}
                {fetchedformData.leaveStartDate}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Leave End Date:</strong> {fetchedformData.leaveEndDate}
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text>
                <strong>Purpose of Leave:</strong> {fetchedformData.purpose}
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text>
                <strong>Remarks:</strong> {fetchedformData.remarks}
              </Text>
            </Grid.Col>
          </Grid>

          {/* Leave Balances Table */}
          <Title order={4} mt="xl" style={{ marginTop: "30px" }}>
            Leave Balances
          </Title>
          <Divider my="sm" />
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {leaveBalances.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.type}</td>
                  <td>{leave.balance}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Leave Types */}
          <Title order={4} mt="xl" style={{ marginTop: "30px" }}>
            Leave Types Applied
          </Title>
          <Divider my="sm" />
          <Grid gutter="lg" style={{ padding: "0 20px" }}>
            <Grid.Col span={6}>
              <Text>
                <strong>Casual Leave:</strong> {fetchedformData.casualLeave}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Vacation Leave:</strong> {fetchedformData.vacationLeave}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Earned Leave:</strong> {fetchedformData.earnedLeave}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Commuted Leave:</strong> {fetchedformData.commutedLeave}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Special Casual Leave:</strong>{" "}
                {fetchedformData.specialCasualLeave}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Restricted Holiday:</strong>{" "}
                {fetchedformData.restrictedHoliday}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Half Pay Leave:</strong> {fetchedformData.halfPayLeave}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Maternity Leave:</strong>{" "}
                {fetchedformData.maternityLeave}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Child Care Leave:</strong>{" "}
                {fetchedformData.childCareLeave}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Paternity Leave:</strong>{" "}
                {fetchedformData.paternityLeave}
              </Text>
            </Grid.Col>
          </Grid>

          {/* Station Leave */}
          {fetchedformData.stationLeave && (
            <>
              <Title order={4} mt="xl" style={{ marginTop: "30px" }}>
                Station Leave Details
              </Title>
              <Divider my="sm" />
              <Grid gutter="lg" style={{ padding: "0 20px" }}>
                <Grid.Col span={6}>
                  <Text>
                    <strong>Station Leave Start Date:</strong>{" "}
                    {fetchedformData.stationLeaveStartDate}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text>
                    <strong>Station Leave End Date:</strong>{" "}
                    {fetchedformData.stationLeaveEndDate}
                  </Text>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Text>
                    <strong>Address During Station Leave:</strong>{" "}
                    {fetchedformData.stationLeaveAddress}
                  </Text>
                </Grid.Col>
              </Grid>
            </>
          )}

          {/* Responsibility Transfer - Only show if at least one exists */}
          {(fetchedformData.academicResponsibility ||
            fetchedformData.administrativeResponsibility) && (
            <>
              <Title order={4} mt="xl" style={{ marginTop: "30px" }}>
                Responsibility Transfer
              </Title>
              <Divider my="sm" />
              <Grid gutter="lg" style={{ padding: "0 20px" }}>
                {fetchedformData.academicResponsibility && (
                  <Grid.Col span={6}>
                    <Text style={{ marginBottom: "10px" }}>
                      <strong>Academic Responsibility:</strong>{" "}
                      {fetchedformData.academicResponsibility}
                    </Text>
                    <Text style={{ marginBottom: "10px" }}>
                      <strong>Designation:</strong>{" "}
                      {fetchedformData.academicResponsibilityDesignation}
                    </Text>
                    <Text style={{ marginBottom: "10px" }}>
                      <strong>Status:</strong>{" "}
                      <Badge
                        color={
                          fetchedformData.academicResponsibilityStatus ===
                          "Accepted"
                            ? "green"
                            : fetchedformData.academicResponsibilityStatus ===
                                "Rejected"
                              ? "red"
                              : "yellow"
                        }
                      >
                        {fetchedformData.academicResponsibilityStatus}
                      </Badge>
                    </Text>
                  </Grid.Col>
                )}
                {fetchedformData.administrativeResponsibility && (
                  <Grid.Col span={6}>
                    <Text style={{ marginBottom: "10px" }}>
                      <strong>Administrative Responsibility:</strong>{" "}
                      {fetchedformData.administrativeResponsibility}
                    </Text>
                    <Text style={{ marginBottom: "10px" }}>
                      <strong>Designation:</strong>{" "}
                      {fetchedformData.administrativeResponsibilityDesignation}
                    </Text>
                    <Text style={{ marginBottom: "10px" }}>
                      <strong>Status:</strong>{" "}
                      <Badge
                        color={
                          fetchedformData.administrativeResponsibilityStatus ===
                          "Accepted"
                            ? "green"
                            : fetchedformData.administrativeResponsibilityStatus ===
                                "Rejected"
                              ? "red"
                              : "yellow"
                        }
                      >
                        {fetchedformData.administrativeResponsibilityStatus}
                      </Badge>
                    </Text>
                  </Grid.Col>
                )}
              </Grid>
            </>
          )}

          {/* Attachments */}
          <Title order={4} mt="xl">
            Attachments
          </Title>
          <Divider my="sm" />
          <Grid gutter="lg" style={{ padding: "0 20px" }}>
            <Grid.Col span={6}>
              <Text>
                <strong>Attached PDF:</strong>{" "}
                {fetchedformData.attachedPdfName ? (
                  <Anchor onClick={handleDownloadPdf} download>
                    {fetchedformData.attachedPdfName}
                  </Anchor>
                ) : (
                  "No file attached"
                )}
              </Text>
            </Grid.Col>
          </Grid>

          {/* Forward Application */}
          {fetchedformData.status === "Pending" &&
            (fetchedformData.academicResponsibilityStatus === "Pending" ||
              fetchedformData.administrativeResponsibilityStatus ===
                "Pending") && (
              <>
                <Title order={4} style={{ marginTop: "30px" }}>
                  Forward Application
                </Title>
                <Divider my="sm" />
                <Grid gutter="lg" style={{ padding: "0 20px" }}>
                  <Grid.Col span={6}>
                    <Text>
                      <strong>Next receiver:</strong>{" "}
                      {fetchedformData.firstRecievedBy}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text>
                      <strong>Next receiver's Designation:</strong>{" "}
                      {fetchedformData.firstRecievedByDesignation}
                    </Text>
                  </Grid.Col>
                </Grid>
              </>
            )}

          {/* Approval */}
          {fetchedformData.status === "Accepted" &&
            fetchedformData.approvedBy && (
              <>
                <Title order={4} mt="xl">
                  Approval
                </Title>
                <Divider my="sm" />
                <Grid gutter="lg" style={{ padding: "0 20px" }}>
                  <Grid.Col span={6}>
                    <Text>
                      <strong>Approved By:</strong> {fetchedformData.approvedBy}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text>
                      <strong>Designation:</strong>{" "}
                      {fetchedformData.approvedByDesignation}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text>
                      <strong>Approved Date:</strong>{" "}
                      {fetchedformData.approvedDate}
                    </Text>
                  </Grid.Col>
                </Grid>
              </>
            )}
        </Box>
      </Box>
    </>
  );
};

export default LeaveFormView;
