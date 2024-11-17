import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ClipboardText,
  Buildings,
  User,
  FilePlus,
} from "@phosphor-icons/react";
import HrBreadcrumbs from "../components/HrBreadcrumbs";
import classes from "./Hr_Dashboard.module.css";
import LeaveForm from "./LeavePageComp/LeaveForm"; // Import LeaveForm

const navItems = [
  {
    title: "Leave Management",
    description: "Manage and apply for leaves effortlessly.",
    icon: Briefcase,
    link: "/hr/leave", // Link to Leave Management
  },
  {
    title: "CPDA Advance",
    description: "Handle CPDA advance requests with ease.",
    icon: ClipboardText,
    link: "/hr/cpda_adv",
  },
  {
    title: "LTC",
    description: "Manage LTC claims and requests seamlessly.",
    icon: Buildings,
    link: "/hr/ltc",
  },
  {
    title: "CPDA Claim",
    description: "Submit and track CPDA claims.",
    icon: FilePlus,
    link: "/hr/cpda_claim",
  },
  {
    title: "Appraisal",
    description: "Performance appraisal management.",
    icon: User,
    link: "/hr/appraisal",
  },
];

const exampleItems = [
  { title: "Home", path: "/dashboard" },
  { title: "Human Resources", path: "/hr" },
];

const Hr_Dashboard = () => {
  return (
    <div className={classes.hrdashboardContainer}>
      <HrBreadcrumbs items={exampleItems} />

      {/* Main Navbar */}
      <div className={classes.navbar}>
        <div className={classes.navLinks}>
          {navItems.map((item) => (
            <Link key={item.title} to={item.link} className={classes.navLink}>
              <item.icon size={20} className={classes.navIcon} />
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      {/* LeaveForm Section with Heading */}
      <div className={classes.leaveFormSection}>
        <h2 className={classes.leaveFormHeading}>Apply for Leave</h2>{" "}
        {/* Added heading */}
        <LeaveForm /> {/* This will show the LeaveForm below the navbar */}
      </div>
    </div>
  );
};

export default Hr_Dashboard;
