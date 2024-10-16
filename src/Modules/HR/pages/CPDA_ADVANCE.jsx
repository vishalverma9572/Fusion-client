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
import classes from "./CPDA_ADVANCEPage.module.css";
import Cpda_ADVANCEForm from "./CPDA_ADVANCEPageComp/Cpda_ADVANCEForm";
import Cpda_ADVANCERequests from "./CPDA_ADVANCEPageComp/Cpda_ADVANCERequests";
import Cpda_ADVANCEInbox from "./CPDA_ADVANCEPageComp/Cpda_ADVANCEInbox";
import Cpda_ADVANCEArchive from "./CPDA_ADVANCEPageComp/Cpda_ADVANCEArchive";

const tabItems = [
  { title: "CPDA Adv Form" },
  { title: "CPDA Adv Requests" },
  { title: "CPDA Adv Inbox" },
  { title: "CPDA Adv Archive" },
];

function CPDA_ADVANCE() {
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
    const fetchCpda_ADVANCEData = async () => {
      setLoading(true);
      try {
        // Fetch CPDA_ADVANCE data here if needed
      } catch (error) {
        console.error("Error fetching CPDA_ADVANCE data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCpda_ADVANCEData();
  }, []);

  return (
    <>
      <CustomBreadcrumbs
        items={[
          { title: "Home", href: "/" },
          { title: "CPDA_ADVANCE Management", href: "/cpda_advance" },
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
          style={{ marginLeft: "345px" }}
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
          {activeTab === "0" && <Cpda_ADVANCEForm />}
          {activeTab === "1" && <Cpda_ADVANCERequests />}
          {activeTab === "2" && <Cpda_ADVANCEInbox />}
          {activeTab === "3" && <Cpda_ADVANCEArchive />}
        </div>
      )}
    </>
  );
}

export default CPDA_ADVANCE;
