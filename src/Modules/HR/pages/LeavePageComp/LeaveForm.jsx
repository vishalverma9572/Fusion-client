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
  const [attachedPdf, setAttachedPdf] = useState(null); // State for the uploaded PDF file
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

  // Fetch user details from the API
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
      setDetails(data); // Update state with the fetched details
    } catch (err) {
      setError("Failed to fetch user details.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails(); // Fetch details when the component mounts
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
      setAttachedPdf(file); // Store the selected PDF file
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async () => {
    // set the active submit button to false
    setActiveSubmit(false);
    // Validation Checks
    if (
      !formData.leaveStartDate ||
      !formData.leaveEndDate ||
      !formData.purpose ||
      !formData.remarks ||
      !academicResponsibility ||
      !administrativeResponsibility ||
      !forwardTo
    ) {
      alert("All fields are required!");
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
    finalFormData.append("casualLeave", formData.casualLeave);
    finalFormData.append("vacationLeave", formData.vacationLeave);
    finalFormData.append("earnedLeave", formData.earnedLeave);
    finalFormData.append("commutedLeave", formData.commutedLeave);
    finalFormData.append("specialCasualLeave", formData.specialCasualLeave);
    finalFormData.append("restrictedHoliday", formData.restrictedHoliday);
    finalFormData.append("remarks", formData.remarks);
    finalFormData.append("stationLeave", stationLeave);
    finalFormData.append(
      "stationLeaveStartDate",
      formData.stationLeaveStartDate,
    );
    finalFormData.append("stationLeaveEndDate", formData.stationLeaveEndDate);
    finalFormData.append("stationLeaveAddress", formData.stationLeaveAddress);
    finalFormData.append("academicResponsibility", academicResponsibility.id);
    finalFormData.append(
      "academicResponsibility_designation",
      academicResponsibility.designation,
    );
    finalFormData.append(
      "administrativeResponsibility",
      administrativeResponsibility.id,
    );
    finalFormData.append(
      "administrativeResponsibility_designation",
      administrativeResponsibility.designation,
    );

    finalFormData.append("forwardTo", forwardTo.id);
    finalFormData.append("forwardTo_designation", forwardTo.designation);
    if (attachedPdf) {
      finalFormData.append("attached_pdf", attachedPdf); // Append the PDF file
    }

    // Submit form data to the backend
    try {
      // Debug: Log FormData contents
      for (let [key, value] of finalFormData.entries()) {
        console.log(key, value);
      }
      const token = localStorage.getItem("authToken");
      console.log("Submitting form data:", finalFormData);
      // return;
      const response = await fetch(submit_leave_form, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: finalFormData, // Send FormData object
      });

      if (!response.ok) {
        setActiveSubmit(true);
        throw new Error(`Error submitting form: ${response.statusText}`);
      }

      const result = await response.json();
      alert("Form submitted successfully!");
      setActiveSubmit(true);
      navigate("/hr/leave/leaverequests"); // Redirect to the leave page
      console.log("Form submission result:", result);
    } catch (err) {
      console.error("Form submission failed:", err.message);
      alert("Form submission failed. Please try again.");
      setActiveSubmit(true);
    }
  };

  return (
    <Box
      style={{
        padding: "25px 30px",
        margin: "20px 5px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      {/* Section 1: Your Details */}

      <Title order={4}>Your Details</Title>

      <Grid gutter="lg" style={{ padding: "0 20px" }}>
        {/* Loading or error message */}
        <Grid.Col span={12}>
          {loading && <p>Loading your details...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Name"
            value={details.name || "N/A"} // Prefill with API data
            disabled
            sx={{ maxWidth: "300px", color: "black" }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Designation"
            value={details.last_selected_role || "N/A"} // Prefill with API data
            disabled
            sx={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Personal File Number"
            value={details.pfno || "N/A"} // Prefill with API data
            disabled
            sx={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Department/Discipline"
            value={details.department || "N/A"} // Prefill with API data
            disabled
            sx={{ maxWidth: "300px" }}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Date"
            placeholder="Select or enter today's date"
            type="date"
            defaultValue={today} // Prefill with today's date
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
      </Grid>
      <p style={{ color: "#023f60" }}>
        Note: &nbsp;If your details are not correct, please contact HR Admin.
      </p>

      {/* Section 2: Leave Details */}
      <br />
      <Title order={4} sx={{ marginBottom: "20px" }}>
        Leave Details
      </Title>
      <br />

      <Grid gutter="lg" style={{ padding: "0 20px" }}>
        <Grid.Col span={4}>
          <TextInput
            label="Leave Start Date"
            name="leaveStartDate"
            value={formData.leaveStartDate}
            onChange={handleInputChange}
            required
            type="date"
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Leave End Date"
            name="leaveEndDate"
            value={formData.leaveEndDate}
            onChange={handleInputChange}
            required
            type="date"
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Purpose of Leave"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            placeholder="Enter purpose of leave"
            required
            style={{ maxWidth: "800px" }}
          />
        </Grid.Col>

        {/* Number of Leaves Fields */}
        <Grid.Col span={12}>
          <p style={{ color: "#023f60" }}>
            Note: &nbsp; Please check your leave balance before applying to
            avoid rejection{" "}
          </p>
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Casual Leave During Period"
            name="casualLeave"
            value={formData.casualLeave}
            onChange={handleInputChange}
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Vacation Leave During Period"
            name="vacationLeave"
            value={formData.vacationLeave}
            onChange={handleInputChange}
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Earned Leave During Period"
            name="earnedLeave"
            value={formData.earnedLeave}
            onChange={handleInputChange}
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Commuted Leave During Period"
            name="commutedLeave"
            value={formData.commutedLeave}
            onChange={handleInputChange}
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Special Casual Leave During Period"
            name="specialCasualLeave"
            value={formData.specialCasualLeave}
            onChange={handleInputChange}
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Restricted Holiday During Period"
            name="restrictedHoliday"
            value={formData.restrictedHoliday}
            onChange={handleInputChange}
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="Remarks (if not any enter N/A)"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Enter remarks if any"
            required
            style={{ maxWidth: "800px" }}
          />
        </Grid.Col>
        {/* File Attachment Field */}
        <Grid.Col span={12}>
          <TextInput
            label="Attach Supporting Document (PDF)"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ maxWidth: "350px" }}
          />
        </Grid.Col>
      </Grid>
      <br />
      {/* Subsection: Station Leave */}
      <Checkbox
        label="Do you want to take station leave?"
        checked={stationLeave}
        onChange={(e) => setStationLeave(e.currentTarget.checked)}
        sx={{ margin: "20px 0" }}
      />
      <br />
      {stationLeave && (
        <Grid gutter="lg" style={{ padding: "0 20px" }}>
          <Grid.Col span={4}>
            <TextInput
              label="Station Leave Start Date"
              name="stationLeaveStartDate"
              value={formData.stationLeaveStartDate}
              onChange={handleInputChange}
              type="date"
              style={{ maxWidth: "300px" }}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Station Leave End Date"
              name="stationLeaveEndDate"
              value={formData.stationLeaveEndDate}
              onChange={handleInputChange}
              type="date"
              style={{ maxWidth: "300px" }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Address During Station Leave"
              name="stationLeaveAddress"
              value={formData.stationLeaveAddress}
              onChange={handleInputChange}
              placeholder="Enter address"
              style={{ maxWidth: "800px" }}
            />
          </Grid.Col>
        </Grid>
      )}

      {/* Section 3: Responsibility Transfer */}
      <br />
      <Title order={4} sx={{ marginBottom: "20px" }}>
        Responsibility Transfer During Period
      </Title>
      <Grid gutter="lg" style={{ padding: "0 20px" }}>
        {/* Replace Academic Responsibility Select */}
        <Grid.Col span={6}>
          {/* label Academic Respondibility */}
          <Title order={6} style={{ marginBottom: "10px", marginTop: "20px" }}>
            Academic Respondibility
          </Title>
          <SearchAndSelectUser
            onUserSelect={(user) => setAcademicResponsibility(user)}
          />
        </Grid.Col>

        {/* Replace Administrative Responsibility Select */}
        <Grid.Col span={6}>
          <Title order={6} style={{ marginBottom: "10px", marginTop: "20px" }}>
            Administrative Respondibility
          </Title>
          <SearchAndSelectUser
            onUserSelect={(user) => setAdministrativeResponsibility(user)}
          />
        </Grid.Col>
      </Grid>

      {/* Section 4: Forward Application */}
      <br />
      <Title order={4} style={{ marginBottom: "10px" }}>
        Forward Application
      </Title>
      <SearchAndSelectUser onUserSelect={(user) => setForwardTo(user)} />
      {/* Submit Button */}
      <Group position="center" mt="xl">
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#15abff",
            "&:hover": { backgroundColor: "#0e8ad8" },
          }}
          disabled={!activeSubmit}
        >
          Submit
        </Button>
      </Group>
    </Box>
  );
};

export default LeaveForm;
