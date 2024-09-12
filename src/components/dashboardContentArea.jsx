import { Badge, Divider, Flex, Grid, Paper, Text } from "@mantine/core";
import { Trash } from "@phosphor-icons/react";

const options = [
  {
    title: "Course Update",
    badgeText: "Academics",
    date: "2023-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Course Update",
    badgeText: "Academics -> Placement Cell",
    date: "2023-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Course Update",
    badgeText: "Sports -> Badminton",
    date: "2023-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Course Update",
    badgeText: "Cultural -> Aavartan",
    date: "2023-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Course Update",
    badgeText: "Academics",
    date: "2023-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
  {
    title: "Course Update",
    badgeText: "Academics",
    date: "2023-10-03",
    description:
      "The syllabus for Data Structures has been updated. Please review the changes before next class. The syllabus for Data Structures has been updated. Please review the changes  before next  Structures has been updated. Please review the changes before next classThe syllabus for Data Structures has been updated. Please review the changes before next class.",
  },
];

const DashboardContentArea = () => {
  return (
    <>
      <Grid mt="xl">
        {options.map((option, index) => {
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
