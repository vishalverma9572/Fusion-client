import React from "react";
import { Card, Text, Group, Divider, Button } from "@mantine/core";
import { Link } from "react-router-dom";

const PerformanceCard = ({ IconComponent, title, description, link }) => {
  return (
    <Card
      shadow="lg"
      p="lg"
      style={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        color: "#333",
        width: "300px",
        margin: "0px auto",
        border: "1px solid #e0e0e0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Group position="apart">
        <IconComponent size={32} color="#4E9EFC" />
      </Group>
      <Text
        size="lg"
        weight={600}
        style={{ marginTop: "10px", marginBottom: "5px", color: "#333" }}
      >
        {title}
      </Text>
      <Divider
        size="md"
        color="#4E9EFC"
        style={{ marginBottom: "10px", width: "60px" }}
      />
      <Text size="sm" color="dimmed">
        {description}
      </Text>
      <Button
        variant="outline"
        color="#4E9EFC"
        component={Link}
        to={link}
        style={{ marginTop: "10px" }}
      >
        Go to {title}
      </Button>
    </Card>
  );
};

export default PerformanceCard;
