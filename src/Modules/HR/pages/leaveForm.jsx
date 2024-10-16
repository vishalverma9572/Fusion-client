import React, { useState } from "react";
import {
  TextInput,
  Select,
  NumberInput,
  DateInput,
  Button,
  Group,
  Container,
  Stack,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications"; // Import notifications
import {
  User,
  Briefcase,
  Calendar,
  IdentificationBadge,
  Building,
  ClipboardText,
  CalendarBlank,
  Clipboard,
  UserCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import "./LeaveForm.css"; // Ensure this is the correct path

const LeaveForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    designation: "",
    applicationDate: null,
    pfNumber: "",
    department: "",
    natureOfLeave: "",
    leaveStartDate: null,
    leaveEndDate: null,
    purpose: "",
    academicResponsibility: "",
    administrativeResponsibility: "",
    forwardToUsername: "",
    forwardToDesignation: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.designation)
      newErrors.designation = "Designation is required";
    if (!formValues.applicationDate)
      newErrors.applicationDate = "Application date is required";
    if (!formValues.pfNumber) newErrors.pfNumber = "PF number is required";
    if (!formValues.department) newErrors.department = "Department is required";
    if (!formValues.natureOfLeave)
      newErrors.natureOfLeave = "Nature of leave is required";
    if (!formValues.leaveStartDate)
      newErrors.leaveStartDate = "Leave start date is required";
    if (!formValues.leaveEndDate)
      newErrors.leaveEndDate = "Leave end date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      console.log(formValues);
      showNotification({
        title: "Form Submitted",
        message: "Your leave application has been submitted successfully!",
        color: "green",
      });
    }
  };

  return (
    <Container className="leave-form-container">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <Group grow>
            <TextInput
              label="Name"
              placeholder="Enter your name"
              icon={<User />}
              value={formValues.name}
              onChange={(event) =>
                handleInputChange("name", event.currentTarget.value)
              }
              error={errors.name}
            />
            <TextInput
              label="Designation"
              placeholder="Enter your designation"
              icon={<Briefcase />}
              value={formValues.designation}
              onChange={(event) =>
                handleInputChange("designation", event.currentTarget.value)
              }
              error={errors.designation}
            />
            <DateInput
              label="Application Date"
              placeholder="Pick date"
              icon={<Calendar />}
              value={formValues.applicationDate}
              onChange={(value) => handleInputChange("applicationDate", value)}
              error={errors.applicationDate}
            />
          </Group>
          <Group grow>
            <NumberInput
              label="PF Number"
              placeholder="Enter your PF number"
              icon={<IdentificationBadge />}
              value={formValues.pfNumber}
              onChange={(value) => handleInputChange("pfNumber", value)}
              error={errors.pfNumber}
            />
            <TextInput
              label="Department"
              placeholder="Enter your department"
              icon={<Building />}
              value={formValues.department}
              onChange={(event) =>
                handleInputChange("department", event.currentTarget.value)
              }
              error={errors.department}
            />
          </Group>
          <Group grow>
            <Select
              label="Nature of Leave"
              placeholder="Select leave type"
              icon={<ClipboardText />}
              data={["Sick Leave", "Casual Leave", "Earned Leave"]}
              value={formValues.natureOfLeave}
              onChange={(value) => handleInputChange("natureOfLeave", value)}
              error={errors.natureOfLeave}
            />
            <DateInput
              label="Leave Start Date"
              placeholder="Pick start date"
              icon={<CalendarBlank />}
              value={formValues.leaveStartDate}
              onChange={(value) => handleInputChange("leaveStartDate", value)}
              error={errors.leaveStartDate}
            />
            <DateInput
              label="Leave End Date"
              placeholder="Pick end date"
              icon={<CalendarBlank />}
              value={formValues.leaveEndDate}
              onChange={(value) => handleInputChange("leaveEndDate", value)}
              error={errors.leaveEndDate}
            />
          </Group>
          <TextInput
            label="Purpose"
            placeholder="Enter the purpose of leave"
            icon={<Clipboard />}
            value={formValues.purpose}
            onChange={(event) =>
              handleInputChange("purpose", event.currentTarget.value)
            }
          />
          <Group grow>
            <TextInput
              label="Academic Responsibility Assigned To"
              placeholder="Enter name"
              icon={<UserCircle />}
              value={formValues.academicResponsibility}
              onChange={(event) =>
                handleInputChange(
                  "academicResponsibility",
                  event.currentTarget.value,
                )
              }
            />
            <TextInput
              label="Administrative Responsibility Assigned To"
              placeholder="Enter name"
              icon={<UserCircle />}
              value={formValues.administrativeResponsibility}
              onChange={(event) =>
                handleInputChange(
                  "administrativeResponsibility",
                  event.currentTarget.value,
                )
              }
            />
          </Group>
          <Group grow>
            <TextInput
              label="Forward To (Username)"
              placeholder="Enter username"
              icon={<User />}
              value={formValues.forwardToUsername}
              onChange={(event) =>
                handleInputChange(
                  "forwardToUsername",
                  event.currentTarget.value,
                )
              }
            />
            <TextInput
              label="Forward To (Designation)"
              placeholder="Enter designation"
              icon={<Briefcase />}
              value={formValues.forwardToDesignation}
              onChange={(event) =>
                handleInputChange(
                  "forwardToDesignation",
                  event.currentTarget.value,
                )
              }
            />
          </Group>
          <Group position="apart">
            <Button
              type="submit"
              className="submit-button"
              rightIcon={<ArrowRight />}
            >
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
};

export default LeaveForm;
