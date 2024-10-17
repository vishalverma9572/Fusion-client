import React from "react";
import {
  Container,
  SimpleGrid,
  Group,
  Badge,
  Title,
  Text,
} from "@mantine/core";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ClipboardText,
  Buildings,
  User,
  FilePlus,
} from "@phosphor-icons/react";
import PerformanceCard from "../components/FormComponent/PerformanceCard";
import classes from "./Hr_Dashboard.module.css";
import { HeroBanner } from "../components/HeroBanner";

const mockdata = [
  {
    title: "Leave Management",
    description: "Manage and apply for leaves effortlessly.",
    icon: Briefcase,
    link: "/hr/leave",
  },
  {
    title: "CPDA Advance",
    description: "Handle CPDA advance requests with ease.",
    icon: ClipboardText,
    link: "/hr/cpda_adv",
  },
  {
    title: "LTC",
    description: "Manage LTC claims and requests seamlessly.",
    icon: Buildings,
    link: "/hr/ltc",
  },
  {
    title: "Appraisal",
    description: "Performance appraisal management.",
    icon: User,
    link: "/hr/appraisal",
  },
  {
    title: "CPDA Claim",
    description: "Submit and track CPDA claims.",
    icon: FilePlus,
    link: "/hr/cpda_claim",
  },
];

const Hr_Dashboard = () => {
  const features = mockdata.map((feature) => (
    <PerformanceCard
      key={feature.title}
      IconComponent={feature.icon}
      title={feature.title}
      description={feature.description}
      link={feature.link}
    />
  ));

  return (
    <div size="lg" py="xl" className={classes.hrdashboardContainer}>
      <HeroBanner />
      <SimpleGrid
        cols={{ base: 1, md: 3 }}
        spacing="xl"
        mt={10}
        className={classes.simpleGrid}
      >
        {features}
      </SimpleGrid>
    </div>
  );
};

export default Hr_Dashboard;
