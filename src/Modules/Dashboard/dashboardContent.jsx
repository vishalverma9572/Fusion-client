import { useEffect, useState, useRef } from "react";
import axios from "axios"; // Import axios
import Breadcrumbs from "../../components/Breadcrumbs";
import DashBoardNotifications from "./dashboardNotifications.jsx";
import { dashboardRoute } from "../../helper/api_routes.jsx";
import { Button, Flex, Tabs, Text } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import classes from "./Dashboard.module.css";
import { setRoles, setUserName, setAccessibleModules } from "../../redux/userslice.jsx";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const [notificationsList, setNotificationsList] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState(String(0));
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const response = await axios.get(dashboardRoute, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          if (response.status === 200) {
            const notificationsList = response.data.notifications;
            const name = response.data.name
            const designations = response.data.desgination_info;  // spelling is wrong in backend
            const accessibleModules = response.data.accessible_modules;
            dispatch(setUserName(name));
            dispatch(setRoles(designations));
            dispatch(setAccessibleModules(accessibleModules));
            setNotificationsList(notificationsList);

            // the flag field of data decides whether it is notification or announcement
            const filteredNotifications = notificationsList.filter(
              (item) =>
                !JSON.parse(item.data.replace(/'/g, '"'))?.flag ||
                JSON.parse(item.data.replace(/'/g, '"'))?.flag !==
                  "announcement"
            );
            const filteredAnnouncements = notificationsList.filter(
              (item) =>
                JSON.parse(item.data.replace(/'/g, '"'))?.flag ===
                "announcement"
            );

            setNotifications(filteredNotifications);
            setAnnouncements(filteredAnnouncements);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      } else {
        console.error("No authentication token found!");
      }
    };

    fetchDashboardData();
  }, []);

  const tabItems = [{ title: "Notifications" }, { title: "Announcements" }];

  const tabsListRef = useRef(null);
  const totalTabs = tabItems.length;

  const handlePrev = () => {
    if (activeTab === "0") return;
    setActiveTab(() => {
      const currentIndex = parseInt(activeTab);
      return String(currentIndex - 1);
    });
    scrollTabs("prev");
  };

  const handleNext = () => {
    if (activeTab === String(totalTabs - 1)) return;
    setActiveTab(() => {
      const currentIndex = parseInt(activeTab);
      return String(currentIndex + 1);
    });
    scrollTabs("next");
  };

  const scrollTabs = (direction) => {
    if (tabsListRef.current) {
      const scrollAmount = 50;
      if (direction === "next") {
        tabsListRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      } else {
        tabsListRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      <Breadcrumbs />
      <Flex
        justify="flex-start"
        align="center"
        gap={{ base: "0.5rem", md: "1rem" }}
        mt={{ base: "1rem", md: "1.5rem" }}
        ml={{ md: "lg" }}
      >
        <Button
          onClick={handlePrev}
          variant="default"
          p={0}
          style={{ border: "none" }}
        >
          <CaretCircleLeft
            className={classes.fusionCaretCircleIcon}
            weight="light"
          />
        </Button>

        <div className={classes.fusionTabsContainer} ref={tabsListRef}>
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
                  onClick={() => setActiveTab(`${index}`)}
                >
                  <Text>{item.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>

        <Button
          onClick={handleNext}
          variant="default"
          p={0}
          style={{ border: "none" }}
        >
          <CaretCircleRight
            className={classes.fusionCaretCircleIcon}
            weight="light"
          />
        </Button>
      </Flex>
      {notificationsList && (
        <DashBoardNotifications
          notificationsList={notifications}
          announcementsList={announcements}
          activeTab={activeTab}
        />
      )}
    </>
  );
};

export default Dashboard;
