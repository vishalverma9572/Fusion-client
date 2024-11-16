import React, { useEffect, useState } from "react";
import { Button, Select } from "@mantine/core";
import {
  User,
  Tag,
  IdentificationCard,
  Calendar,
  CheckCircle,
  Building,
  Money,
  Question,
  Airplane,
  MapPin,
  FloppyDisk,
  PaperPlaneRight,
  Leaf,
  Train,
  CarSimple,
  AirplaneTakeoff,
  Phone,
  Users,
  ChatText,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import "./LtcForm.css";
import {
  search_employee,
  get_my_details,
  submit_ltc_form,
} from "../../../../routes/hr";

const LtcForm = () => {
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();
  const [verifiedReceiver, setVerifiedReceiver] = useState(false);
  const Divider = ({
    thickness = "3px",
    color = "#ccc",
    margin = "20px 0",
  }) => (
    <hr
      style={{
        border: "none",
        borderTop: `${thickness} solid ${color}`,
        margin,
      }}
    />
  );
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

  // State variables for family member details
  const [numFamilyMenbers, setNumFamilyMenbers] = useState(1);
  const [childrenFields, setChildrenFields] = useState([{ name: "", age: "" }]);
  const [numDependents, setNumDependents] = useState(1);
  const [dependentsFields, setDependentsFields] = useState([
    { fullName: "", age: "", reason: "" },
  ]);
  const [selectedPlace, setSelectedPlace] = useState("HomeTown"); // Default is "HomeTown"
  const [placeOfVisit, setPlaceOfVisit] = useState("");

  const handlePlaceChange = (value) => {
    setSelectedPlace(value); // Update the selected place value
    if (value === "HomeTown") {
      setPlaceOfVisit(""); // Reset the visiting place when "HomeTown" is selected
    }
  };

  const handleVisitingPlaceChange = (event) => {
    setPlaceOfVisit(event.target.value);
  };

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

  const handleSelectChange = (value, name) => {
    dispatch(updateForm({ name, value }));
  };

  // Handle changes for number of children
  const handleChildrenChange = (value) => {
    const count = parseInt(value, 10);
    setNumFamilyMenbers(count);
    setChildrenFields(new Array(count).fill({ name: "", age: "" })); // Reset fields based on selected number
  };

  const handleChildInputChange = (index, field, value) => {
    setChildrenFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = {
        ...updatedFields[index], // Copy the existing object
        [field]: value, // Update only the specific field
      };
      return updatedFields; // Return the new array
    });
  };

  // Handle changes for number of dependents
  const handleDependentsChange = (value) => {
    const count = parseInt(value, 10);
    setNumDependents(count);
    setDependentsFields(
      new Array(count).fill({ fullName: "", age: "", reason: "" }),
    ); // Reset fields based on selected number
  };

  const handleDependentInputChange = (index, field, value) => {
    setDependentsFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = {
        ...updatedFields[index], // Copy the existing object
        [field]: value, // Update only the specific field
      };
      return updatedFields; // Return the new array
    });
  };

  const selectStyles = {
    input: {
      border: "none",
      backgroundColor: "transparent",
      color: "#000",
      fontSize: "14px",
      padding: "12px",
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
  };

  const handleSubmit = (event) => {
    // Prevent page refresh
    event.preventDefault();
    if (!verifiedReceiver) {
      alert("Please verify the receiver before submitting the form.");
      return;
    }

    const adjustedMonth = "";
    // Create a submission object with main form data and additional fields for children and dependents
    const submission = {
      name: formData.name,
      blockYear: formData.blockYear,
      pfNo: formData.pfNo,
      basicPaySalary: formData.basicPaySalary,
      designation: formData.designation,
      departmentInfo: formData.departmentInfo,
      leaveRequired: formData.leaveRequired,
      leaveStartDate: formData.leaveStartDate,
      leaveEndDate: formData.leaveEndDate,
      dateOfDepartureForFamily: formData.dateOfDepartureForFamily,
      natureOfLeave: formData.natureOfLeave,
      purposeOfLeave: formData.purposeOfLeave,
      hometownOrNot: selectedPlace,
      placeOfVisit: placeOfVisit,
      addressDuringLeave: formData.addressDuringLeave,
      modeOfTravel: formData.modeOfTravel,
      detailsOfFamilyMembersAlreadyDone: [
        formData.selfName,
        formData.wifeName,
        formData.children,
      ],
      detailsOfFamilyMembersAboutToAvail: childrenFields,

      detailsOfDependents: dependentsFields,
      amountOfAdvanceRequired: formData.amountOfAdvanceRequired,

      //numFamilyMenbers: numFamilyMenbers,
      //children: childrenFields,
      //numDependents: numDependents,
      // detailsOfDependents: [],

      adjustedMonth: adjustedMonth,
      certifiedThatFamilyDependents: formData.certificationDetails,
      submissionDate: formData.date,
      certifiedThatAdvanceTakenOn: formData.previousLTCDate,
      phoneNumberForContact: formData.phoneNumber,
      username_reciever: formData.username_reciever,
      designation_reciever: formData.designation_reciever,
    };

    console.log(submission);

    // Submit the form
    const submitForm = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await fetch(submit_ltc_form, {
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
        Navigate("/hr/ltc/ltcrequests"); //
      } catch (error) {
        console.error("Failed to submit form:", error);
      }
    };
    submitForm();
  };

  return (
    <div className="Ltc_container">
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
                placeholder="Enter Your Full Name"
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
                value={formData.designation}
                placeholder="Enter Your Designation"
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>
        {/* Row 2: Provident Fund No. and Basic Pay */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="blockYear">
              Block year
            </label>
            <div className="input-wrapper">
              <IdentificationCard size={20} />
              <input
                type="number"
                id="blockYear" // updated to match the key in formData
                name="blockYear" // updated to match the key in formData
                value={formData.blockYear}
                placeholder="Block year"
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="pfNo">
              Provident Fund No.
            </label>
            <div className="input-wrapper">
              <IdentificationCard size={20} />
              <input
                type="number"
                id="pfNo"
                name="pfNo"
                value={formData.pfNo}
                placeholder="Provident Fund Number"
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="basicPaySalary">
              Basic Pay
            </label>
            <div className="input-wrapper">
              <Money size={20} />
              <input
                type="number"
                id="basicPaySalary"
                name="basicPaySalary"
                value={formData.basicPaySalary}
                placeholder="Enter Basic Pay"
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 3: Department and Nature of Leave */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="departmentInfo">
              Department / Section
            </label>
            <div className="input-wrapper">
              <Building size={20} />
              <Select
                id="departmentInfo"
                name="departmentInfo"
                data={[
                  {
                    value: "Computer Science Engineering",
                    label: "Computer Science Engineering",
                  },
                  {
                    value: "Electronics and Communication Engineering",
                    label: "Electronics and Communication Engineering",
                  },
                  {
                    value: "Mechanical Engineering",
                    label: "Mechanical Engineering",
                  },
                  {
                    value: "Smart Manufacturing",
                    label: "Smart Manufacturing",
                  },
                  { value: "Design", label: "Design" },
                ]}
                value={formData.departmentInfo}
                onChange={(value) =>
                  handleSelectChange(value, "departmentInfo")
                }
                className="input"
                styles={selectStyles}
                required
              />
            </div>
          </div>
        </div>

        <Divider />
        <div className="grid-col">
          <label className="input-label" htmlFor="leaveRequired">
            (a) Whether leave is required for availing L.T.C.?
          </label>
          <div className="input-wrapper">
            <Question size={20} />
            <Select
              id="leaveRequired"
              name="leaveRequired"
              data={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              value={formData.leaveRequired}
              onChange={(value) => handleSelectChange(value, "leaveRequired")}
              className="input"
              styles={selectStyles}
              required
            />
          </div>
        </div>

        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="leaveStartDate">
              (b) (i) If so, duration of leave applied for From:
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="leaveStartDate"
                name="leaveStartDate" // changed to match the key in formData
                value={formData.leaveStartDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="leaveEndDate">
              To:
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="leaveEndDate"
                name="leaveEndDate" // changed to match the key in formData
                value={formData.leaveEndDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="dateOfDepartureForFamily">
              (ii) Date of departure of family, if not availing himself
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="dateOfDepartureForFamily"
                name="dateOfDepartureForFamily" // changed to match the key in formData
                value={formData.dateOfDepartureForFamily}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 4: LTC Availability and Purpose */}
        <div className="grid-row">
          {" "}
          <div className="grid-col">
            <label className="input-label" htmlFor="natureOfLeave">
              (c) Nature of Leave
            </label>
            <div className="input-wrapper">
              <Leaf size={20} />
              <Select
                id="natureOfLeave"
                name="natureOfLeave"
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
                onChange={(value) => handleSelectChange(value, "natureOfLeave")}
                className="input"
                required
                styles={selectStyles}
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="purposeOfLeave">
              (d) Purpose
            </label>
            <div className="input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="purposeOfLeave"
                name="purposeOfLeave"
                value={formData.purposeOfLeave}
                placeholder="Enter Purpose of Travel"
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid-row">
          {/* Whether L.T.C. is desired for going to hometown or elsewhere */}
          <div className="grid-col">
            <label className="input-label" htmlFor="placeSelection">
              Whether L.T.C. is desired for going to home town or elsewhere?
              Select Place:
            </label>
            <div className="input-wrapper">
              <Select
                id="placeSelection"
                name="placeSelection"
                data={[
                  { value: "HomeTown", label: "HomeTown" },
                  { value: "ElseWhere", label: "ElseWhere" },
                ]}
                value={selectedPlace}
                onChange={handlePlaceChange}
                className="input"
                styles={selectStyles}
              />
            </div>
          </div>

          {/* Input field for entering the place if "Elsewhere" is selected */}
          {selectedPlace === "ElseWhere" && (
            <div className="grid-col">
              <label className="input-label" htmlFor="placeOfVisit">
                Place where you are visiting:
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="placeOfVisit"
                  name="placeOfVisit"
                  value={placeOfVisit}
                  onChange={handleVisitingPlaceChange}
                  placeholder="Enter the place"
                  className="input"
                  required={selectedPlace === "ElseWhere"} // Mark field as required when Elsewhere is selected
                />
              </div>
            </div>
          )}
        </div>

        {/* Row 5: Mode of Travel and Address During Leave */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="modeOfTravel">
              Mode of Travel
            </label>
            <div className="input-wrapper">
              <Airplane size={20} />
              <Select
                id="modeOfTravel"
                name="modeOfTravel"
                data={[
                  { value: "Air", label: "Air" },
                  { value: "Train", label: "Train" },
                  { value: "Car", label: "Car" },
                ]}
                value={formData.modeOfTravel}
                onChange={(value) => handleSelectChange(value, "modeOfTravel")}
                className="input"
                styles={selectStyles}
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="addressDuringLeave">
              Address During Leave
            </label>
            <div className="input-wrapper">
              <MapPin size={20} />
              <input
                type="text"
                id="addressDuringLeave"
                name="addressDuringLeave"
                value={formData.addressDuringLeave}
                placeholder="Enter Address During Leave"
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 6: Details of Family Members */}
        {/* Section 6: Details of Family Members Who Will Avail LTC */}
        <h3>
          (i) Details of family members for whom L.T.C. for this block has
          already been availed:
        </h3>
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="selfName">
              (a) Self
            </label>
            <div className="input-wrapper">
              <User size={20} />
              <input
                type="text"
                id="selfName"
                name="selfName"
                placeholder="Enter Your Name"
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="wifeName">
              (b) Spouse
            </label>
            <div className="input-wrapper">
              <User size={20} />
              <input
                type="text"
                id="wifeName"
                name="wifeName"
                placeholder="Enter Wife's Name"
                onChange={handleChange}
                className="input"
                // required
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="children">
              (c) Children
            </label>
            <div className="input-wrapper">
              <User size={20} />
              <input
                type="text"
                id="childrenName"
                name="children"
                placeholder="Children"
                onChange={handleChange}
                className="input"
                // required
              />
            </div>
          </div>
        </div>

        <div className="grid-col">
          <label className="input-label" htmlFor="numFamilyMenbers">
            (c) Number of Family Members
          </label>
          <div className="input-wrapper">
            <Users size={20} />
            <div className="input-wrapper">
              <Select
                id="numFamilyMenbers"
                name="numFamilyMenbers"
                data={[
                  { value: "0", label: "0" },
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                ]}
                value={numFamilyMenbers.toString()}
                onChange={handleChildrenChange}
                className="input"
                styles={selectStyles}
              />
            </div>
          </div>
        </div>

        {numFamilyMenbers > 0 && (
          <div>
            <h4
              style={{
                marginBottom: "20px",
                fontSize: "1.2rem",
                color: "#2d3748",
              }}
            >
              (ii) Details of family members who will avail L.T.C.
            </h4>
            <table className="family-details-table">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Name</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {childrenFields.map((child, index) => (
                  <tr key={index}>
                    {/* Index Column */}
                    <td>
                      <input
                        type="text"
                        value={index + 1} // Displaying index starting from 1
                        readOnly // The index is readonly since it's just for display
                      />
                    </td>

                    {/* Name Column */}
                    <td>
                      <input
                        type="text"
                        id={`childName${index}`}
                        value={child.name}
                        onChange={(e) =>
                          handleChildInputChange(index, "name", e.target.value)
                        }
                        placeholder="Enter Name"
                        required
                      />
                    </td>

                    {/* Age Column */}
                    <td>
                      <input
                        type="number"
                        id={`childAge${index}`}
                        value={child.age}
                        onChange={(e) =>
                          handleChildInputChange(index, "age", e.target.value)
                        }
                        placeholder="Enter Age"
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section for Dependent Family Members */}
        <h3>Dependent Family Members</h3>
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="numDependents">
              Number of Dependents
            </label>
            <div className="input-wrapper">
              <Users size={20} />
              <div className="input-wrapper">
                <Select
                  id="numDependents"
                  name="numDependents"
                  data={[
                    { value: "0", label: "0" },
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" },
                    { value: "5", label: "5" },
                  ]}
                  value={numDependents.toString()}
                  onChange={handleDependentsChange}
                  className="input"
                  styles={selectStyles}
                />
              </div>
            </div>
          </div>
        </div>

        {numDependents > 0 && (
          <div>
            <h4
              style={{
                marginBottom: "20px",
                fontSize: "1.2rem",
                color: "#2d3748",
              }}
            >
              (d)Dependent parents, minor brothers, and sisters residing with
              the applicant:
            </h4>

            <table className="family-details-table">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>Reason for Dependency</th>
                </tr>
              </thead>
              <tbody>
                {dependentsFields.map((dependent, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={index + 1} // Read-only index
                        className="input"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id={`dependentFullName${index}`}
                        value={dependent.fullName}
                        onChange={(e) =>
                          handleDependentInputChange(
                            index,
                            "fullName",
                            e.target.value,
                          )
                        }
                        className="input"
                        placeholder="Enter Name" // Placeholder added
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`dependentAge${index}`}
                        value={dependent.age}
                        onChange={(e) => {
                          const ageValue = Math.max(0, e.target.value); // Prevent negative values
                          handleDependentInputChange(index, "age", ageValue);
                        }}
                        className="input"
                        placeholder="Enter Age"
                        required
                        min="0" // Add a minimum value
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id={`dependentReason${index}`}
                        value={dependent.reason}
                        onChange={(e) =>
                          handleDependentInputChange(
                            index,
                            "reason",
                            e.target.value,
                          )
                        }
                        className="input"
                        placeholder="Enter Reason"
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Divider />

        <div className="grid-row">
          {/* Amount of advance required */}
          <div className="grid-col amount-advance">
            <label className="input-label" htmlFor="amountOfAdvanceRequired">
              Amount of advance required, if any:
            </label>
            <div className="input-wrapper">
              <Money size={20} />
              <input
                type="number"
                id="amountOfAdvanceRequired"
                name="amountOfAdvanceRequired"
                value={formData.amountOfAdvanceRequired}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          {/* Certified Details */}
          <div className="grid-col">
            <label className="input-label" htmlFor="certificationDetails">
              (i) Certified that family members for whom the L.T.C. is claimed
              are residing with me and are wholly dependent upon me.
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="certificationDetails"
                name="certificationDetails"
                value={formData.certificationDetails}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Date Fields */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="date">
              Date:
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
          <div className="grid-col">
            <label className="input-label" htmlFor="previousLTCDate">
              Certified that the previous L.T.C. advance drawn by me on:
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="previousLTCDate"
                name="previousLTCDate"
                value={formData.previousLTCDate}
                onChange={handleChange}
                className="input"
                required
              />{" "}
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="phoneNumber">
              Phone Number for contact:
            </label>
            <div className="input-wrapper">
              <Phone size={20} />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
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
          >
            <FloppyDisk size={20} />
            &nbsp; Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LtcForm;
