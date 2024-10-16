// CustomBreadcrumbs.js
import React from "react";
import { Breadcrumbs, Text } from "@mantine/core";
import { Link } from "react-router-dom";

const CustomBreadcrumbs = ({ items }) => {
  return (
    <Breadcrumbs>
      {items.map((item, index) => (
        <Link to={item.href} key={index}>
          <Text>{item.title}</Text>
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
