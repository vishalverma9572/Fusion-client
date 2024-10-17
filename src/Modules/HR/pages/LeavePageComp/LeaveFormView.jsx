import React from "react";
import { Button, Select } from "@mantine/core";
import {
  PaperPlaneRight,
  ArrowBendUpRight,
  XCircle,
  CheckCircle,
  FileArchive,
  FileText,
  Table,
  User,
  Tag,
  IdentificationCard,
  Building,
  Calendar,
  ClipboardText,
  FloppyDisk,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import "./LeaveFormView.css";

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
    <div className="leave_container">
      <form onSubmit={handleSubmit}>
        {/* Section 1: Name, Designation (Left), Application Date (Right) */}
        <div className="leave_grid-row">
          <div className="leave_grid-col leave_left-side">
            <label className="leave_input-label" htmlFor="name">
              Name
            </label>
            <div className="leave_input-wrapper">
              <User size={20} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
                className="leave_input"
                required
              />
            </div>
            <label className="leave_input-label" htmlFor="designation">
              Designation
            </label>
            <div className="leave_input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="designation"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="leave_input"
                required
              />
            </div>
          </div>

          <div className="leave_grid-col leave_right-side">
            <label className="leave_input-label" htmlFor="applicationDate">
              Application Date
            </label>
            <div
              className="leave_input-wrapper leave_center"
              style={{ width: "300px" }}
            >
              <Calendar size={20} />
              <input
                type="date"
                id="applicationDate"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                className="leave_input leave_center"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Discipline/Department (Left), PF Number (Right) */}
        <div className="leave_grid-row">
          <div className="leave_grid-col">
            <label className="leave_input-label" htmlFor="department">
              Department
            </label>
            <div className="leave_input-wrapper">
              <Building size={20} />
              <input
                type="text"
                id="department"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="leave_input"
                required
              />
            </div>
          </div>

          <div className="leave_grid-col">
            <label className="leave_input-label" htmlFor="pfNumber">
              PF Number
            </label>
            <div className="leave_input-wrapper">
              <IdentificationCard size={20} />
              <input
                type="number"
                id="pfNumber"
                name="pfNumber"
                placeholder="XXXXXXXXXXXX"
                value={formData.pfNumber}
                onChange={handleChange}
                className="leave_input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Nature of Leave, Leave Start Date, Leave End Date */}
        <div className="leave_grid-row leave_three-columns">
          <div className="leave_grid-col">
            <label className="leave_input-label" htmlFor="natureOfLeave">
              Nature of Leave
            </label>
            <div className="leave_input-wrapper">
              <Select
                className="leave_select"
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

          <div className="leave_grid-col">
            <label className="leave_input-label" htmlFor="startDate">
              Leave Start Date
            </label>
            <div className="leave_input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="leave_input"
                required
              />
            </div>
          </div>

          <div className="leave_grid-col">
            <label className="leave_input-label" htmlFor="endDate">
              Leave End Date
            </label>
            <div className="leave_input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="leave_input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Purpose of Leave */}
        <div className="leave_grid-row">
          <div className="leave_purpose">
            <label className="leave_input-label" htmlFor="purpose">
              Purpose
            </label>
            <div className="leave_input-wrapper">
              <ClipboardText size={20} />
              <input
                type="text"
                id="purpose"
                name="purpose"
                placeholder="Purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="leave_input"
                aria-rowcount={2}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 5: Academic and Administrative Responsibility */}
        <div className="leave_grid-row">
          <div className="leave_grid-col">
            <label
              className="leave_input-label"
              htmlFor="academicResponsibility"
            >
              Academic Responsibility
            </label>
            <div className="leave_input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="academicResponsibility"
                name="academicResponsibility"
                placeholder="Enter the name"
                value={formData.academicResponsibility}
                onChange={handleChange}
                className="leave_input"
                required
              />
            </div>
          </div>

          <div className="leave_grid-col">
            <label
              className="leave_input-label"
              htmlFor="administrativeResponsibility"
            >
              Administrative Responsibility
            </label>
            <div className="leave_input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="administrativeResponsibility"
                name="administrativeResponsibility"
                placeholder="Enter the name"
                value={formData.administrativeResponsibility}
                onChange={handleChange}
                className="leave_input"
                required
              />
            </div>
          </div>
        </div>

        <div className="leave_section-divider">
          <hr className="leave_divider-line" />
        </div>

        <div className="leave_grid-col">
          <label className="leave_input-label" htmlFor="remark">
            Remark
          </label>
          <div className="leave_input-wrapper">
            <ClipboardText size={20} />
            <input
              type="text"
              id="remark"
              name="remark"
              placeholder="Enter any remark"
              value={formData.remark}
              onChange={handleChange}
              className="leave_input"
              required
            />
          </div>
        </div>

        {/* <div className="leave_button-wrapper">
          <Button className="leave_submit-btn" type="submit" leftIcon={<FloppyDisk size={20} />}>
            Submit
          </Button>
        </div> */}

        {/* Footer */}
        <div className="leave_footer-section">
          <div className="leave_input-wrapper">
            <User size={20} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="leave_username-input"
              required
            />
          </div>
          <div className="leave_input-wrapper">
            <Tag size={20} />
            <input
              type="text"
              name="designationFooter"
              placeholder="Designation"
              value={formData.designationFooter}
              onChange={handleChange}
              className="leave_designation-input"
              required
            />
          </div>
          <Button
            leftIcon={<CheckCircle size={25} />}
            style={{ marginLeft: "50px", paddingRight: "15px" }}
            className="leave_button"
          >
            <CheckCircle size={18} /> &nbsp; Check
          </Button>
        </div>

        <div className="leave_button-row">
          <Button
            leftIcon={<PaperPlaneRight size={20} />}
            className="leave_buttonapprove"
          >
            Forward
            <ArrowBendUpRight size={18} />
          </Button>
          <Button
            leftIcon={<CheckCircle size={20} />}
            className="leave_buttonapprove"
          >
            Reject
            <XCircle size={18} />
          </Button>
          <Button
            leftIcon={<CheckCircle size={20} />}
            className="leave_buttonapprove"
          >
            Approve
            <CheckCircle size={18} />
          </Button>
          <Button
            leftIcon={<CheckCircle size={20} />}
            className="leave_buttonapprove"
          >
            Archive
            <FileArchive size={18} />
          </Button>
          <Button
            leftIcon={<FileText size={20} />}
            className="leave_buttonapprove"
          >
            Previous Forms
            <Table size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
