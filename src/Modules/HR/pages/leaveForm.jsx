import React from 'react';
import { Button, Group, Title } from '@mantine/core';
import { PaperPlaneRight, CheckCircle } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateForm, resetForm } from "../../../redux/formSlice";

import './leaveForm.css'; 

const LeaveForm = () => {
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    dispatch(updateForm({ name, value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    dispatch(resetForm());
  };

  return (
    <div className="container">
      <Title className="title">Leave Form</Title>

      <form onSubmit={handleSubmit}>
        {/* Row 1: Name and Designation */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="designation">Designation</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* Row 2: PF Number and Department */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="pfNumber">PF Number</label>
            <input
              type="text"
              id="pfNumber"
              name="pfNumber"
              value={formData.pfNumber}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* Row 3: Leave Start Date and End Date */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="startDate">Leave Start Date</label>
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
          <div className="grid-col">
            <label className="input-label" htmlFor="endDate">Leave End Date</label>
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

        {/* Row 4: Purpose and Nature of Leave */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="purpose">Purpose</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="natureOfLeave">Nature of Leave</label>
            <select
              id="natureOfLeave"
              name="natureOfLeave"
              value={formData.natureOfLeave}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="Casual">Casual</option>
              <option value="Sick">Sick</option>
              <option value="Earned">Earned</option>
            </select>
          </div>
        </div>

        {/* Row 5: Academic Responsibility and Administrative Responsibility */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="academicResponsibility">Academic Responsibility</label>
            <input
              type="text"
              id="academicResponsibility"
              name="academicResponsibility"
              value={formData.academicResponsibility}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="administrativeResponsibility">Administrative Responsibility</label>
            <input
              type="text"
              id="administrativeResponsibility"
              name="administrativeResponsibility"
              value={formData.administrativeResponsibility}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="username-input"
            required
          />
          <input
            type="text"
            name="designationFooter"
            placeholder="Designation"
            value={formData.designationFooter}
            onChange={handleChange}
            className="designation-input"
            required
          />
          <Button color="blue" leftIcon={<CheckCircle size={20} />} variant="outline" className="button-outline">
            Check
          </Button>
          <Button type="submit" color="blue" rightIcon={<PaperPlaneRight size={20} />} className="button">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
