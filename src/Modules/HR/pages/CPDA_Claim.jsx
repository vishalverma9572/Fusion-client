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
import classes from "./CPDA_ClaimPage.module.css";
import CPDA_ClaimForm from "./CPDA_ClaimPageComp/CPDA_ClaimForm";
import CPDA_ClaimRequests from "./CPDA_ClaimPageComp/CPDA_ClaimRequests";
import CPDA_ClaimInbox from "./CPDA_ClaimPageComp/CPDA_ClaimInbox";
import CPDA_ClaimArchive from "./CPDA_ClaimPageComp/CPDA_ClaimArchive";

const tabItems = [
  { title: "CPDA claim Form" },
  { title: "CPDA claim Requests" },
  { title: "CPDA claim Inbox" },
  { title: "CPDA claim Archive" },
];

function CPDA_Claim() {
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
    const fetchCPDA_ClaimData = async () => {
      setLoading(true);
      try {
        // Fetch CPDA_Claim data here if needed
      } catch (error) {
        console.error("Error fetching CPDA_Claim data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCPDA_ClaimData();
  }, []);

  return (
    <>
      <CustomBreadcrumbs
        items={[
          { title: "Home", href: "/" },
          { title: "CPDA_Claim Management", href: "/CPDA_Claim" },
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
          style={{ marginLeft: "385px" }}
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
          {activeTab === "0" && <CPDA_ClaimForm />}
          {activeTab === "1" && <CPDA_ClaimRequests />}
          {activeTab === "2" && <CPDA_ClaimInbox />}
          {activeTab === "3" && <CPDA_ClaimArchive />}
        </div>
      )}
    </>
  );
}

export default CPDA_Claim;
