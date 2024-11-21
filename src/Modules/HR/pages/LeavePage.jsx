import React, { useEffect, useState, useRef } from "react";
import { Tabs, Button, Flex, Text, Loader, Container } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";
import HrBreadcrumbs from "../components/HrBreadcrumbs";
import LeaveForm from "./LeavePageComp/LeaveForm";
import LeaveArchive from "./LeavePageComp/LeaveArchive";
import LeaveInbox from "./LeavePageComp/LeaveInbox";
import LeaveRequests from "./LeavePageComp/LeaveRequests";
import classes from "./LeavePage.module.css";

const tabItems = [
  { title: "Leave Form", path: "/hr/leave/leaveform" },
  { title: "Leave Requests", path: "/hr/leave/leaverequests" },
  { title: "Leave Inbox", path: "/hr/leave/leaveinbox" },
  { title: "Leave Archive", path: "/hr/leave/leavearchive" },
];

const sectionItems = [
  { title: "Leave Management", path: "/hr/leave/leaveform" },
  { title: "LTC", path: "/hr/ltc/ltcform" },
  { title: "CPDA Adavnce", path: "/hr/cpda_adv/adv_form" },
  { title: "CPDA Claim", path: "/hr/cpda_claim/cpdaform" },
  { title: "Appraisal", path: "/hr/appraisal/appraisal_form" },
];

function Leave() {
  const [activeTab, setActiveTab] = useState("0");
  const [loading, setLoading] = useState(false);
  const tabsListRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbsItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "Leave Management", path: "/hr/leave" },
  ];

  // Set active tab based on the current URL
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingTab = tabItems.findIndex((tab) =>
      currentPath.includes(tab.path.split("/").pop()),
    );
    setActiveTab(matchingTab !== -1 ? String(matchingTab) : "0");
  }, [location.pathname]);

  // Handle tab change
  const handleTabChange = (index) => {
    setActiveTab(index);
    navigate(tabItems[index].path);
  };

  const handleSectionNavigation = (path) => {
    navigate(path);
  };

  const handleButtonChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    handleTabChange(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Primary Breadcrumbs */}
      <HrBreadcrumbs items={breadcrumbsItems} />

      {/* Horizontal Navigation Bar */}
      <div className={classes.sectionTabsContainer}>
        {sectionItems.map((item, index) => (
          <div
            key={index}
            className={`${classes.sectionTab} ${
              location.pathname.includes(item.path.split("/")[2])
                ? classes.activeSectionTab
                : ""
            }`}
            onClick={() => handleSectionNavigation(item.path)}
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Flex justify="flex-start" align="center" mt="lg">
        <Button
          style={{ marginRight: "20px" }}
          onClick={() => handleButtonChange("prev")}
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
          <Tabs value={activeTab} onTabChange={handleTabChange}>
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
                  onClick={() => handleTabChange(String(index))}
                >
                  <Text>{item.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>
        <Button
          style={{ marginLeft: "220px" }}
          onClick={() => handleButtonChange("next")}
          variant="default"
          p={0}
        >
          <CaretCircleRight
            className={classes.fusionCaretCircleIcon}
            weight="light"
          />
        </Button>
      </Flex>

      {/* Content */}
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
