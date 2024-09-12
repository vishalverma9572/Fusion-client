import { Badge, Breadcrumbs, Flex, Text } from "@mantine/core";

const categories = [
  { title: "Sort By" },
  { title: "Tags" },
  { title: "Date" },
  { title: "Person" },
].map((item, index) => <Text key={index}>{item.title}</Text>);

const SortOptions = () => {
  return (
    <>
      <Flex align="center" mt="md" rowGap={"1rem"} columnGap={"4rem"} ml={{md: "lg"}} wrap={"wrap"}>
        <Flex align="center" gap="0.5rem">
          <Text fw={600} size="1.5rem">
            Notfications
          </Text>
          <Badge color="red" size="lg" px={6}>
            26
          </Badge>
        </Flex>
        <Flex>
          <Breadcrumbs separator="|" separatorMargin="md">
            {categories}
          </Breadcrumbs>
        </Flex>
      </Flex>
    </>
  );
};

export default SortOptions;
