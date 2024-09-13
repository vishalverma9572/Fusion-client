import { Badge, Divider, Flex, Grid, Paper, Select, Text } from "@mantine/core";
import { Funnel, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";

const options = [
  {
    title: "Course Update",
    badgeText: "Academics",
    date: "2024-10-03",
    description:
      "The syllabus for the Data Structures course has been thoroughly revised to better align with the latest industry standards and academic requirements. Please make sure to review all the updates, especially the newly added chapters on advanced algorithms. It is crucial to be familiar with these changes before the next class, as they will be essential for upcoming assignments and exams.",
  },
  {
    title: "Cisco Hiring",
    badgeText: "Academics -> Placement Cell",
    date: "2023-10-03",
    description:
      "Cisco is launching its recruitment drive for various technical and non-technical roles. This is a fantastic opportunity for final-year students to secure placements with a leading tech company. Eligible candidates must register through the placement portal by the end of this week. The placement cell will also hold a pre-placement talk to provide insights into the hiring process, company culture, and role expectations. Don't miss out!",
  },
  {
    title: "Updated Timings",
    badgeText: "Sports -> Badminton",
    date: "2022-10-03",
    description:
      "Attention all badminton enthusiasts! The practice sessions have been rescheduled to accommodate more players and improve training quality. The new timings are from 5:00 PM to 7:00 PM every Monday, Wednesday, and Friday at the indoor stadium. Please mark your calendars accordingly and ensure timely attendance. For any queries or to confirm your slot, reach out to the sports coordinator.",
  },
  {
    title: "Footloose",
    badgeText: "Cultural -> Aavartan",
    date: "2021-10-03",
    description:
      "Get ready for Footloose, the most exciting dance competition of the year, happening at the Aavartan cultural fest! Whether you're into classical, contemporary, hip-hop, or freestyle, this is your chance to shine on stage. Registrations are now open for solo, duet, and group performances. The event will feature celebrity judges and fantastic prizes. Make sure your team is registered before the deadline and start preparing your best moves!",
  },
  {
    title: "Lab is Postponed",
    badgeText: "Academics",
    date: "2020-10-03",
    description:
      "Due to unforeseen maintenance work in the laboratory, the scheduled Physics lab session for tomorrow has been postponed until further notice. We understand this may cause inconvenience, but safety is our top priority. The new lab schedule will be communicated soon via email and the academic portal. Please stay tuned for updates and continue to review the relevant materials in the meantime.",
  },
  {
    title: "Academic Calendar",
    badgeText: "Academics",
    date: "2019-10-03",
    description:
      "The official academic calendar for the next semester has been released and includes all the important dates such as exam schedules, holidays, and key academic events. It's essential to familiarize yourself with these dates to plan your studies and extracurricular activities effectively. You can download the calendar from the college website or pick up a printed copy from the administration office. Make sure to stay updated with any changes that may occur during the semester.",
  },
];

const categories = [
  { title: "Most Recent" },
  { title: "Tags" },
  { title: "Title" },
];

const DashboardNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [sortedBy, setSortedBy] = useState("");

  useEffect(() => {
    setNotifications(options);
    sortBy(sortedBy);
  }, [sortedBy]);

  const sortBy = (category) => {
    if (category === "Tags") {
      setNotifications(
        [...options].sort((a, b) => a.badgeText.localeCompare(b.badgeText))
      );
    } else if (category === "Most Recent") {
      setNotifications(
        [...options].sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } else if (category === "Title") {
      setNotifications(
        [...options].sort((a, b) => a.title.localeCompare(b.title))
      );
    }
  };

  const handleSortChange = (value) => {
    setSortedBy(value);
  };

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
              Notifications
            </Text>
            <Badge color="red" size="sm" p={6}>
              {notifications.length}
            </Badge>
          </Flex>
          <Flex align="center" gap="0.5rem">
            <Select
              classNames={{ option: classes.selectoptions, input: classes. selectinputs  }}
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
        {notifications.map((option, index) => {
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
                        {option.title}
                      </Text>
                      <Badge color="#15ABFF">{option.badgeText}</Badge>
                    </Flex>

                    <Text c="#6B6B6B" size="0.7rem">
                      {option.date}
                    </Text>
                    <Divider my="sm" w="10rem" />
                  </Flex>

                  <Trash size={28} weight="bold" />
                </Flex>
                <Text>{option.description}</Text>
              </Paper>
            </Grid.Col>
          );
        })}
      </Grid>
    </>
  );
};

export default DashboardNotifications;
