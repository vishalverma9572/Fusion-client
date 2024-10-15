import { useState } from "react";
import { Container, Tabs } from "@mantine/core";
import classes from "../styles/headers.module.css";
import { CaretRight } from "@phosphor-icons/react";
import "./headers.css";

// Import components for each subtab
import LeaveForm from "../pages/leaveForm";
import Form from "./FormComponent/Form";
import CpdaForm from "../pages/cpdaForm";
import CpdaArchive from "../pages/cpdaArchive";

const tabs = ["Leave", "LTC", "Appraisal", "CPDA"];
const subTabs = {
  Leave: ["Leave Form", "Leave Request", "Leave Inbox", "Leave Archive"],
  LTC: ["LTC Form", "LTC Request", "LTC Inbox", "LTC Archive"],
  CPDA: ["CPDA Form", "CPDA Request", "CPDA Inbox", "CPDA Archive"],
  Appraisal: [
    "Appraisal Form",
    "Appraisal Request",
    "Appraisal Inbox",
    "Appraisal Archive",
  ],
};

export function Header() {
  const [activeTab, setActiveTab] = useState("Leave");
  const [activeSubTab, setActiveSubTab] = useState("Leave Form");

  const items = tabs.map((tab) => (
    <Tabs.Tab
      value={tab}
      key={tab}
      className={activeTab === tab ? "active-tab" : ""}
      onClick={() => {
        setActiveTab(tab);
        setActiveSubTab(subTabs[tab][0]); // Default to the first subtab when switching main tabs
      }}
    >
      {tab}
    </Tabs.Tab>
  ));

  const subItems = subTabs[activeTab]?.map((item) => (
    <Tabs.Tab
      value={item}
      key={item}
      className={activeSubTab === item ? "active-tab" : ""}
      onClick={() => setActiveSubTab(item)}
    >
      {item}
    </Tabs.Tab>
  ));

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "Leave Form":
        return <LeaveForm />;
      case "Leave Request":
      case "Leave Inbox":
      case "Leave Archive":
        return <Form />;
      case "CPDA Form":
        return <CpdaForm />;
      case "CPDA Inbox":
        return <Form />;
      case "CPDA Archive":
        return <CpdaArchive />;
      default:
        return <p>Select a subtab to view its content!</p>;
    }
  };

  // Function to create dynamic breadcrumb
  const getBreadcrumb = () => {
    const base = "Human Resources";
    const iconStyle = { paddingTop: "3px", marginLeft: "3px" }; // Adjust the margin value as needed
    return (
      <span>
        {base}
        {activeTab && (
          <>
            <CaretRight size={20} style={iconStyle} /> {activeTab}
          </>
        )}

        {activeSubTab && (
          <>
            <CaretRight size={20} style={iconStyle} /> {activeSubTab}
          </>
        )}
      </span>
    );
  };

  return (
    <div className={`${classes.header} HR_header`}>
      <Container size="md" style={{ marginLeft: 0 }}>
        {/* Breadcrumb Section */}
        <div className="breadcrumb">{getBreadcrumb()}</div>
        <Tabs
          defaultValue={activeTab}
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>

          <br />
          <Tabs.List>{subItems}</Tabs.List>
          <div className="subtab_content" style={{ marginTop: "20px" }}>
            {renderSubTabContent()}
          </div>
        </Tabs>
      </Container>
    </div>
  );
}
