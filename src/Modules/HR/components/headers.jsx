import { useState } from "react";
import { Container, Tabs } from "@mantine/core";
import classes from "../styles/headers.module.css";

// Import components for each subtab
import LeaveFormComponent from "./leaveForm";
// import LeaveRequestComponent from './LeaveRequestComponent';
// import LeaveInboxComponent from './LeaveInboxComponent';
// import LeaveArchiveComponent from './LeaveArchiveComponent';

// import LTCFormComponent from './LTCFormComponent';
// import LTCRequestComponent from './LTCRequestComponent';
// import LTCInboxComponent from './LTCInboxComponent';
// import LTCArchiveComponent from './LTCArchiveComponent';

// import CPDAFormComponent from './CPDAFormComponent';
// import CPDARequestComponent from './CPDARequestComponent';
// import CPDAInboxComponent from './CPDAInboxComponent';
// import CPDAArchiveComponent from './CPDAArchiveComponent';

// import AppraisalFormComponent from './AppraisalFormComponent';
// import AppraisalRequestComponent from './AppraisalRequestComponent';
// import AppraisalInboxComponent from './AppraisalInboxComponent';
// import AppraisalArchiveComponent from './AppraisalArchiveComponent';

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
  const [activeSubTab, setActiveSubTab] = useState("");

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab} onClick={() => setActiveTab(tab)}>
      {tab}
    </Tabs.Tab>
  ));

  const subItems = subTabs[activeTab]?.map((item) => (
    <Tabs.Tab value={item} key={item} onClick={() => setActiveSubTab(item)}>
      {item}
    </Tabs.Tab>
  ));

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "Leave Form":
        return <LeaveFormComponent />;
      //   case "Leave Request":
      //     return <LeaveRequestComponent />;
      //   case "Leave Inbox":
      //     return <LeaveInboxComponent />;
      //   case "Leave Archive":
      //     return <LeaveArchiveComponent />;

      //   case "LTC Form":
      //     return <LTCFormComponent />;
      //   case "LTC Request":
      //     return <LTCRequestComponent />;
      //   case "LTC Inbox":
      //     return <LTCInboxComponent />;
      //   case "LTC Archive":
      //     return <LTCArchiveComponent />;

      //   case "CPDA Form":
      //     return <CPDAFormComponent />;
      //   case "CPDA Request":
      //     return <CPDARequestComponent />;
      //   case "CPDA Inbox":
      //     return <CPDAInboxComponent />;
      //   case "CPDA Archive":
      //     return <CPDAArchiveComponent />;

      //   case "Appraisal Form":
      //     return <AppraisalFormComponent />;
      //   case "Appraisal Request":
      //     return <AppraisalRequestComponent />;
      //   case "Appraisal Inbox":
      //     return <AppraisalInboxComponent />;
      //   case "Appraisal Archive":
      //     return <AppraisalArchiveComponent />;

      default:
        return <p>Select a subtab to view its content</p>;
    }
  };

  return (
    <div className={classes.header}>
      <Container size="md" style={{ marginLeft: 0 }}>
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

          <Tabs.List>{subItems}</Tabs.List>

          <div style={{ marginTop: "20px" }}>{renderSubTabContent()}</div>
        </Tabs>
      </Container>
    </div>
  );
}
