import { Breadcrumbs, Text } from "@mantine/core";
import { CaretRight } from "@phosphor-icons/react";

const items = [
  { title: "Home" },
  { title: "Notifications" },
  { title: "Gymkhana" },
].map((item, index) => <Text key={index} size="xl" fw={600}>{item.title}</Text>);

const DashBoardHeadBreadcrumbs = () => {
  return (
    <>
      <Breadcrumbs separator={<CaretRight size={24} weight="bold" />} mt="xs" ml="lg">
        {items}
      </Breadcrumbs>
    </>
  );
};

export default DashBoardHeadBreadcrumbs;
