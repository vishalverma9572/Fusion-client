// src/Modules/HR/components/CPDA_ClaimForm.js
import React, { useEffect, useState } from "react";
import { Button, Title } from "@mantine/core";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  get_my_details,
  search_employee,
  submit_cpda_claim_form,
  view_cpda_claim_form,
} from "../../../../routes/hr";
import LoadingComponent from "../../components/Loading";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import { EmptyTable } from "../../components/tables/EmptyTable";

const CPDA_ClaimFormView = () => {
  const { id } = useParams();
  const [fetchedformData, setfetchedformData] = useState(null);
  const [loading, setLoading] = useState(true);

  const exampleItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "CPDA Claim", path: "/hr/cpda_claim" },
    { title: "View Form", path: `/hr/cpda_claim/view/${id}` },
  ];

  useEffect(() => {
    const fetchfetchedformData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${view_cpda_claim_form}/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setfetchedformData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setLoading(false);
      }
    };

    fetchfetchedformData();
  }, [id]);

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
      <Title
        order={2}
        style={{ fontWeight: "500", marginTop: "40px", marginLeft: "15px" }}
      >
        CPDA Claim Form Details
      </Title>
      <div className="CPDA_ClaimForm_container">
        {/* add button to track status */}
        <Link
          to={`/hr/FormView/cpda_claim_track/${fetchedformData.file_id}`}
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
                  placeholder="Name"
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
                  value={fetchedformData.designation}
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
                  id="adjustmentSubmitted"
                  name="adjustmentSubmitted"
                  placeholder="Amount Required"
                  value={fetchedformData.adjustmentSubmitted}
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
                  id="submissionDate"
                  name="submissionDate"
                  value={fetchedformData.submissionDate}
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
                  id="advanceTaken"
                  name="advanceTaken"
                  placeholder="Amount Required"
                  value={fetchedformData.advanceTaken}
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
                  id="pfNo"
                  name="pfNo"
                  placeholder="XXXXXXXXXXXX"
                  value={fetchedformData.pfNo}
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
                  value={fetchedformData.purpose}
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
                  id="amountCheckedInPDA"
                  name="amountCheckedInPDA"
                  placeholder="Audit Entry"
                  value={fetchedformData.amountCheckedInPDA}
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
                <CurrencyDollar size={20} />
                <input
                  type="number"
                  id="balanceAvailable"
                  name="balanceAvailable"
                  placeholder="Enter balanceAvailable"
                  value={fetchedformData.balanceAvailable}
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
                  id="advanceAmountPDA"
                  name="advanceAmountPDA"
                  placeholder="advanceAmountPDA"
                  value={fetchedformData.advanceAmountPDA}
                  className="input"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CPDA_ClaimFormView;
