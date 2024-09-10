import { Breadcrumbs, Button, Flex, Text } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";

const items = [
  { title: "Recent" },
  { title: "Announcements" },
  { title: "Notifications" },
  { title: "Events" },
].map((item, index) => (
  <Text
    key={index}
    size=""
    fw={item.title === "Notifications" ? 600 : ""}
    fs="light"
  >
    {item.title}
  </Text>
));

const RecentTabs = () => {
  return (
    <>
      <Flex align="center" gap="1rem" mt="3rem" ml="lg">
        <Button variant="default" p={0} style={{ border: "none" }}>
          <CaretCircleLeft size={24} weight="light" />
        </Button>
        <Breadcrumbs separator="|" separatorMargin="md">
          {items}
        </Breadcrumbs>
        <Button variant="default" p={0} style={{ border: "none" }}>
          <CaretCircleRight size={24} weight="light" />
        </Button>
      </Flex>
    </>
  );
};

export default RecentTabs;
