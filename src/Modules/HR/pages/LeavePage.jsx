import React, { useEffect, useState, useRef } from "react";
import {
  Tabs,
  Button,
  Flex,
  Text,
  Loader,
  Container,
  Grid,
} from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import CustomBreadcrumbs from "../../../components/Breadcrumbs"; // Import your breadcrumbs component here
import classes from "./LeavePage.module.css"; // Add your styles here
import LeaveForm from "./LeavePageComp/LeaveForm";
import LeaveArchive from "./LeavePageComp/LeaveArchive";
import LeaveInbox from "./LeavePageComp/LeaveInbox";
import LeaveRequests from "./LeavePageComp/LeaveRequests";

const tabItems = [
  { title: "Leave Form" },
  { title: "Leave Requests" },
  { title: "Leave Inbox" },
  { title: "Leave Archive" },
];

function Leave() {
  const [activeTab, setActiveTab] = useState("0");
  const [loading, setLoading] = useState(false);
  const tabsListRef = useRef(null);
  //url =/hr/leave/leaveform
  const url = window.location.href;
  console.log(url);
  useEffect(() => {
    //url =/hr/leave/leaveform
    if (url.includes("form")) {
      setActiveTab("0");
    }
    //url =/hr/leave/leaverequests
    else if (url.includes("requests")) {
      setActiveTab("1");
    }
    //url =/hr/leave/leaveinbox
    else if (url.includes("inbox")) {
      setActiveTab("2");
    }
    //url =/hr/leave/leavearchive
    else if (url.includes("archive")) {
      setActiveTab("3");
    }
  }, [url]);

  // Function to handle tab change
  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  // Fetch any necessary leave data
  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      try {
        // Fetch leave data here if needed
      } catch (error) {
        console.error("Error fetching leave data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveData();
  }, []);

  return (
    <>
      <CustomBreadcrumbs
        items={[
          { title: "Home", href: "/" },
          { title: "Leave Management", href: "/leave" },
        ]}
      />
      <Flex justify="flex-start" align="center" mt="lg">
        <Button
          style={{ marginRight: "20px" }}
          onClick={() => handleTabChange("prev")}
          variant="default"
          p={0}
        >
          <CaretCircleLeft
            className={classes.fusionCaretCircleIcon}
            weight="light"
          />
        </Button>
        <div
          className={`${classes.fusionTabsContainer} ${classes.limitedWidthTabs}`}
          ref={tabsListRef}
        >
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
              {tabItems.map((item, index) => (
                <Tabs.Tab
                  value={`${index}`}
                  key={index}
                  className={
                    activeTab === `${index}`
                      ? classes.fusionActiveRecentTab
                      : ""
                  }
                >
                  <Text>{item.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>
        <Button
          style={{ marginLeft: "220px" }}
          onClick={() => handleTabChange("next")}
          variant="default"
          p={0}
        >
          <CaretCircleRight
            className={classes.fusionCaretCircleIcon}
            weight="light"
          />
        </Button>
      </Flex>
      {loading ? (
        <Container py="xl">
          <Loader size="lg" />
        </Container>
      ) : (
        <div className="fullWidthGrid">
          {activeTab === "0" && <LeaveForm />}
          {activeTab === "1" && <LeaveRequests />}
          {activeTab === "2" && <LeaveInbox />}
          {activeTab === "3" && <LeaveArchive />}
        </div>
      )}
    </>
  );
}

export default Leave;
