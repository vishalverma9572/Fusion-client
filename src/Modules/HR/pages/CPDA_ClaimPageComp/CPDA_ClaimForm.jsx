// src/Modules/HR/components/CPDA_ClaimForm.js
import React from "react";
import { Button } from "@mantine/core";
import {
  PaperPlaneRight,
  CheckCircle,
  User,
  Tag,
  IdentificationCard,
  Calendar,
  ClipboardText,
  CurrencyDollar,
  FileText,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import "./CPDA_ClaimForm.css";

function CPDA_ClaimForm() {
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateForm({ name, value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    dispatch(resetForm());
  };

  return (
    <div className="CPDA_ClaimForm_container">
      <form onSubmit={handleSubmit}>
        {/* Row 1: Name and Designation */}
        <div className="grid-row">
          <div className="grid-col">
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
          </div>

          <div className="grid-col">
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
        </div>

        {/* Row 2: Amount Required and Date */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="amountRequired">
              Adjustment/Reimbursement Submitted for Rs.
            </label>
            <div className="input-wrapper">
              <CurrencyDollar size={20} />
              <input
                type="text"
                id="amountRequired"
                name="amountRequired"
                placeholder="Amount Required"
                value={formData.amountRequired}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="balanceDate">
              Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="balanceDate"
                name="balanceDate"
                value={formData.balanceDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 3: Advance Taken and PF Number */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="advanceTaken">
              Advance Taken
            </label>
            <div className="input-wrapper">
              <CurrencyDollar size={20} />
              <input
                type="text"
                id="amountRequired"
                name="amountRequired"
                placeholder="Amount Required"
                value={formData.amountRequired}
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
                type="text"
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

        {/* Row 4: Purpose */}
        <div className="grid-row">
          <div className="grid-col" style={{ flexGrow: 2 }}>
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
                style={{ width: "60%" }}
                required
              />
            </div>
          </div>
        </div>

        {/* Row 5: Internal Audit */}
        <div className="section-divider">
          <hr className="divider-line" />
          <h3 className="section-heading">Internal Audit</h3>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="billChecked">
              Bill Checked in Audit for Rs.
            </label>
            <div className="input-wrapper">
              <FileText size={20} />
              <input
                type="text"
                id="pdaRegisterEntry"
                name="pdaRegisterEntry"
                placeholder="Audit Entry"
                value={formData.pdaRegisterEntry}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Row :6 Estt. Section */}
        <div className="section-divider">
          <hr className="divider-line" />
          <h3 className="section-heading">Estt. Section</h3>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="balanceDate">
              Balance available as on date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="balanceDate"
                name="balanceDate"
                value={formData.balanceDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="pdaPageNumber">
              Adjustment/Reimbursement amount entered in PDA Register page no.
            </label>
            <div className="input-wrapper">
              <FileText size={20} />
              <input
                type="text"
                id="pdaPageNumber"
                name="pdaPageNumber"
                placeholder="Page Number"
                value={formData.pdaPageNumber}
                onChange={handleChange}
                className="input"
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
          <Button
            leftIcon={<CheckCircle size={25} />}
            style={{ marginLeft: "50px", paddingRight: "15px" }}
            className="button"
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
          >
            <PaperPlaneRight size={20} /> &nbsp; Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CPDA_ClaimForm;
