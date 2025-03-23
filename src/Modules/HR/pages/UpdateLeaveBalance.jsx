import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Card,
  Text,
  Divider,
  Loader,
  Table,
  NumberInput,
  Button,
  Group,
} from "@mantine/core";
import SearchAndSelectUser from "../components/SearchAndSelectUser";

const UpdateLeaveBalance = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Define leave types along with their keys for allotted and taken fields.
  const leaveTypes = [
    {
      label: "Casual Leave",
      allotted: "casual_leave_allotted",
      taken: "casual_leave_taken",
    },
    {
      label: "Vacation Leave",
      allotted: "vacation_leave_allotted",
      taken: "vacation_leave_taken",
    },
    {
      label: "Earned Leave",
      allotted: "earned_leave_allotted",
      taken: "earned_leave_taken",
    },
    {
      label: "Commuted Leave",
      allotted: "commuted_leave_allotted",
      taken: "commuted_leave_taken",
    },
    {
      label: "Special Casual Leave",
      allotted: "special_casual_leave_allotted",
      taken: "special_casual_leave_taken",
    },
    {
      label: "Restricted Holiday",
      allotted: "restricted_holiday_allotted",
      taken: "restricted_holiday_taken",
    },
  ];

  // Function to fetch leave balance data for the given employee.
  const fetchLeaveData = async (empid) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/hr2/api/admin_get_leave_balance/${empid}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch leave data.");
      }
      const data = await response.json();
      setLeaveData(data.leave_balance);
      // Create a copy of the data for editing.
      setEditableData(data.leave_balance);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Called when an employee is selected via the search component.
  const handleUserSelect = (employee) => {
    setSelectedEmployee(employee);
    // Clear previous data and editing states.
    setLeaveData(null);
    setEditableData(null);
    setError(null);
    setIsEditing(false);
  };

  // Fetch leave data when selectedEmployee changes.
  useEffect(() => {
    if (selectedEmployee && selectedEmployee.id) {
      fetchLeaveData(selectedEmployee.id);
    }
  }, [selectedEmployee]);

  // Handle changes in input fields by updating editableData.
  const handleInputChange = (field, value) => {
    setEditableData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Submit updated leave data using a PUT request.
  const handleUpdate = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    setUpdateLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/hr2/api/admin_update_leave_balance/${selectedEmployee.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(editableData),
        },
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Could not update leave data.");
      }
      // Optionally, re-fetch to update the view with the latest data.
      fetchLeaveData(selectedEmployee.id);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Update Leave Balance
      </Title>

      {/* Employee search component */}
      <SearchAndSelectUser onUserSelect={handleUserSelect} />

      {/* Show employee-specific leave data once an employee is selected */}
      {selectedEmployee && (
        <Card withBorder shadow="sm" p="lg" mt="xl">
          <Title order={4} mb="sm">
            Leave Balance for {selectedEmployee.username} (
            {selectedEmployee.designation})
          </Title>
          <Divider my="sm" />

          {loading ? (
            <Loader />
          ) : error ? (
            <Text color="red">{error}</Text>
          ) : leaveData ? (
            <>
              <Table striped highlightOnHover withBorder withColumnBorders>
                <thead style={{ backgroundColor: "#f0f0f0" }}>
                  <tr>
                    <th style={{ textAlign: "left", padding: "12px" }}>
                      Leave Type
                    </th>
                    <th style={{ textAlign: "center", padding: "12px" }}>
                      Allotted
                    </th>
                    <th style={{ textAlign: "center", padding: "12px" }}>
                      Taken
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTypes.map((item, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "left", padding: "12px" }}>
                        {item.label}
                      </td>
                      <td style={{ textAlign: "center", padding: "12px" }}>
                        {isEditing ? (
                          <NumberInput
                            value={editableData[item.allotted]}
                            onChange={(value) =>
                              handleInputChange(item.allotted, value)
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          />
                        ) : (
                          leaveData[item.allotted]
                        )}
                      </td>
                      <td style={{ textAlign: "center", padding: "12px" }}>
                        {isEditing ? (
                          <NumberInput
                            value={editableData[item.taken]}
                            onChange={(value) =>
                              handleInputChange(item.taken, value)
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          />
                        ) : (
                          leaveData[item.taken]
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Group position="apart" mt="md">
                {isEditing ? (
                  <>
                    <Button
                      color="gray"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset changes by restoring the original leaveData.
                        setEditableData({ ...leaveData });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdate} loading={updateLoading}>
                      Update
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                )}
              </Group>
            </>
          ) : (
            <Text>
              Search for an employee and select to view their leave balance
              details.
            </Text>
          )}
        </Card>
      )}
    </Container>
  );
};

export default UpdateLeaveBalance;
