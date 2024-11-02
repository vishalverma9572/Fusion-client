import React from "react";
import { useEffect, useState } from "react";
import { Button, Select } from "@mantine/core";
import {
  PaperPlaneRight,
  CheckCircle,
  User,
  Tag,
  IdentificationCard,
  Building,
  Calendar,
  ClipboardText,
  FloppyDisk,
  UserList,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import {
  search_employee,
  get_my_details,
  submit_leave_form,
} from "../../../../routes/hr";
import "./LeaveForm.css";
import { useNavigate } from "react-router-dom";

const LeaveForm = () => {
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();
  const [verifiedReceiver, setVerifiedReceiver] = useState(false);
  const navigate = useNavigate();

  // set formData to initial state
  useEffect(() => {
    const fetchMyDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await fetch(get_my_details, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
          alert("Failed to fetch user details. Please try again later.");
          throw new Error("Network response was not ok");
        }

        const fetchedData = await response.json();
        dispatch(updateForm({ name: "name", value: fetchedData.username }));
        dispatch(
          updateForm({ name: "designation", value: fetchedData.designation }),
        );
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchMyDetails();
  }, []);

  const handleCheck = async (username_reciever) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await fetch(
        `${search_employee}?search=${formData.username_reciever}`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      if (!response.ok) {
        alert("Receiver not found. Please check the username and try again.");
        throw new Error("Network response was not ok");
      }

      const fetchedReceiverData = await response.json();

      dispatch(
        updateForm({
          name: "username_reciever",
          value: formData.username_reciever,
        }),
      );
      dispatch(
        updateForm({
          name: "designation_reciever",
          value: fetchedReceiverData.designation,
        }),
      );
      setVerifiedReceiver(true);
      alert("Receiver verified successfully!");
    } catch (error) {
      console.error("Failed to fetch receiver data:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateForm({ name, value }));
  };

  const handleSelectChange = (value) => {
    dispatch(updateForm({ name: "natureOfLeave", value }));
  };

  const handleSubmit = (event) => {
    // Prevent page refresh
    event.preventDefault();
    if (!verifiedReceiver) {
      alert("Please verify the receiver before submitting the form.");
      return;
    }
    //  create a submission object
    const submission = {
      name: formData.name,
      designation: formData.designation,
      submissionDate: formData.submissionDate,
      departmentInfo: formData.departmentInfo,
      pfNo: formData.pfNo,
      natureOfLeave: formData.natureOfLeave,
      leaveStartDate: formData.leaveStartDate,
      leaveEndDate: formData.leaveEndDate,
      purposeOfLeave: formData.purposeOfLeave,
      addressDuringLeave: formData.addressDuringLeave,
      academicResponsibility: formData.academicResponsibility,
      addministrativeResponsibiltyAssigned:
        formData.addministrativeResponsibiltyAssigned,
      username_reciever: formData.username_reciever,
      designation_reciever: formData.designation_reciever,
    };

    // Submit the form
    const submitForm = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await fetch(submit_leave_form, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(submission),
        });

        if (!response.ok) {
          alert("Failed to submit form. Please try again later.");
          throw new Error("Network response was not ok");
        }

        alert("Form submitted successfully!");
        dispatch(resetForm());
        Navigate("/hr/leave/leaverequests");
      } catch (error) {
        console.error("Failed to submit form:", error);
      }
    };
    submitForm();
  };

  return (
    <div className="Leave_container">
      <form onSubmit={handleSubmit}>
        {/* Section 1: Name, Designation (Left), Application Date (Right) */}
        <div className="grid-row">
          <div className="grid-col left-side">
            <label className="input-label" htmlFor="name">
              Name
            </label>
            <div className="input-wrapper">
              <User size={20} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
                className="input"
                required
                disabled
              />
            </div>
            <label className="input-label" htmlFor="designation">
              Designation
            </label>
            <div className="input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="designation"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="input"
                required
                disabled
              />
            </div>
          </div>

          <div className="grid-col right-side">
            <label className="input-label" htmlFor="submissionDate">
              Application Date
            </label>
            <div className="input-wrapper center" style={{ width: "300px" }}>
              <Calendar size={20} />
              <input
                type="date"
                id="submissionDate"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleChange}
                className="input center"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Discipline/Department (Left), PF Number (Right) */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="departmentInfo">
              Department
            </label>
            <div className="input-wrapper">
              <Building size={20} />
              <input
                type="text"
                id="departmentInfo"
                name="departmentInfo"
                placeholder="Department Name"
                value={formData.departmentInfo}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="pfNo">
              PF Number
            </label>
            <div className="input-wrapper">
              <IdentificationCard size={20} />
              <input
                type="number"
                id="pfNo"
                name="pfNo"
                placeholder="XXXXXXXXXXXX"
                value={formData.pfNo}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Nature of Leave, Leave Start Date, Leave End Date */}
        <div className="grid-row three-columns">
          <div className="grid-col">
            <label className="input-label" htmlFor="natureOfLeave">
              Nature of Leave
            </label>
            <div className="input-wrapper">
              <Select
                className="select"
                placeholder="Select a leave type"
                data={[
                  { value: "Casual", label: "Casual" },

                  { value: "Vacation", label: "Vacation" },
                  { value: "Earned", label: "Earned" },
                  { value: "Commuted Leave", label: "Commuted Leave" },
                  {
                    value: "Special Casual Leave",
                    label: "Special Casual Leave",
                  },
                  { value: "Restricted Holiday", label: "Restricted Holiday" },
                  { value: "Station Leave", label: "Station Leave" },
                ]}
                value={formData.natureOfLeave}
                onChange={handleSelectChange}
                required
                styles={{
                  input: {
                    border: "none",
                    backgroundColor: "transparent",
                    color: "#000",
                    fontSize: "14px",
                    margin: "-8px 0px 0px -40px",
                    fontFamily: "Roboto, sans-serif",
                  },
                  dropdown: {
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  },
                  item: {
                    padding: "10px",
                    fontSize: "14px",
                    color: "#2d3b45",
                    ":hover": { backgroundColor: "#e2e8f0", color: "#1a2a33" },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="leaveStartDate">
              Leave Start Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="leaveStartDate"
                name="leaveStartDate"
                value={formData.leaveStartDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="leaveEndDate">
              Leave End Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="leaveEndDate"
                name="leaveEndDate"
                value={formData.leaveEndDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Purpose of Leave */}
        <div className="grid-row">
          <div className="purpose">
            <label className="input-label" htmlFor="purposeOfLeave">
              Purpose
            </label>
            <div className="input-wrapper">
              <ClipboardText size={20} />
              <input
                type="text"
                id="purposeOfLeave"
                name="purposeOfLeave"
                placeholder="purpose Of Leave"
                value={formData.purposeOfLeave}
                onChange={handleChange}
                className="input"
                aria-rowcount={2}
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="addressDuringLeave">
              Adress during Leave
            </label>
            <div className="input-wrapper">
              <UserList size={20} />
              <input
                type="text"
                id="addressDuringLeave"
                name="addressDuringLeave"
                placeholder="Full Address"
                value={formData.addressDuringLeave}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 5: Academic and Administrative Responsibility */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="academicResponsibility">
              Academic Responsibility
            </label>
            <div className="input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="academicResponsibility"
                name="academicResponsibility"
                placeholder="Enter the name"
                value={formData.academicResponsibility}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label
              className="input-label"
              htmlFor="addministrativeResponsibiltyAssigned"
            >
              Administrative Responsibility
            </label>
            <div className="input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="addministrativeResponsibiltyAssigned"
                name="addministrativeResponsibiltyAssigned"
                placeholder="Enter the name"
                value={formData.addministrativeResponsibiltyAssigned}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="input-wrapper">
            <User size={20} />
            <input
              type="text"
              name="username_reciever"
              placeholder="Receiver's Username"
              value={formData.username_reciever}
              onChange={handleChange}
              className="username-input"
              required
            />
          </div>
          <div className="input-wrapper">
            <Tag size={20} />
            <input
              type="text"
              name="designation_reciever"
              placeholder="Designation"
              value={formData.designation_reciever}
              className="designation-input"
              required
              disabled
            />
          </div>
          <Button
            leftIcon={<CheckCircle size={25} />}
            style={{ marginLeft: "50px", paddingRight: "15px" }}
            className="button"
            onClick={handleCheck}
          >
            <CheckCircle size={18} /> &nbsp; Check
          </Button>
          <Button
            type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{
              marginLeft: "350px",
              width: "150px",
              paddingRight: "15px",
              borderRadius: "5px",
            }}
            className="button"
            // disabled={!verifiedReceiver}
          >
            <PaperPlaneRight size={20} /> &nbsp; Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
