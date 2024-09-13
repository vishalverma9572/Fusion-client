import {
  Flex,
  Stack,
  Button,
  ScrollArea,
  Divider,
  Tooltip,
} from "@mantine/core";
import { CaretRight, CaretLeft } from "@phosphor-icons/react";
import {
  House as HomeIcon,
  CalendarBlank as CurriculumIcon,
  ForkKnife as MessIcon,
  Heart as HealthIcon,
  Tray as ComplainIcon,
  LetterCircleP as PlacementIcon,
  SquaresFour as DepartmentIcon,
  Barbell as GymkhanaIcon,
  City as HostelIcon,
  DotsThreeCircle as OtherIcon,
  Books as AcademicsIcon,
  Question as HelpIcon,
  GraduationCap as ScholarshipIcon,
  Bed as GuestIcon,
  User as ProfileIcon,
  Gear as SettingsIcon,
} from "@phosphor-icons/react";
import IIITLOGO from "../assets/IIITJ_logo.webp";
import PropTypes from "prop-types";
import { useState } from "react";

const Modules = [
  { label: "Home", icon: <HomeIcon size={18} /> },
  { label: "Academics", icon: <AcademicsIcon size={18} /> },
  { label: "Program & Curriculum", icon: <CurriculumIcon size={18} /> },
  { label: "Mess Management", icon: <MessIcon size={18} /> },
  { label: "Visitor's Hostel", icon: <GuestIcon size={18} /> },
  { label: "HealthCare Center", icon: <HealthIcon size={18} /> },
  { label: "Scholarship Portal", icon: <ScholarshipIcon size={18} /> },
  { label: "Complaint System", icon: <ComplainIcon size={18} /> },
  { label: "Placement Cell", icon: <PlacementIcon size={18} /> },
  { label: "Department Portal", icon: <DepartmentIcon size={18} /> },
  { label: "Gymkhana", icon: <GymkhanaIcon size={18} /> },
  { label: "Hostel Management", icon: <HostelIcon size={18} /> },
  { label: "Other", icon: <OtherIcon size={18} /> },
  { label: "Dummy-Data1", icon: <OtherIcon size={18} /> },
  { label: "Dummy-Data2", icon: <OtherIcon size={18} /> },
  { label: "Dummy-Data3", icon: <OtherIcon size={18} /> },
];

const otherItems = [
  { label: "Profile", icon: <ProfileIcon size={18} /> },
  { label: "Settings", icon: <SettingsIcon size={18} /> },
  { label: "Help", icon: <HelpIcon size={18} /> },
];

const SidebarContent = ({ isCollapsed, toggleSidebar }) => {
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleModuleClick = (itemlabel) => {
    setSelected(itemlabel);
    toggleSidebar();
  };

  return (
    <>
      <Flex gap={32} align="center" h={64} justify={"center"}>
        {!isCollapsed && (
          <img src={IIITLOGO} alt="IIIT Logo" style={{ maxWidth: "150px" }} />
        )}

        <Flex
          onClick={toggleSidebar}
          onMouseEnter={() => setHover("toggle")}
          onMouseLeave={() => setHover(null)}
          bg={hover == "toggle" ? "#e9ecef" : ""}
          style={{ borderRadius: "6px" }}
          justify="center"
          p="4px"
        >
          {isCollapsed ? <CaretRight size={24} /> : <CaretLeft size={24} />}
        </Flex>
      </Flex>
      <ScrollArea
        mah={600}
        type={!isCollapsed && "always"}
        scrollbars="y"
        onMouseEnter={() => toggleSidebar()}
        onMouseLeave={() => !isCollapsed && toggleSidebar()}
      >
        <Stack spacing="xs" mt="16px" align="flex-start" gap="4px">
          {Modules.map((item) => (
            <Tooltip
              key={item.label}
              label={isCollapsed && item.label}
              position="right"
              offset={-16}
              withArrow={isCollapsed && true}
              p={!isCollapsed && 0}
            >
              <Button
                key={item.label}
                variant={
                  hover == item.label
                    ? "subtle"
                    : selected == item.label
                    ? "outline"
                    : "transparent"
                }
                leftSection={item.icon}
                style={{ display: "flex", justifyContent: "flex-start" }}
                w="90%"
                color={
                  hover == item.label || selected == item.label
                    ? "blue"
                    : "#535455"
                }
                onMouseEnter={() => setHover(item.label)}
                onMouseLeave={() => setHover(null)}
                onClick={() => handleModuleClick(item.label)}
              >
                {!isCollapsed && item.label}
              </Button>
            </Tooltip>
          ))}
        </Stack>
      </ScrollArea>
      <Divider
        my="sm"
        label={!isCollapsed && "Miscellaneous"}
        labelPosition="center"
      />
      <Stack
        spacing="xs"
        mt="2px"
        align="flex-start"
        gap={4}
        onMouseEnter={() => toggleSidebar()}
        onMouseLeave={() => !isCollapsed && toggleSidebar()}
      >
        {otherItems.map((item) => (
          <Button
            key={item.label}
            variant="transparent"
            leftSection={item.icon}
            style={{ justifyContent: "flex-start" }}
            color={
              hover == item.label || selected == item.label
                ? "blue"
                : "#535455"
            }
            onMouseEnter={() => setHover(item.label)}
            onMouseLeave={() => setHover(null)}
          >
            {!isCollapsed && item.label}
          </Button>
        ))}
      </Stack>
    </>
  );
};

SidebarContent.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default SidebarContent;
