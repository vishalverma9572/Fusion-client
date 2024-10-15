import React from "react";
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
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../redux/formSlice";
import "./leaveForm.css";

const LeaveForm = () => {
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateForm({ name, value }));
  };

  const handleSelectChange = (value) => {
    dispatch(updateForm({ name: "natureOfLeave", value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    dispatch(resetForm());
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
              />
            </div>
          </div>

          <div className="grid-col right-side">
            <label className="input-label" htmlFor="applicationDate">
              Application Date
            </label>
            <div className="input-wrapper center" style={{ width: "300px" }}>
              <Calendar size={20} />
              <input
                type="date"
                id="applicationDate"
                name="applicationDate"
                value={formData.applicationDate}
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
            <label className="input-label" htmlFor="department">
              Department
            </label>
            <div className="input-wrapper">
              <Building size={20} />
              <input
                type="text"
                id="department"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="pfNumber">
              PF Number
            </label>
            <div className="input-wrapper">
              <IdentificationCard size={20} />
              <input
                type="number"
                id="pfNumber"
                name="pfNumber"
                placeholder="XXXXXXXXXXXX"
                value={formData.pfNumber}
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
            <label className="input-label" htmlFor="startDate">
              Leave Start Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="endDate">
              Leave End Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Purpose of Leave */}
        <div className="grid-row">
          <div className="grid-col full-width">
            <label className="input-label" htmlFor="purpose">
              Purpose
            </label>
            <div className="input-wrapper">
              <ClipboardText size={20} />
              <input
                type="text"
                id="purpose"
                name="purpose"
                placeholder="Purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="input"
                aria-rowcount={2}
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
              htmlFor="administrativeResponsibility"
            >
              Administrative Responsibility
            </label>
            <div className="input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="administrativeResponsibility"
                name="administrativeResponsibility"
                placeholder="Enter the name"
                value={formData.administrativeResponsibility}
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
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="username-input"
              required
            />
          </div>
          <div className="input-wrapper">
            <Tag size={20} />
            <input
              type="text"
              name="designationFooter"
              placeholder="Designation"
              value={formData.designationFooter}
              onChange={handleChange}
              className="designation-input"
              required
            />
          </div>
          <Button leftIcon={<CheckCircle size={20} />} className="button">
            <CheckCircle size={18} /> &nbsp; Check
          </Button>
          <Button
            type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{ marginLeft: "250px", width: "150px" }}
            className="button"
          >
            <PaperPlaneRight size={20} /> &nbsp; Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
