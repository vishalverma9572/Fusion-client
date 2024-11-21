import React, { useEffect, useState, useRef } from "react";
import { Tabs, Button, Flex, Text, Loader, Container } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";

import classes from "./LTCPage.module.css";
import LTCForm from "./LTCPageComp/LTCForm";
import LTCRequests from "./LTCPageComp/LTCRequests";
import LTCInbox from "./LTCPageComp/LTCInbox";
import LTCArchive from "./LTCPageComp/LTCArchive";
import HrBreadcrumbs from "../components/HrBreadcrumbs";

// Define paths for each tab
const tabItems = [
  { title: "LTC Form", path: "/hr/ltc/ltcform" },
  { title: "LTC Requests", path: "/hr/ltc/ltcrequests" },
  { title: "LTC Inbox", path: "/hr/ltc/ltcinbox" },
  { title: "LTC Archive", path: "/hr/ltc/ltcarchive" },
];

const sectionItems = [
  { title: "Leave Management", path: "/hr/leave/leaveform" },
  { title: "LTC", path: "/hr/ltc/ltcform" },
  { title: "CPDA Adavnce", path: "/hr/cpda_adv/adv_form" },
  { title: "CPDA Claim", path: "/hr/cpda_claim/cpdaform" },
  { title: "Appraisal", path: "/hr/appraisal/appraisal_form" },
];

function LTC() {
  const [activeTab, setActiveTab] = useState("0");
  const [loading, setLoading] = useState(false);
  const tabsListRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const exampleItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "LTC", path: "/hr/ltc" },
  ];

  // Update active tab based on current URL
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingTab = tabItems.findIndex((tab) =>
      currentPath.includes(tab.path.split("/").pop()),
    );
    setActiveTab(matchingTab !== -1 ? String(matchingTab) : "0");
  }, [location.pathname]);

  // Function to handle tab change by clicking on a tab
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

  // Fetch any necessary LTC data
  useEffect(() => {
    const fetchLTCData = async () => {
      setLoading(true);
      try {
        // Fetch LTC data here if needed
      } catch (error) {
        console.error("Error fetching LTC data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLTCData();
  }, []);

  return (
    <>
      <HrBreadcrumbs items={exampleItems} />

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
                  onClick={() => handleTabChange(String(index))}
                >
                  <Text>{item.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>
        <Button
          style={{ marginLeft: "150px" }}
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
      {loading ? (
        <Container py="xl">
          <Loader size="lg" />
        </Container>
      ) : (
        <div className="fullWidthGrid">
          {activeTab === "0" && <LTCForm />}
          {activeTab === "1" && <LTCRequests />}
          {activeTab === "2" && <LTCInbox />}
          {activeTab === "3" && <LTCArchive />}
        </div>
      )}
    </>
  );
}

export default LTC;
