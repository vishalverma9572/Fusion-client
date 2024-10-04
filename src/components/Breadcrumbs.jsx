import { Breadcrumbs, Text } from "@mantine/core";
import { CaretRight } from "@phosphor-icons/react";
import classes from "../Modules/Dashboard/Dashboard.module.css";

const items = [
  { title: "Home" },
  { title: "Notifications" },
  { title: "Gymkhana" },
].map((item, index) => (
  <Text key={index} className={classes.fusionText} fw={600}>
    {item.title}
  </Text>
));

const CustomBreadcrumbs = () => {
  return (
    <>
      <Breadcrumbs
        separator={
          <CaretRight className={classes.fusionCaretIcon} weight="bold" />
        }
        mt="xs"
        ml={{ md: "lg" }}
      >
        {items}
      </Breadcrumbs>
    </>
  );
};

export default CustomBreadcrumbs;
