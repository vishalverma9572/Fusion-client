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
import classes from "./LTCPage.module.css";
import LTCForm from "./LTCPageComp/LTCForm";
import LTCRequests from "./LTCPageComp/LTCRequests";
import LTCInbox from "./LTCPageComp/LTCInbox";
import LTCArchive from "./LTCPageComp/LTCArchive";

const tabItems = [
  { title: "LTC Form" },
  { title: "LTC Requests" },
  { title: "LTC Inbox" },
  { title: "LTC Archive" },
];

function LTC() {
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
      <CustomBreadcrumbs
        items={[
          { title: "Home", href: "/" },
          { title: "LTC Management", href: "/LTC" },
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
          style={{ marginLeft: "150px" }}
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
