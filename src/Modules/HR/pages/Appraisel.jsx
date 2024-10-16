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
import CustomBreadcrumbs from "../../../components/Breadcrumbs";
import classes from "./AppraisalPage.module.css";
import AppraisalForm from "./AppraisalPageComp/AppraisalForm";
import AppraisalRequests from "./AppraisalPageComp/AppraisalRequests";
import AppraisalInbox from "./AppraisalPageComp/AppraisalInbox";
import AppraisalArchive from "./AppraisalPageComp/AppraisalArchive";

const tabItems = [
  { title: "Appraisal Form" },
  { title: "Appraisal Requests" },
  { title: "Appraisal Inbox" },
  { title: "Appraisal Archive" },
];

function Appraisal() {
  const [activeTab, setActiveTab] = useState("0");
  const [loading, setLoading] = useState(false);
  const tabsListRef = useRef(null);

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

  useEffect(() => {
    const fetchAppraisalData = async () => {
      setLoading(true);
      try {
        // Fetch Appraisal data here if needed
      } catch (error) {
        console.error("Error fetching Appraisal data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppraisalData();
  }, []);

  return (
    <>
      <CustomBreadcrumbs
        items={[
          { title: "Home", href: "/" },
          { title: "Appraisal Management", href: "/Appraisal" },
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
          style={{ marginLeft: "320px" }}
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
          {activeTab === "0" && <AppraisalForm />}
          {activeTab === "1" && <AppraisalRequests />}
          {activeTab === "2" && <AppraisalInbox />}
          {activeTab === "3" && <AppraisalArchive />}
        </div>
      )}
    </>
  );
}

export default Appraisal;
