import PropTypes from "prop-types"; // Import PropTypes
import { Badge, Divider, Flex, Grid, Paper, Select, Text } from "@mantine/core";
import { Funnel, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";

const categories = [
  { title: "Most Recent" },
  { title: "Tags" },
  { title: "Title" },
];

const DashboardNotifications = ({
  notificationsList,
  announcementsList,
  activeTab,
}) => {
  const [sortedNotifications, setSortedNotifications] = useState([]);
  const [sortedBy, setSortedBy] = useState("Most Recent");

  //  Useeffect will run whenever `sortedBy` or `notificationsList` changes
  useEffect(() => {
    const notificationsToDisplay =
      activeTab === "1" ? announcementsList : notificationsList;
    sortBy(sortedBy, notificationsToDisplay);
  }, [sortedBy, notificationsList, announcementsList, activeTab]);

  const sortBy = (category, notificationsToSort) => {
    let sorted = [...notificationsToSort];

    if (category === "Tags") {
      sorted = sorted.sort((a, b) => a.module.localeCompare(b.module));
    } else if (category === "Most Recent") {
      sorted = sorted.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    } else if (category === "Title") {
      sorted = sorted.sort((a, b) => a.verb.localeCompare(b.verb));
    }

    setSortedNotifications(sorted);
  };

  const handleSortChange = (value) => {
    setSortedBy(value);
  };

  // Safely parse the `data` field if it's a string
  const parseNotificationData = (notification) => {
    if (typeof notification.data === "string") {
      try {
        return JSON.parse(notification.data.replace(/'/g, '"')); // Replace single quotes with double quotes for valid JSON
      } catch (error) {
        console.error("Error parsing notification data:", error);
        return {};
      }
    }
    return notification.data || {};
  };

  const notificationsToDisplay =
    activeTab === "1" ? announcementsList : notificationsList;

  return (
    <>
      <Flex
        align="center"
        mt="md"
        rowGap={"1rem"}
        columnGap={"4rem"}
        ml={{ md: "lg" }}
        wrap={"wrap"}
      >
        <Flex w="100%" justify="space-between">
          <Flex align="center" gap="0.5rem">
            <Text fw={600} size="1.5rem">
              {activeTab === "1" ? "Announcements" : "Notifications"}
            </Text>
            <Badge color="red" size="sm" p={6}>
              {notificationsToDisplay.length}
            </Badge>
          </Flex>
          <Flex align="center" gap="0.5rem">
            <Select
              classNames={{
                option: classes.selectoptions,
                input: classes.selectinputs,
              }}
              variant="filled"
              leftSectionPointerEvents="none"
              leftSection={<Funnel />}
              checkIconPosition="right"
              data={categories.map((cat) => cat.title)}
              value={sortedBy}
              onChange={handleSortChange}
              placeholder="Sort By"
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
              }}
            />
          </Flex>
        </Flex>
      </Flex>

      <Grid mt="xl">
        {sortedNotifications.length == 0 ? (
          <>
            <Text pl={28}>No new notification found</Text>
          </>
        ) : (
          sortedNotifications.map((notification, index) => {
            const notificationData = parseNotificationData(notification); // Parse the notification's `data` field

            return (
              <Grid.Col span={{ base: 12 }} key={index}>
                <Paper
                  ml={{ md: "lg" }}
                  radius="md"
                  px="lg"
                  pt="sm"
                  pb="xl"
                  style={{ borderLeft: "0.6rem solid #15ABFF" }}
                  withBorder
                  maw="1240px"
                >
                  <Flex justify="space-between">
                    <Flex direction="column" align="flex-start">
                      <Flex gap="md">
                        <Text fw={600} size="1.2rem" mb="0.4rem">
                          {notification.verb}
                        </Text>
                        <Badge color="#15ABFF">
                          {notificationData.module || "N/A"}
                        </Badge>
                      </Flex>

                      <Text c="#6B6B6B" size="0.7rem">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </Text>
                      <Divider my="sm" w="10rem" />
                    </Flex>

                    <Trash size={28} weight="bold" />
                  </Flex>
                  <Text>
                    {notification.description || "No description available."}
                  </Text>
                </Paper>
              </Grid.Col>
            );
          })
        )}
      </Grid>
    </>
  );
};

DashboardNotifications.propTypes = {
  notificationsList: PropTypes.arrayOf(
    PropTypes.shape({
      verb: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    })
  ).isRequired,
  announcementsList: PropTypes.arrayOf(
    PropTypes.shape({
      verb: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default DashboardNotifications;
