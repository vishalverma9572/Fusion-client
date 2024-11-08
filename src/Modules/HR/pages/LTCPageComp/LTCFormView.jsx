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
//import "./LeaveFormView.css";
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
      setDependentsFields(dependents);
    }
  }, [fetchedformData]);

  const handleDependentsChange = (value) => {
    const count = parseInt(value, 10);
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
        <form>
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
                Designation
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
                  value={fetchedformData.departmentInfo}
                  /*onChange={(value) =>
                  handleSelectChange(value, "departmentInfo")
                } */
                  className="input"
                  //styles={selectStyles}
                  disabled
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
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Specified">Not Specified</option>
              </select>
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
                  name="leaveStartDate" // changed to match the key in fetchedfetchedformData
                  value={fetchedformData.leaveStartDate}
                  //onChange={handleChange}
                  className="input"
                  disabled
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
                  name="leaveEndDate" // changed to match the key in fetchedfetchedformData
                  value={fetchedformData.leaveEndDate}
                  //onChange={handleChange}
                  className="input"
                  disabled
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
                  name="dateOfDepartureForFamily" // changed to match the key in fetchedfetchedformData
                  value={fetchedformData.dateOfDepartureForFamily}
                  //onChange={handleChange}
                  className="input"
                  disabled
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
                    {
                      value: "Restricted Holiday",
                      label: "Restricted Holiday",
                    },
                    { value: "Station Leave", label: "Station Leave" },
                  ]}
                  value={fetchedformData.natureOfLeave}
                  //onChange={(value) => handleSelectChange(value, "natureOfLeave")}
                  className="input"
                  disabled
                  //styles={selectStyles}
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
                  value={fetchedformData.selectedPlace}
                  //onChange={handlePlaceChange}
                  className="input"
                  //styles={selectStyles}
                />
              </div>
            </div>
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
                  value={fetchedformData.modeofTravel}
                  //onChange={(value) => handleSelectChange(value, "modeOfTravel")}
                  className="input"
                  //styles={selectStyles}
                  disabled
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
                  value={fetchedformData.addressDuringLeave}
                  placeholder="Enter Address During Leave"
                  //onChange={handleChange}
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
                  //onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid-col">
              <label className="input-label" htmlFor="wifeName">
                (b) Wife
              </label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="wifeName"
                  name="wifeName"
                  placeholder="Enter Wife's Name"
                  //onChange={handleChange}
                  className="input"
                  required
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
                  id="children"
                  name="children"
                  placeholder="Children"
                  //onChange={handleChange}
                  className="input"
                  required
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
                  //styles={selectStyles}
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
                            handleChildInputChange(
                              index,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="Enter Name"
                          disabled
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
                          disabled
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Section for Dependent Family Members */}
          <div>
            <h3>Dependent Family Members</h3>
            <div className="grid-row">
              <div className="grid-col">
                <label className="input-label" htmlFor="numDependents">
                  Number of Dependents
                </label>
                <div className="input-wrapper">
                  <div className="input-wrapper">
                    <Select
                      id="numDependents"
                      name="numDependents"
                      className="input"
                      value={dependentsFields.length}
                      onChange={(e) => handleDependentsChange(e.target.value)}
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
                  (d)Dependent parents, minor brothers, and sisters residing
                  with the applicant:
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
                            value={index + 1}
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
                            placeholder="Enter Name"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            id={`dependentAge${index}`}
                            value={dependent.age}
                            onChange={(e) => {
                              const ageValue = Math.max(0, e.target.value);
                              handleDependentInputChange(
                                index,
                                "age",
                                ageValue,
                              );
                            }}
                            className="input"
                            placeholder="Enter Age"
                            required
                            min="0"
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
          </div>
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
                  value={fetchedformData.amountOfAdvanceRequired}
                  //onChange={handleChange}
                  className="input"
                  disabled
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
                  value={fetchedformData.submissionDate}
                  //onChange={handleChange}
                  className="input"
                  disabled
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
                  value={fetchedformData.certifiedThatAdvanceTakenOn}
                  //onChange={handleChange}
                  className="input"
                  disabled
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
                  value={fetchedformData.phoneNumberForContact}
                  //onChange={handleChange}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Footer */}
        </form>
      </div>
    </>
  );
};

export default LTCFormView;
