import React from "react";
import { Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
  PaperPlaneRight,
  CheckCircle,
  User,
  Tag,
  Building,
  Calendar,
} from "@phosphor-icons/react";
import { updateForm, resetForm } from "../../../redux/formSlice";
import "../styles/ltcForm.css";

const LTCForm = () => {
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
        {/* Row 1: Block Year and Provident Fund No */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="blockYear">
              Block Year
            </label>
            <input
              type="text"
              id="blockYear"
              name="blockYear"
              value={formData.blockYear}
              onChange={handleChange}
              className="input"
              placeholder="Block Year"
              required
            />
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="providentFundNumber">
              Provident Fund No.
            </label>
            <input
              type="text"
              id="providentFundNumber"
              name="providentFundNumber"
              value={formData.providentFundNumber}
              onChange={handleChange}
              className="input"
              placeholder="XXXXXXXX"
              required
            />
          </div>
        </div>

        {/* Row 2: Name, Designation, Basic Pay */}
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
          <div className="grid-col">
            <label className="input-label" htmlFor="basicPay">
              Basic Pay
            </label>
            <input
              type="text"
              id="basicPay"
              name="basicPay"
              value={formData.basicPay}
              onChange={handleChange}
              className="input"
              placeholder="Basic Pay"
              required
            />
          </div>
        </div>

        {/* Row 3: Department, Leave Start Date, Leave End Date */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="department">
              Department/Section
            </label>
            <div className="input-wrapper">
              <Building size={20} />
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="select"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="SM">SM</option>
              </select>
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="startDate">
              From (Leave Start Date)
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
              To (Leave End Date)
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

        {/* Row 4a: Nature of Leave, Purpose */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="natureOfLeave">
              Nature of Leave
            </label>
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
          <div className="grid-col">
            <label className="input-label" htmlFor="purpose">
              Purpose
            </label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="input"
              placeholder="Purpose"
              required
            />
          </div>
        </div>

        {/* Row 4b: Address During Leave */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="addressDuringLeave">
              Address During Leave
            </label>
            <input
              type="text"
              id="addressDuringLeave"
              name="addressDuringLeave"
              value={formData.addressDuringLeave}
              onChange={handleChange}
              className="input"
              placeholder="Enter Address"
              required
            />
          </div>
        </div>

        {/* Row 5: Whether leave is available for L.T.C. */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="ltcAvailability">
              Whether leave is available for availing L.T.C.?
            </label>
            <select
              id="ltcAvailability"
              name="ltcAvailability"
              value={formData.ltcAvailability}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        {/* Row 6: Whether L.T.C. is desired for hometown or elsewhere */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="ltcHometownElsewhere">
              Whether L.T.C. is desired for going to hometown or elsewhere?
            </label>
            <select
              id="ltcHometownElsewhere"
              name="ltcHometownElsewhere"
              value={formData.ltcHometownElsewhere}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="Hometown">Hometown</option>
              <option value="Elsewhere">Elsewhere</option>
            </select>
          </div>
        </div>

        {/* Row 7: Details of family members already availed */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="ltcFamilyMembers">
              Details of Family Members (already availed)
            </label>
            <input
              type="text"
              id="ltcFamilyMembers"
              name="ltcFamilyMembers"
              value={formData.ltcFamilyMembers}
              onChange={handleChange}
              className="input"
              placeholder="Family Members"
            />
          </div>
        </div>

        {/* Row 8: Contact Number, Amount of Advance */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="contactNumber">
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="input"
              placeholder="Contact Number"
              required
            />
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="advanceAmount">
              Amount of Advance Required (if any)
            </label>
            <input
              type="text"
              id="advanceAmount"
              name="advanceAmount"
              value={formData.advanceAmount}
              onChange={handleChange}
              className="input"
              placeholder="Advance Amount"
            />
          </div>
        </div>

        {/* Row 9: Name and Relationship of family members for LTC */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="ltcFamilyMembersName">
              Name of the family member(s) for whom L.T.C. is proposed to be
              availed
            </label>
            <input
              type="text"
              id="ltcFamilyMembersName"
              name="ltcFamilyMembersName"
              value={formData.ltcFamilyMembersName}
              onChange={handleChange}
              className="input"
              placeholder="Family Member Name(s)"
              required
            />
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="ltcFamilyRelationship">
              Relationship of the family member(s) with the government servant
            </label>
            <input
              type="text"
              id="ltcFamilyRelationship"
              name="ltcFamilyRelationship"
              value={formData.ltcFamilyRelationship}
              onChange={handleChange}
              className="input"
              placeholder="Relationship"
              required
            />
          </div>
        </div>

        {/* Row 10: Onward journey details */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="onwardJourneyDate">
              Date of onward journey
            </label>
            <input
              type="date"
              id="onwardJourneyDate"
              name="onwardJourneyDate"
              value={formData.onwardJourneyDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="returnJourneyDate">
              Date of return journey
            </label>
            <input
              type="date"
              id="returnJourneyDate"
              name="returnJourneyDate"
              value={formData.returnJourneyDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* Row 11: Mode of transport, class of accommodation */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="modeOfJourney">
              Whether Air/Train/Bus journey?
            </label>
            <select
              id="modeOfJourney"
              name="modeOfJourney"
              value={formData.modeOfJourney}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="Air">Air</option>
              <option value="Train">Train</option>
              <option value="Bus">Bus</option>
            </select>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="classOfAccommodation">
              Class of Accommodation
            </label>
            <input
              type="text"
              id="classOfAccommodation"
              name="classOfAccommodation"
              value={formData.classOfAccommodation}
              onChange={handleChange}
              className="input"
              placeholder="Class"
              required
            />
          </div>
        </div>

        {/* Row 12: Place to be visited */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="placeToVisit">
              Place to be visited
            </label>
            <input
              type="text"
              id="placeToVisit"
              name="placeToVisit"
              value={formData.placeToVisit}
              onChange={handleChange}
              className="input"
              placeholder="Place to Visit"
              required
            />
          </div>
        </div>

        {/* Footer */}
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

export default LTCForm;
