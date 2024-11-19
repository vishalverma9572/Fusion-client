import React from "react";
import { useEffect, useState } from "react";
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
  UserList,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import {
  search_employee,
  get_my_details,
  submit_leave_form,
} from "../../../../routes/hr";
import "./LeaveForm.css";
import { useNavigate } from "react-router-dom";

const LeaveForm = () => {
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();
  const [verifiedReceiver, setVerifiedReceiver] = useState(false);
  const navigate = useNavigate();
    // Fetch leave types and available counts
   useEffect(() => {
    axios
      .get("/api/leave-types/") // Replace with your backend endpoint
      .then((response) => {
        const data = response.data.map((item) => ({
          leavetype: item.leavetype,
          availableCount: item.availableCount,
          startDate: "",
          endDate: "",
          duration: 0,
        }));
        setLeaveData(data);
        setFormValues(data);
      })
      .catch((error) => console.error("Error fetching leave types:", error));
  }, []);

  // Fetch user details
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

  const handleCheck = async () => {
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

  const handleSelectChange = (value) => {
    dispatch(updateForm({ name: "natureOfLeave", value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!verifiedReceiver) {
      alert("Please verify the receiver before submitting the form.");
      return;
    }

    const submission = {
      ...formData,
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await fetch(submit_leave_form, {
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
      navigate("/hr/leave/leaverequests");
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <div className="Leave_container">
      <form onSubmit={handleSubmit}>
        {/* Section 1: Name and Designation */}
        <div className="grid-row two-columns">
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
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="input"
                required
                disabled
              />
            </div>
          </div>
        </div>

        {/* Section 2: Department, PF Number, Application Date */}
        <div className="grid-row three-columns">
          <div className="grid-col">
            <label className="input-label" htmlFor="departmentInfo">
              Department
            </label>
            <div className="input-wrapper">
              <Building size={20} />
              <input
                type="text"
                id="departmentInfo"
                name="departmentInfo"
                placeholder="Department Name"
                value={formData.departmentInfo}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="pfNo">
              PF Number
            </label>
            <div className="input-wrapper">
              <IdentificationCard size={20} />
              <input
                type="number"
                id="pfNo"
                name="pfNo"
                placeholder="XXXXXXXXXXXX"
                value={formData.pfNo}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="submissionDate">
              Application Date
            </label>
            <div className="input-wrapper center">
              <Calendar size={20} />
              <input
                type="date"
                id="submissionDate"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleChange}
                className="input center"
                required
              />
            </div>
          </div>
        </div>
        <div className="grid-row">
          
          {/* leave type info */}
  <Text size="xl" weight={700} mb="md">
    Nature of Leave
  </Text>
  {formData.natureOfLeave.map((item, index) => (
    <Group key={index} mb="md" spacing="xl" className={`leave-group ${index % 2 === 0 ? 'even' : 'odd'}`}>
      <div className="leave-type-container">
        <Text size="md" weight={600}>{item.leavetype}</Text>
        <Text size="sm">Available: {item.availableCount}</Text>

        <DatePicker
          placeholder="Start Date"
          label="Leave Start Date"
          value={item.startDate}
          onChange={(date) => handleChange(index, "startDate", date)}
        />
        <DatePicker
          placeholder="End Date"
          label="Leave End Date"
          value={item.endDate}
          onChange={(date) => handleChange(index, "endDate", date)}
        />
        <NumberInput
          placeholder="Duration"
          label="Duration (Days)"
          value={item.duration}
          onChange={(value) => handleChange(index, "duration", value)}
        />
      </div>

      {/* Add second leave type entry for the next column */}
      {formValues.natureOfLeave[index + 1] && (
        <div className="leave-type-container">
          <Text size="md" weight={600}>{formValues.natureOfLeave[index + 1].leavetype}</Text>
          <Text size="sm">Available: {formValues.natureOfLeave[index + 1].availableCount}</Text>

          <DatePicker
            placeholder="Start Date"
            label="Leave Start Date"
            value={formData.natureOfLeave[index + 1].startDate}
            onChange={(date) => handleChange(index + 1, "startDate", date)}
          />
          <DatePicker
            placeholder="End Date"
            label="Leave End Date"
            value={formData.natureOfLeave[index + 1].endDate}
            onChange={(date) => handleChange(index + 1, "endDate", date)}
          />
          <NumberInput
            placeholder="Duration"
            label="Duration (Days)"
            value={formData.natureOfLeave[index + 1].duration}
            onChange={(value) => handleChange(index + 1, "duration", value)}
          />
        </div>
      )}
    </Group>
  ))}
</div>
        
          {/* <div className="grid-col">
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
          </div> */}
    {/* station leave - yes/no , start date, end date , leave start date end date */}
          <div className="grid-row">
            <div className ="grid-col">

            </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="leaveStartDate">
              Leave Start Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="leaveStartDate"
                name="leaveStartDate"
                value={formData.leaveStartDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
          
          <div className="grid-col">
            <label className="input-label" htmlFor="leaveEndDate">
              Leave End Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="leaveEndDate"
                name="leaveEndDate"
                value={formData.leaveEndDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
       
</div>
        {/* Section 4: Purpose of Leave */}
        <div className="grid-row">
          <div className="purpose">
            <label className="input-label" htmlFor="purposeOfLeave">
              Purpose
            </label>
            <div className="input-wrapper">
              <ClipboardText size={20} />
              <input
                type="text"
                id="purposeOfLeave"
                name="purposeOfLeave"
                placeholder="purpose Of Leave"
                value={formData.purposeOfLeave}
                onChange={handleChange}
                className="input"
                aria-rowcount={2}
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="addressDuringLeave">
              Adress during Leave
            </label>
            <div className="input-wrapper">
              <UserList size={20} />
              <input
                type="text"
                id="addressDuringLeave"
                name="addressDuringLeave"
                placeholder="Full Address"
                value={formData.addressDuringLeave}
                onChange={handleChange}
                className="input"
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
              htmlFor="addministrativeResponsibiltyAssigned"
            >
              Administrative Responsibility
            </label>
            <div className="input-wrapper">
              <Tag size={20} />
              <input
                type="text"
                id="addministrativeResponsibiltyAssigned"
                name="addministrativeResponsibiltyAssigned"
                placeholder="Enter the name"
                value={formData.addministrativeResponsibiltyAssigned}
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
            lefticon={<CheckCircle size={25} />}
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
            // disabled={!verifiedReceiver}
          >
            <PaperPlaneRight size={20} /> &nbsp; Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
