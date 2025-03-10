import React, { useState, useEffect } from "react";
import {
  TextInput,
  Select,
  Checkbox,
  Button,
  Title,
  Box,
  Grid,
  Group,
  Textarea,
} from "@mantine/core";
import { get_form_initials } from "../../../../routes/hr";
import "./LeaveForm.css";
import SearchAndSelectUser from "../../components/SearchAndSelectUser";
const LeaveForm = () => {
  const [stationLeave, setStationLeave] = useState(false);
  const [academicResponsibility, setAcademicResponsibility] = useState(null);
  const [administrativeResponsibility, setAdministrativeResponsibility] =
    useState(null);
  const [forwardTo, setForwardTo] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const [details, setDetails] = useState({
    name: "",
    last_selected_role: "",
    pfno: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = () => {
    // Validation and submission logic
    alert("Form submitted successfully!");
    console.log("Form Data Submitted");
  };

  return (
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
      {/* Section 1: Your Details */}
      <br />
      <Title order={4}>Your Details</Title>
      {/* set instruction message "If your details is not correct please contact Hr Admin" */}

      <br />

      <Grid gutter="lg" style={{ padding: "0 20px" }}>
        {/* Loading or error message */}
        {loading && <p>Loading your details...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

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
            required
            type="date"
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Leave End Date"
            required
            type="date"
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Purpose of Leave"
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
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Vacation Leave During Period"
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Earned Leave During Period"
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Commuted Leave During Period"
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Special Casual Leave During Period"
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="No. of Restricted Holiday During Period"
            type="number"
            placeholder="0"
            required
            style={{ maxWidth: "300px" }}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="Remarks (if any)"
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
              type="date"
              style={{ maxWidth: "300px" }}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Station Leave End Date"
              type="date"
              style={{ maxWidth: "300px" }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Address During Station Leave"
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
          <SearchAndSelectUser
            onUserSelect={(user) => setAcademicResponsibility(user)}
          />
        </Grid.Col>

        {/* Replace Administrative Responsibility Select */}
        <Grid.Col span={6}>
          <SearchAndSelectUser
            onUserSelect={(user) => setAdministrativeResponsibility(user)}
          />
        </Grid.Col>
      </Grid>

      {/* Section 4: Forward Application */}
      <br />
      <Title order={4} sx={{ marginBottom: "20px" }}>
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
        >
          Submit
        </Button>
      </Group>
    </Box>
  );
};

export default LeaveForm;
