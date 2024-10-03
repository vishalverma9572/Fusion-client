import { useState } from "react";
import { User, SignOut, Bell } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
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
  Box,
  Badge,
  Divider,
} from "@mantine/core";
import PropTypes from "prop-types";
import { logoutRoute } from "../helper/api_routes";

const Header = ({ opened, toggleSidebar }) => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    console.log(token);
    
    try {
        await axios.post(logoutRoute, {}, { // 3 hours got wasted just because of an empty brackets :)
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        localStorage.removeItem('authToken'); 
        navigate('accounts/login'); 
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
          gap="lg"
          px={{ base: "sm", md: "lg" }}
        >
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
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
                onClick={() => setPopoverOpened((o) => !o)}
                style={{ cursor: "pointer" }}
              />
            </Popover.Target>
            <Popover.Dropdown
              style={{
                border: "1px solid #f0f0f0",
              }}
            >
              <Group spacing="xs">
                <Avatar
                  size="xl"
                  radius="xl"
                  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
                />
                <Stack gap={8}>
                  <Text size="lg" fz={24} fw={700}>
                    Little Krishna
                  </Text>
                  <Group gap={8}>
                    <Text size="sm" c="dimmed">
                      Student
                    </Text>
                    <Divider orientation="vertical" />
                    <Text size="sm" c="dimmed">
                      22BCS000
                    </Text>
                  </Group>

                  <Group spacing="xs">
                    <Button
                      rightSection={<User size={16} />}
                      variant="light"
                      color="blue"
                      size="xs"
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
                <Group spacing="xs">
                  <Badge variant="light" color="blue">
                    Sem V
                  </Badge>
                  <Badge variant="light" color="blue">
                    B.Tech | CSE
                  </Badge>
                  <Badge variant="light" color="blue">
                    CPI 8.1
                  </Badge>
                </Group>
                <Box>
                  <Text size="sm" weight={500} mb="xs">
                    Change Your Authority
                  </Text>
                  <Group spacing="xs">
                    {[
                      "Student",
                      "Co-coordinator",
                      "Coordinator",
                      "Admin",
                      "Professor",
                      "Director",
                    ].map((role) => (
                      <Button
                        key={role}
                        variant="outline"
                        size="xs"
                        color="cyan"
                      >
                        {role}
                      </Button>
                    ))}
                  </Group>
                </Box>
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
