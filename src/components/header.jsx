import { useState } from "react";
import { User, SignOut, Bell } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Avatar,
  Burger,
  Flex,
  Indicator,
  Popover,
  Group,
  Stack,
  Text,
  Button,
} from "@mantine/core";
import avatarImage from "../assets/avatar.png";
import PropTypes from "prop-types";
import { logoutRoute } from "../helper/api_routes";

const Header = ({ opened, toggleSidebar }) => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const username = useSelector((state) => state.user.username);
  const roles = useSelector((state) => state.user.roles);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        logoutRoute,
        {},
        {
          // 3 hours got wasted just because of an empty brackets :)
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.removeItem("authToken");
      navigate("/accounts/login");
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <Flex
        justify={{ base: "space-between", sm: "flex-end" }}
        align="center"
        pl="sm"
        h="64px" //Height has already been set in layout.jsx but had to set the height here as well for properly aligning the avatar
      >
        <Burger
          opened={opened}
          onClick={toggleSidebar}
          hiddenFrom="sm"
          size="sm"
        />
        <Flex
          justify="flex-end"
          align="center"
          gap="xl"
          px={{ base: "sm", md: "lg" }}
        >
          <Button variant="outline" size="md" color="cyan">
            {roles[0].charAt(0).toUpperCase() + roles[0].slice(1)}
          </Button>
          <Indicator>
            <Bell color="orange" size="32px" cursor="pointer" />
          </Indicator>
          <Popover
            opened={popoverOpened}
            onChange={setPopoverOpened}
            width={340}
            position="bottom-end"
            withArrow
            shadow="xl"
          >
            <Popover.Target>
              <Avatar
                size="46px"
                radius="xl"
                src={avatarImage}
                onClick={() => setPopoverOpened((opened) => !opened)}
                style={{ cursor: "pointer" }}
              />
            </Popover.Target>
            <Popover.Dropdown
              style={{
                border: "1px solid #f0f0f0",
              }}
              w={400}
            >
              <Group spacing="xs">
                <Avatar
                  size="xl"
                  radius="xl"
                  src={avatarImage}
                />
                <Stack gap={8}>
                  <Text size="lg" fz={24} fw={700}>
                  {username.length > 15 ? username.slice(0, 15) + "..." : username}
                  </Text>

                  <Group spacing="xs">
                    <Button
                      rightSection={<User size={16} />}
                      variant="light"
                      color="blue"
                      size="xs"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Button>
                    <Button
                      rightSection={<SignOut size={16} />}
                      variant="light"
                      color="pink"
                      size="xs"
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  </Group>
                </Stack>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Flex>
      </Flex>
    </>
  );
};

export default Header;

Header.propTypes = {
  opened: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};
