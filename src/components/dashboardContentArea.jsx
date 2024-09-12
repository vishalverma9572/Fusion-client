import { Badge, Breadcrumbs, Button, Divider, Flex, Grid, Paper, Text } from "@mantine/core";
import { Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const options = [
  {
    title: "Course Update",
    badgeText: "Academics",
    date: "2024-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Cisco hiring",
    badgeText: "Academics -> Placement Cell",
    date: "2023-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Updated timings",
    badgeText: "Sports -> Badminton",
    date: "2022-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Footloose",
    badgeText: "Cultural -> Aavartan",
    date: "2021-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Lab is postponed",
    badgeText: "Academics",
    date: "2020-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Academic calender",
    badgeText: "Academics",
    date: "2019-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
];

const categories = [
  { title: "Tags" },
  { title: "Date" },
  { title: "Title" },
];

const DashboardContentArea = () => {
  const [notifications,setNotifications] = useState([]);
  const [sortedBy, setSortedBy] = useState("");

  useEffect(() => {
    setNotifications(options);
    sortBy(categories[0].title);
  }, []);

  const sortBy = (category) => {
    if (category === "Tags") {
      // Notifications will be sorted lexographically based on tags
      setNotifications([...options].sort((a, b) => a.badgeText.localeCompare(b.badgeText)));
    } else if (category === "Date") {
      // Latest notification will be shown first
      setNotifications([...options].sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else if (category === "Title") {
      // Notifications will be sorted lexographically based on title
      setNotifications([...options].sort((a, b) => a.title.localeCompare(b.title)));
    }
  }

  const handleSort = (e) => {
    const category = e.target.innerText;
    if(sortedBy!=category) {
      sortBy(category);
      setSortedBy(category);
    }
    // (TODO) Need to implement for multiple sorting filters
  }

  return (
    <>
      <Flex align="center" mt="md" rowGap={"1rem"} columnGap={"4rem"} ml={{md: "lg"}} wrap={"wrap"}>
        <Flex align="center" gap="0.5rem">
          <Text fw={600} size="1.5rem">
            Notfications
          </Text>
          <Badge color="red" size="lg" px={6}>
            {notifications.length}
          </Badge>
        </Flex>
        <Flex>
          <Breadcrumbs separator="|" separatorMargin="md">
            <Text> Sort by </Text>
            {categories.map((item, index) => 
              <Button key={index} onClick={handleSort}
                variant={sortedBy.includes(item.title) ? "light" : "transparent"}
                >
                {item.title}
              </Button>
            )}
          </Breadcrumbs>
        </Flex>
      </Flex>

      <Grid mt="xl">
        {notifications.map((option, index) => {
            return (
                <Grid.Col span={{base:12,md:6}} key={index}>
                <Paper
                    shadow="lg"
                    ml={{md: "lg"}}
                    radius="md"
                    px="lg"
                    pt="sm"
                    pb="xl"
                    style={{ borderLeft: [3, 4].includes(index) ? "0.6rem solid #A2A6AB" : "0.6rem solid #15ABFF" }}
                >
                    <Flex justify="space-between">
                    <Flex>
                        <Flex direction="column" align="flex-start">
                        <Text fw={600} size="1.2rem" mb="0.4rem">
                            {option.title}
                        </Text>
                        <Text c="#6B6B6B" size="0.7rem">
                            {option.date}
                        </Text>
                        <Divider my="sm" w="10rem" />
                        </Flex>
                        <Badge color={[3, 4].includes(index) ? "#A2A6AB" : "#15ABFF"}>{option.badgeText}</Badge>
                    </Flex>
                    <Trash size={28} weight="bold" />
                    </Flex>
                    <Text>{option.description}</Text>
                </Paper>
                </Grid.Col>
            );
        })}
        {/* <Grid.Col span={6}>
          <Paper
            shadow="lg"
            ml="lg"
            radius="md"
            px="lg"
            pt="sm"
            pb="xl"
            style={{ borderLeft: "0.6rem solid #15ABFF" }}
          >
            <Flex justify="space-between">
              <Flex>
                <Flex direction="column" align="flex-start">
                  <Text fw={600} size="1.2rem" mb="0.4rem">
                    Course Update
                  </Text>
                  <Text c="#6B6B6B" size="0.7rem">
                    2023-10-03
                  </Text>
                  <Divider my="sm" w="10rem" />
                </Flex>
                <Badge color="#15ABFF">Academics</Badge>
              </Flex>
              <Trash size={28} weight="bold" />
            </Flex>
            <Text>
              The syllabus for Data Structures has been updated. Please review
              the changes before next class. The syllabus for Data Structures
              has been updated. Please review the changes before next Structures
              has been updated. Please review the changes before next classThe
              syllabus for Data Structures has been updated. Please review the
              changes before next class.
            </Text>
          </Paper>
        </Grid.Col> */}
      </Grid>
    </>
  );
};

export default DashboardContentArea;
