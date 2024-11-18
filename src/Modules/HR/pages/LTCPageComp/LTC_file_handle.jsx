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
  PencilSimpleLine,
  Prohibit,
  NavigationArrow,
  TrayArrowDown,
  UploadSimple,
  CurrencyDollar,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
//import "./LeaveFormView.css";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import {
  view_ltc_form,
  get_form_id,
  ltc_edit_handle,
  search_employee,
  ltc_file_handle,
} from "../../../../routes/hr";

const LTCFormView = () => {
  const { id } = useParams();
  const [fetchedformData, setfetchedformData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form_id, setForm_id] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [verifiedReceiver, setVerifiedReceiver] = useState(false);
  const [username_reciever, setUsername_reciever] = useState("");
  const [designation_reciever, setDesignation_reciever] = useState("");
  const [remark, setRemark] = useState("");
  const navigate = useNavigate();

  const [archive, setArchive] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const archiveParam = urlParams.get("archive");
    if (archiveParam === "true") {
      setArchive(true);
    }
  }, []);

  const handleChangeusername_reciever = (e) => {
    setUsername_reciever(e.target.value);
  };

  const handleremark = (e) => {
    setRemark(e.target.value);
  };
  const handleCheck = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await fetch(
        `${search_employee}?search=${username_reciever}`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      if (!response.ok) {
        alert("Receiver not found. Please check the username and try again.");
        throw new Error("Network response was not ok");
      }

      const fetchedReceiverData = await response.json();

      setDesignation_reciever(fetchedReceiverData.designation);

      setVerifiedReceiver(true);
      alert("Receiver verified successfully!");
    } catch (error) {
      console.error("Failed to fetch receiver data:", error);
    }
  };

  const exampleItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "LTC", path: "/hr/ltc" },
    { title: "File Handle", path: `/hr/ltc/file_handler/${id}` },
  ];

  console.log(id);

  const [numFamilyMenbers, setNumFamilyMenbers] = useState(0);
  const [childrenFields, setChildrenFields] = useState([]);

  const [numDependents, setNumDependents] = useState(0);
  const [dependentsFields, setDependentsFields] = useState([
    { fullName: "", age: "", reason: "" },
  ]);

  useEffect(() => {
    const fetchFormData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        setLoading(false);
        return;
      }

      try {
        const response1 = await fetch(`${get_form_id}/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });
        console.log(response1);

        if (!response1.ok) {
          throw new Error("Network response was not ok");
        }

        const data1 = await response1.json();
        setForm_id(data1.form_id);
        console.log(data1);
        console.log(data1.form_id);

        const response = await fetch(`${view_ltc_form}/${data1.form_id}`, {
          headers: { Authorization: `Token ${token}` },
        });
        console.log(response);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let data = await response.json();
        console.log(data);

        setfetchedformData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setLoading(false);
      }
    };

    fetchFormData();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setfetchedformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = (e, action) => {
    e.preventDefault();

    if (!verifiedReceiver) {
      if (action === "0" || action === "1") {
        alert("Please verify the receiver before proceeding.");
        return;
      }
    }

    //
    // setLoading(true);
    const adjustedMonth = "";
    const submissionData = {
      form_id: form_id,
      action: action,
      remark: remark,
      username_receiver: username_reciever,
      designation_receiver: designation_reciever,
      submissionDate: fetchedformData.submissionDate,
      pfNo: fetchedformData.pfNo,
      departmentInfo: fetchedformData.departmentInfo,
      purpose: fetchedformData.purpose,
      blockYear: fetchedformData.blockYear,
      basicPaySalary: fetchedformData.basicPaySalary,
      leaveRequired: fetchedformData.leaveRequired,
      leaveStartDate: fetchedformData.leaveStartDate,
      leaveEndDate: fetchedformData.leaveEndDate,
      dateOfDepartureForFamily: fetchedformData.dateOfDepartureForFamily,
      natureOfLeave: fetchedformData.natureOfLeave,
      purposeOfLeave: fetchedformData.purposeOfLeave,
      /*hometownOrNot: selectedPlace,
      placeOfVisit: placeOfVisit,*/
      addressDuringLeave: fetchedformData.addressDuringLeave,
      modeOfTravel: fetchedformData.modeOfTravel,
      /*detailsOfFamilyMembersAlreadyDone: [
        fetchedformData.selfName,
        fetchedformData.wifeName,
        fetchedformData.children,
      ], */
      /*detailsOfFamilyMembersAboutToAvail: childrenFields,
    //   detailsOfDependents: dependentsFields,*/
      amountOfAdvanceRequired: fetchedformData.amountOfAdvanceRequired,
      adjustedMonth: adjustedMonth,
      certifiedThatFamilyDependents: fetchedformData.certificationDetails,
      //submissionDate: fetchedformData.date,
      certifiedThatAdvanceTakenOn: fetchedformData.previousLTCDate,
      phoneNumberForContact: fetchedformData.phoneNumber,
      //username_reciever: formData.username_reciever,
      designation_reciever: fetchedformData.designation_reciever,
    };

    console.log(submissionData);
    // send data to the server
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    const senddata = async () => {
      try {
        const response = await fetch(`${ltc_edit_handle}/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        alert("Form data saved successfully!");
        navigate("/hr/ltc");
      } catch (error) {
        alert("Failed to save form data");
        console.error("Failed to save form data:", error);
      }
    };

    const file_data = {
      form_id: form_id,
      action: action,
      remark: remark,
      username_receiver: username_reciever,
      designation_receiver: designation_reciever,
    };

    const sendfiledata = async () => {
      try {
        const response = await fetch(`${ltc_file_handle}/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },

          body: JSON.stringify(file_data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        alert("Form data saved successfully!");
        navigate("/hr/ltc");
      } catch (error) {
        alert("Failed to save form data");
        console.error("Failed to save form data:", error);
      }
    };

    if (isEditing) {
      senddata();
    } else {
      sendfiledata();
    }

    // setIsEditing(false);
    // setLoading(false);
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
  console.log(fetchedformData);

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

      <div className="ltc_container">
        {!isEditing && (
          <Link
            to={`/hr/FormView/ltc_track/${fetchedformData.file_id}`}
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
              marginTop: "20px",
              marginBottom: "20px",
            }}
            // Add hover effect
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#007bff")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bffcc")}
          >
            Track Status
          </Link>
        )}
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
              <label className="input-label" htmlFor="placeOfVisit">
                Whether L.T.C. is desired for going to home town or elsewhere?
                Select Place:
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
                  disabled
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
                  value={
                    fetchedformData?.detailsOfFamilyMembersAlreadyDone?.[0] ||
                    "" // Safe access with fallback}
                  }
                  disabled
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

          <div className="grid-col">
            <label className="input-label" htmlFor="numFamilyMenbers">
              (c) Number of Family Members
            </label>
            <div className="input-wrapper">
              <Users size={20} />
              <div className="input-wrapper">
                <div
                  className="input"
                  style={{
                    padding: "10px 80px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  {numDependents}
                </div>
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
                          disabled
                        />
                      </td>

                      {/* Age Column */}
                      <td>
                        <input
                          type="number"
                          id={`childAge${index}`}
                          value={child.age}
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
            <div className="grid-row">
              <div className="grid-col">
                <label className="input-label" htmlFor="numDependents">
                  Number of Dependents
                </label>
                <div className="input-wrapper">
                  <Users size={20} />
                  <div className="input-wrapper">
                    <div
                      className="input"
                      style={{
                        padding: "10px 80px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    >
                      {numDependents}
                    </div>
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
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            id={`dependentFullName${index}`}
                            value={dependent.fullName}
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            id={`dependentAge${index}`}
                            value={dependent.age}
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            id={`dependentReason${index}`}
                            value={dependent.reason}
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
          {!isEditing && (
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <Button
                leftIcon={
                  isEditing ? <FloppyDisk size={18} /> : <FileText size={18} />
                }
                onClick={handleEditClick}
                variant="outline"
              >
                <PencilSimpleLine size={16} /> &nbsp; Edit
              </Button>
            </div>
          )}

          <div className="section-divider">
            <hr
              style={{
                width: "100%",
                margin: "auto",
                marginTop: "20px",
                height: "2px",
                marginBottom: "30px",
              }}
            />
            <h3 className="section-heading">File Handling</h3>
          </div>

          {/*add  horizontal line centered and 2px and color blue */}
          {/* <hr style={{ width: "100%", margin: "auto", marginTop: "20px", height: "2px" }} />
            <br/> */}

          {/* remark */}

          <div className="grid-row">
            <div className="grid-col">
              <label className="input-label" htmlFor="remark">
                Remark
              </label>
              <div className="input-wrapper">
                <Tag size={20} />
                <input
                  type="text"
                  id="remark"
                  name="remark"
                  value={remark}
                  className="input"
                  placeholder="Enter Remark"
                  onChange={handleremark}
                  required
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          </div>
        </form>
        <div
          className="footer-section"
          style={{
            // corner left bottom radius
            borderRadius: "35px 0px 0px 35px",
            marginRight: "-25px",
          }}
        >
          <div className="input-wrapper">
            <User size={20} />
            <input
              type="text"
              name="username_reciever"
              placeholder="Receiver's Username"
              value={username_reciever}
              onChange={handleChangeusername_reciever}
              style={{ paddingLeft: "40px" }}
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
              value={designation_reciever}
              className="designation-input"
              style={{ paddingLeft: "40px" }}
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
        </div>
        <br />
        <div
          className="footer-section"
          style={{
            marginRight: "-25px",
          }}
        >
          <Button
            // type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{
              marginLeft: "350px",
              minwidth: "150px",
              width: "fit-content",
              paddingRight: "15px",
              paddingLeft: "15px",
              borderRadius: "5px",

              margin: "10px",
            }}
            className="button"
            // disabled={!verifiedReceiver}
            onClick={(e) => handleSaveClick(e, "0")}
          >
            <ArrowBendUpRight size={20} /> &nbsp;{isEditing && "Save &"} Forward
          </Button>

          <Button
            // type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{
              marginLeft: "350px",
              minwidth: "150px",
              width: "fit-content",
              paddingRight: "15px",
              paddingLeft: "15px",
              borderRadius: "5px",
              margin: "10px",
            }}
            className="button"
            onClick={(e) => handleSaveClick(e, "1")}
            // disabled={!verifiedReceiver}
          >
            <Prohibit color="red" size={20} />
            &nbsp; {isEditing && "SAVE &"} Reject
          </Button>

          <Button
            // type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{
              marginLeft: "350px",
              minwidth: "150px",
              width: "fit-content",
              paddingRight: "15px",
              paddingLeft: "15px",
              borderRadius: "5px",
              margin: "10px",
            }}
            className="button"
            // disabled={!verifiedReceiver}
            onClick={(e) => handleSaveClick(e, "2")}
          >
            <NavigationArrow size={20} /> &nbsp; {isEditing && "SAVE &"} Approve
          </Button>

          {!archive && (
            <Button
              // type="submit"
              rightIcon={<PaperPlaneRight size={20} />}
              style={{
                marginLeft: "350px",
                minwidth: "150px",
                width: "fit-content",
                paddingRight: "15px",
                paddingLeft: "15px",
                borderRadius: "5px",
                margin: "10px",
              }}
              className="button"
              onClick={(e) => handleSaveClick(e, "3")}
              // disabled={!verifiedReceiver}
            >
              <TrayArrowDown size={20} />
              &nbsp; {isEditing && "SAVE &"} Archive
            </Button>
          )}
          {archive && (
            <Button
              // type="submit"
              rightIcon={<PaperPlaneRight size={20} />}
              style={{
                marginLeft: "350px",
                minwidth: "150px",
                width: "fit-content",
                paddingRight: "15px",
                paddingLeft: "15px",
                borderRadius: "5px",
                margin: "10px",
              }}
              className="button"
              onClick={(e) => handleSaveClick(e, "4")}
              // disabled={!verifiedReceiver}
            >
              <UploadSimple size={20} />
              &nbsp; {isEditing && "SAVE &"} Unarchive
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default LTCFormView;
