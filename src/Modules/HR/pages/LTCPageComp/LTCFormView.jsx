import React from "react";
import { useEffect, useState } from "react";
import { Button, Divider, Select, Title } from "@mantine/core";
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
  UserList,
  Money,
  Question,
  Leaf,
  Airplane,
  MapPin,
  Users,
  Phone,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
//import "./LtcForm.css";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import { view_ltc_form } from "../../../../routes/hr";

const LTCFormView = () => {
  const { id } = useParams();
  const [fetchedformData, setfetchedformData] = useState(null);
  const [loading, setLoading] = useState(true);

  const exampleItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "LTC", path: "/hr/ltc" },
    { title: "View Form", path: `/hr/ltc/view/${id}` },
  ];

  const [numFamilyMenbers, setNumFamilyMenbers] = useState(0);
  const [childrenFields, setChildrenFields] = useState([]);

  const [numDependents, setNumDependents] = useState(0);
  const [dependentsFields, setDependentsFields] = useState([
    { fullName: "", age: "", reason: "" },
  ]);

  useEffect(() => {
    const fetchfetchedformData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        setLoading(false);
        return;
      }

      // change
      try {
        const response = await fetch(`${view_ltc_form}/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setfetchedformData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setLoading(false);
      }
    };

    fetchfetchedformData();
  }, [id]);

  // Use the fetched data to initialize `numFamilyMenbers` and `childrenFields`
  useEffect(() => {
    if (fetchedformData && fetchedformData.detailsOfFamilyMembersAboutToAvail) {
      const initialChildren =
        fetchedformData.detailsOfFamilyMembersAboutToAvail;
      setNumFamilyMenbers(initialChildren.length);
      setChildrenFields(initialChildren);
    } else {
      // Set default values if detailsOfFamilyMembersAboutToAvail is not available
      setNumFamilyMenbers(0);
      setChildrenFields([]); // Empty array if no data is available
    }
  }, [fetchedformData]);

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

  useEffect(() => {
    if (fetchedformData?.detailsOfDependents) {
      const dependents = fetchedformData.detailsOfDependents;
      setNumDependents(dependents.length);
      // console.log(numDependents)
      setDependentsFields(dependents);
    }
  }, [fetchedformData]);

  const handleDependentsChange = (value) => {
    const count = parseInt(value, 10);
    console.log(`num dependent ${count}`);
    setNumDependents(count);
    setDependentsFields(
      new Array(count).fill({ fullName: "", age: "", reason: "" }),
    );
  };

  const handleDependentInputChange = (index, field, value) => {
    setDependentsFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: value,
      };
      return updatedFields;
    });
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (!fetchedformData) {
    return (
      <>
        <HrBreadcrumbs items={exampleItems} />
        <EmptyTable message="No view data found." />
      </>
    );
  }

  return (
    <>
      <HrBreadcrumbs items={exampleItems} />
      {/* //title  */}
      <Title
        order={2}
        style={{ fontWeight: "500", marginTop: "40px", marginLeft: "15px" }}
      >
        LTC Form Details
      </Title>

      <div className="leave_container">
        <form>
          {/* Row 1:Block Year,  Provident Fund No. and Basic Pay */}

          <div className="grid-row">
            <div className="grid-col">
              <label className="input-label" htmlFor="blockYear">
                Block year
              </label>
              <div className="input-wrapper">
                <IdentificationCard size={20} />
                <input
                  type="number"
                  id="blockYear" // updated to match the key in fetchedformData
                  name="blockYear" // updated to match the key in fetchedformData
                  value={fetchedformData.blockYear}
                  placeholder="Block year"
                  //onChange={handleChange}
                  className="input"
                  disabled
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
                  value={fetchedformData.pfNo}
                  placeholder="Provident Fund Number"
                  //onChange={handleChange}
                  className="input"
                  disabled
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
                  value={fetchedformData.basicPaySalary}
                  placeholder="Enter Basic Pay"
                  //onChange={handleChange}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* Row 2: Name and Designation and Department */}

          <div className="grid-row">
            <div className="grid-col">
              <label className="input-label" htmlFor="name">
                1. Name
              </label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={fetchedformData.name}
                  placeholder="Enter Your Full Name"
                  //onChange={handleChange}
                  className="input"
                  disabled
                />
              </div>
            </div>

            <div className="grid-col">
              <label className="input-label" htmlFor="designation">
                2. Designation
              </label>
              <div className="input-wrapper">
                <Tag size={20} />
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={fetchedformData.designation}
                  placeholder="Enter Your Designation"
                  //onChange={handleChange}
                  className="input"
                  disabled
                />
              </div>
            </div>

            <div className="grid-col">
              <label className="input-label" htmlFor="departmentInfo">
                3. Department / Section
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
                  value={fetchedformData.departmentInfo}
                  className="input"
                  styles={{
                    singleValue: (base) => ({
                      ...base,
                      color: "black", // Ensure the fetched data font color is black
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black", // Placeholder color is also black, if needed
                    }),
                  }}
                  isDisabled={true} // Keep the field disabled
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* Row 3: Leave Requirement */}

          <div className="grid-row">
            <div className="grid-col">
              <label className="input-label" htmlFor="leaveRequired">
                4. (a) Whether leave is required for availing L.T.C.?
              </label>
              <div className="input-wrapper">
                <Question size={20} />
                <select
                  id="leaveRequired"
                  name="leaveRequired"
                  value={
                    fetchedformData.leaveRequired === true
                      ? "Yes"
                      : fetchedformData.leaveRequired === false
                        ? "No"
                        : "Not Specified"
                  }
                  className="input"
                  disabled
                  style={{
                    color: "black", // Ensures the font color of the selected value is black
                    backgroundColor: "transparent", // Keeps the default background color
                  }}
                >
                  <option style={{ color: "black" }} value="Yes">
                    Yes
                  </option>
                  <option style={{ color: "black" }} value="No">
                    No
                  </option>
                  <option style={{ color: "black" }} value="Not Specified">
                    Not Specified
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Leave Duration */}

          <div className="grid-row align-center">
            <label className="input-label" htmlFor="leaveStartDate">
              (b) (i) If so, duration of leave applied for:
            </label>
            <span style={{ margin: "0 1rem" }}>From:</span>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="leaveStartDate"
                name="leaveStartDate" // changed to match the key in fetchedfetchedformData
                value={fetchedformData.leaveStartDate}
                //onChange={handleChange}
                className="input"
                disabled
              />
            </div>
            <span style={{ margin: "0 1rem" }}>To:</span>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="leaveEndDate"
                name="leaveEndDate" // changed to match the key in fetchedfetchedformData
                value={fetchedformData.leaveEndDate}
                //onChange={handleChange}
                className="input"
                disabled
              />
            </div>

            <label
              className="input-label"
              htmlFor="dateOfDepartureForFamily"
              style={{ marginLeft: "2rem" }}
            >
              (ii) Date of departure of family, if not availing himself:
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="dateOfDepartureForFamily"
                name="dateOfDepartureForFamily" // changed to match the key in fetchedfetchedformData
                value={fetchedformData.dateOfDepartureForFamily}
                //onChange={handleChange}
                className="input"
                disabled
              />
            </div>
          </div>

          {/* Row 5: Nature and Purpose of Leave */}

          <div className="grid-row">
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
                    {
                      value: "Restricted Holiday",
                      label: "Restricted Holiday",
                    },
                    { value: "Station Leave", label: "Station Leave" },
                  ]}
                  value={fetchedformData.natureOfLeave}
                  className="input"
                  styles={{
                    singleValue: (base) => ({
                      ...base,
                      color: "black", // Set selected text color to black
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black", // Ensure placeholder text is also black
                    }),
                  }}
                  isDisabled={true} // Keep the dropdown disabled
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
                  value={fetchedformData.purposeOfLeave}
                  placeholder="Enter Purpose of Travel"
                  //onChange={handleChange}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          <Divider />

          {/*  Row 6: Whether L.T.C. is desired for going to hometown or elsewhere */}
          <div className="grid-row">
            <div className="grid-col">
              <label className="input-label" htmlFor="placeOfVisit">
                5. Whether L.T.C. is desired for going to home town or
                elsewhere? Select Place:
              </label>
              <div className="input-wrapper">
                <input
                  value={fetchedformData.placeOfVisit}
                  onChange={(value) => handlePlaceChange(value, "placeOfVisit")}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Row 7: Mode of Travel and Address During Leave */}
          <div className="grid-row">
            <div className="grid-col">
              <label className="input-label" htmlFor="modeOfTravel">
                6. Mode of Travel
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
                  value={fetchedformData.modeofTravel}
                  //onChange={(value) => handleSelectChange(value, "modeOfTravel")}
                  className="input"
                  disabled
                />
              </div>
            </div>

            <div className="grid-col">
              <label className="input-label" htmlFor="addressDuringLeave">
                7. Address During Leave
              </label>
              <div className="input-wrapper">
                <MapPin size={20} />
                <input
                  type="text"
                  id="addressDuringLeave"
                  name="addressDuringLeave"
                  value={fetchedformData.addressDuringLeave}
                  placeholder="Enter Address During Leave"
                  //onChange={handleChange}
                  className="input"
                  required
                  disabled
                />
              </div>
            </div>
          </div>

          <Divider />

          {/*Row 8: Label for Family Members */}
          <label className="input-label" htmlFor="family_members_availing_LTC">
            8. (i) Details of family members for whom L.T.C. for this block has
            already been availed:
          </label>

          <div className="grid-row">
            {/* Self Field */}
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
                  placeholder="Your Name"
                  //onChange={handleChange}
                  className="input"
                  value={
                    fetchedformData?.detailsOfFamilyMembersAlreadyDone?.[0] ||
                    "" // Safe access with fallback}
                  }
                  disabled
                  required
                />
              </div>
            </div>

            {/* Spouse Field */}
            <div className="grid-col">
              <label className="input-label" htmlFor="spouseName">
                (b) Spouse (if any)
              </label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="wifeName"
                  name="wifeName"
                  placeholder="Wife's Name"
                  //onChange={handleChange}
                  className="input"
                  value={
                    fetchedformData?.detailsOfFamilyMembersAlreadyDone?.[1] ||
                    "" // Safe access with fallback}
                  }
                  disabled
                  required
                />
              </div>
            </div>

            {/* Number of Children Field */}
            <div className="grid-col">
              <label className="input-label" htmlFor="numberOfChildren">
                (c) Child (if any)
              </label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="children"
                  name="children"
                  placeholder="Child's Name"
                  //onChange={handleChange}
                  className="input"
                  value={
                    fetchedformData?.detailsOfFamilyMembersAlreadyDone?.[2] ||
                    "" // Safe access with fallback}
                  }
                  disabled
                  required
                />
              </div>
            </div>
          </div>

          {/* Section for Family Members */}
          {numFamilyMenbers > 0 && (
            <div>
              <label
                className="input-label"
                htmlFor="family_members_availing_LTC_in_future"
              >
                (ii) Details of family members who will avail L.T.C.
              </label>

              <div
                className="grid-row"
                style={{ display: "flex", alignItems: "flex-start" }}
              >
                {/* Number of Family Members Field with 25% width */}
                <div className="grid-col" style={{ flex: "0 0 25%" }}>
                  <label className="input-label" htmlFor="numFamilyMenbers">
                    Number of Family Members
                  </label>
                  <div className="input-wrapper">
                    <Users size={20} />
                    <input
                      type="text"
                      id="numFamilyMenbers"
                      value={numFamilyMenbers}
                      readOnly
                      className="input"
                    />
                  </div>
                </div>

                {/* Family Members Table with 70% width and equal spacing */}
                <div
                  className="grid-col"
                  style={{ flex: "0 0 70%", paddingLeft: "15px" }}
                >
                  <table
                    className="family-details-table"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "15%" }}>Index</th>{" "}
                        {/* Increased width for Index column */}
                        <th style={{ width: "40%" }}>Full Name</th>{" "}
                        {/* Equal width for Full Name */}
                        <th style={{ width: "15%" }}>Age</th>
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
                              readOnly
                              className="input"
                            />
                          </td>

                          {/* Full Name Column */}
                          <td>
                            <input
                              type="text"
                              id={`childName${index}`}
                              value={child.name}
                              disabled
                              className="input"
                            />
                          </td>

                          {/* Age Column */}
                          <td>
                            <input
                              type="number"
                              id={`childAge${index}`}
                              value={child.age}
                              disabled
                              className="input"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <label
            className="input-label"
            htmlFor="dependent_family_members_availing_LTC_in_future"
          >
            (iii) Dependent parents, minor brothers, and sisters residing with
            the applicant:
          </label>
          <div>
            <div
              className="grid-row"
              style={{ display: "flex", alignItems: "flex-start" }}
            >
              {/* Number of Dependents Field with 25% width */}
              <div className="grid-col" style={{ flex: "0 0 25%" }}>
                <label className="input-label" htmlFor="numDependents">
                  Number of Dependents
                </label>
                <div className="input-wrapper">
                  <Users size={20} />
                  <div
                    className="input"
                    style={{
                      padding: "10px 80px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      textAlign: "center",
                      // backgroundColor: "#f9f9f9", // Keep background consistent
                      color: "#000", // Ensure text is black
                    }}
                  >
                    {numDependents}
                  </div>
                </div>
              </div>

              {/* Dependents Table with 70% width */}
              {numDependents > 0 && (
                <div
                  className="grid-col"
                  style={{ flex: "0 0 70%", paddingLeft: "15px" }}
                >
                  <table
                    className="family-details-table"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "10%" }}>Index</th>
                        <th style={{ width: "30%" }}>Full Name</th>
                        <th style={{ width: "15%" }}>Age</th>
                        <th style={{ width: "45%" }}>Reason for Dependency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dependentsFields.map((dependent, index) => (
                        <tr key={index}>
                          {/* Index Column */}
                          <td>
                            <input
                              type="text"
                              value={index + 1}
                              className="input"
                              readOnly
                              disabled
                              style={{ textAlign: "center" }}
                            />
                          </td>

                          {/* Full Name Column */}
                          <td>
                            <input
                              type="text"
                              id={`dependentFullName${index}`}
                              value={dependent.fullName}
                              className="input"
                              disabled
                            />
                          </td>

                          {/* Age Column */}
                          <td>
                            <input
                              type="number"
                              id={`dependentAge${index}`}
                              value={dependent.age}
                              className="input"
                              disabled
                            />
                          </td>

                          {/* Reason Column */}
                          <td>
                            <input
                              type="text"
                              id={`dependentReason${index}`}
                              value={dependent.reason}
                              className="input"
                              disabled
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <Divider />

          <div className="grid-row">
            {/* Amount of advance required */}
            <div className="grid-col amount-advance">
              <label className="input-label" htmlFor="amountOfAdvanceRequired">
                9. Amount of advance required, if any:
              </label>
              <div className="input-wrapper">
                <Money size={20} />
                <input
                  type="number"
                  id="amountOfAdvanceRequired"
                  name="amountOfAdvanceRequired"
                  value={fetchedformData.amountOfAdvanceRequired}
                  //onChange={handleChange}
                  className="input"
                  disabled
                />
              </div>
            </div>

            <div className="grid-col">
              <label className="input-label" htmlFor="date">
                Taken on the Date:
              </label>
              <div className="input-wrapper">
                <Calendar size={20} />
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={fetchedformData.submissionDate}
                  //onChange={handleChange}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="grid-row">
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
                  value={
                    fetchedformData.certifiedThatFamilyDependents === true
                      ? "Yes"
                      : fetchedformData.certifiedThatFamilyDependents === false
                        ? "No"
                        : "Not specified"
                  }
                  //onChange={handleChange}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          <div
            className="grid-row"
            style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
          >
            {/* Previous LTC Date Field */}
            <div className="grid-col" style={{ flex: "1 1 30%" }}>
              <label
                className="input-label"
                htmlFor="previousLTCDate"
                style={{ whiteSpace: "nowrap" }}
              >
                (ii) Certified that the previous L.T.C. advance drawn by me on:
              </label>
              <div className="input-wrapper">
                <Calendar size={20} />
                <input
                  type="date"
                  id="previousLTCDate"
                  name="previousLTCDate"
                  value={fetchedformData.certifiedThatAdvanceTakenOn}
                  className="input"
                  disabled
                />
              </div>
            </div>

            {/* Adjusted Month Dropdown */}
            <div className="grid-col" style={{ flex: "1 1 30%" }}>
              <label className="input-label" htmlFor="adjustedMonth">
                has been adjusted in the month of:
              </label>
              <div className="input-wrapper" style={{ position: "relative" }}>
                <select
                  id="adjustedMonth"
                  name="adjustedMonth"
                  value={fetchedformData.adjustedMonth || ""}
                  className="input"
                  disabled // Keep it disabled for the view form
                  style={{
                    color: "black",
                    paddingLeft: "30px",
                  }}
                >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="grid-col" style={{ flex: "1 1 30%" }}>
              <label className="input-label" htmlFor="phoneNumber">
                10. Phone Number for contact:
              </label>
              <div className="input-wrapper">
                <Phone size={20} />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={fetchedformData.phoneNumberForContact}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Footer */}
        </form>
        <Link
          to={`/hr/FormView/ltcform_track/${fetchedformData.file_id}`}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#007bffcc", // Blue background, adjust color as needed
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
            textAlign: "center",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          // Add hover effect
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#007bff")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bffcc")}
        >
          Track Status
        </Link>
      </div>
    </>
  );
};

export default LTCFormView;
