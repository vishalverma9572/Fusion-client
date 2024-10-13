import React from "react";
import { Button } from "@mantine/core";
import {
  PaperPlaneRight,
  CheckCircle,
  User,
  Tag,
  IdentificationCard,
  Building,
  Calendar,
  ClipboardText,
  CurrencyDollar,
  FileText,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../redux/formSlice";
import "../styles/leaveForm.css";

const CpdaForm = () => {
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

        {/* Row 2: PF Number and Amount Required */}
        <div className="grid-row">
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
          <div className="grid-col">
            <label className="input-label" htmlFor="amountRequired">
              Amount Required
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
        </div>

        {/* Row 3: Balance available as on date and Advance (PDA) due */}
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
            <label className="input-label" htmlFor="advanceDue">
              Advance (PDA) due for adjustment, if any
            </label>
            <div className="input-wrapper">
              <CurrencyDollar size={20} />
              <input
                type="text"
                id="advanceDue"
                name="advanceDue"
                placeholder="Advance Due"
                value={formData.advanceDue}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Purpose and Date */}
        <div className="grid-row">
          <div className="grid-col">
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
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="date">
              Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 5: Internal Audit fields */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="pdaRegisterEntry">
              Entry checked in PDA Register for Rs.
            </label>
            <div className="input-wrapper">
              <FileText size={20} />
              <input
                type="text"
                id="pdaRegisterEntry"
                name="pdaRegisterEntry"
                placeholder="PDA Register Entry"
                value={formData.pdaRegisterEntry}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="pdaPageNumber">
              Advance amount entered in PDA Register page no.
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

        {/* Footer: Username and Designation */}
        <div className="footer-section">
          <div className="input-wrapper">
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
            Check
          </Button>
          <Button
            type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            className="button"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CpdaForm;
