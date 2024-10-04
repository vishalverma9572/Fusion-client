import axios from "axios";
import PropTypes from "prop-types";
import { Funnel } from "@phosphor-icons/react";
import { useEffect, useMemo, useState, useRef } from "react";
import classes from "./Dashboard.module.css";
import { notificationReadRoute, dashboardRoute } from "../../helper/api_routes";
import { Empty } from "../../components/empty";
import { Tabs } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import CustomBreadcrumbs from "../../components/Breadcrumbs.jsx";
import {
  setRoles,
  setUserName,
  setAccessibleModules,
} from "../../redux/userslice.jsx";
import { useDispatch } from "react-redux";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Paper,
  Select,
  Text,
  CloseButton,
} from "@mantine/core";

const categories = ["Most Recent", "Tags", "Title"];

const NotificationItem = ({ notification, markAsRead }) => {
  const { module } = JSON.parse(notification.data.replace(/'/g, '"') || "{}");
  return (
    <Grid.Col span={12} key={notification.id}>
      <Paper
        radius="md"
        px="lg"
        pt="sm"
        pb="xl"
        style={{ borderLeft: "0.6rem solid #15ABFF" }}
        withBorder
        maw="1240px"
      >
        <Flex justify="space-between">
          <Flex direction="column">
            <Flex gap="md">
              <Text fw={600} size="1.2rem" mb="0.4rem">
                {notification.verb}
              </Text>
              <Badge color="#15ABFF">{module || "N/A"}</Badge>
            </Flex>
            <Text c="#6B6B6B" size="0.7rem">
              {new Date(notification.timestamp).toLocaleDateString()}
            </Text>
            <Divider my="sm" w="10rem" />
          </Flex>
          <CloseButton variant="transparent" style={{ cursor: "pointer" }} />
        </Flex>
        <Flex justify="space-between">
          <Text>{notification.description || "No description available."}</Text>
          <Button
            variant="filled"
            color={notification.unread ? "blue" : "gray"}
            onClick={() => markAsRead(notification.id)}
            style={{ cursor: "pointer" }}
          >
            {notification.unread ? "Mark as read" : "Unread"}
          </Button>
        </Flex>
      </Paper>
    </Grid.Col>
  );
};

const Dashboard = () => {
  const [notificationsList, setNotificationsList] = useState([]);
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [activeTab, setActiveTab] = useState("0");
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const dispatch = useDispatch();
  const tabsListRef = useRef(null);
  const tabItems = [{ title: "Notifications" }, { title: "Announcements" }];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");

      try {
        const { data } = await axios.get(dashboardRoute, {
          headers: { Authorization: `Token ${token}` },
        });
        const { notifications, name, desgination_info, accessible_modules } =
          data;

        dispatch(setUserName(name));
        dispatch(setRoles(desgination_info));
        dispatch(setAccessibleModules(accessible_modules));

        const notificationsData = notifications.map((item) => ({
          ...item,
          parsedData: JSON.parse(item.data.replace(/'/g, '"')),
        }));

        setNotificationsList(
          notificationsData.filter(
            (item) => item.parsedData?.flag !== "announcement"
          )
        );
        setAnnouncementsList(
          notificationsData.filter(
            (item) => item.parsedData?.flag === "announcement"
          )
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

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

  const notificationsToDisplay =
    activeTab === "1" ? announcementsList : notificationsList;

  const sortedNotifications = useMemo(() => {
    const sortMap = {
      "Most Recent": (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      Tags: (a, b) => a.module.localeCompare(b.module),
      Title: (a, b) => a.verb.localeCompare(b.verb),
    };
    return [...notificationsToDisplay].sort(sortMap[sortedBy]);
  }, [sortedBy, notificationsToDisplay]);

  const markAsRead = async (notifId) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        notificationReadRoute,
        { id: notifId },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (response.status === 200) {
        setNotificationsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: false } : notif
          )
        );
        setAnnouncementsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: false } : notif
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <Flex
        justify="flex-start"
        align="center"
        gap={{ base: "0.5rem", md: "1rem" }}
        mt={{ base: "1rem", md: "1.5rem" }}
        ml={{ md: "lg" }}
      >
        <Button
          onClick={() => handleTabChange("prev")}
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
                >
                  <Text>{item.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>

        <Button
          onClick={() => handleTabChange("next")}
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

      <Flex align="center" mt="md" rowGap="1rem" columnGap="4rem" wrap="wrap">
        <Flex w="100%" justify="space-between">
          <Flex align="center" gap="0.5rem">
            <Text fw={600} size="1.5rem">
              {activeTab === "1" ? "Announcements" : "Notifications"}
            </Text>
            <Badge color="red" size="sm" p={6}>
              {notificationsToDisplay.filter((n) => n.unread).length}
            </Badge>
          </Flex>
          <Select
            classNames={{
              option: classes.selectoptions,
              input: classes.selectinputs,
            }}
            variant="filled"
            leftSection={<Funnel />}
            data={categories}
            value={sortedBy}
            onChange={setSortedBy}
            placeholder="Sort By"
          />
        </Flex>
      </Flex>

      <Grid mt="xl">
        {sortedNotifications.length === 0 ? (
          <Empty />
        ) : (
          sortedNotifications.map((notification) => (
            <NotificationItem
              notification={notification}
              key={notification.id}
              markAsRead={markAsRead}
            />
          ))
        )}
      </Grid>
    </>
  );
};

export default Dashboard;

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    verb: PropTypes.string.isRequired,
    description: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired, // Assuming data is a string
    parsedData: PropTypes.shape({
      module: PropTypes.string,
      flag: PropTypes.string,
    }),
    unread: PropTypes.bool.isRequired,
  }).isRequired,
  markAsRead: PropTypes.func.isRequired,
};
