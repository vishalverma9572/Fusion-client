import {
  AppShell,
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
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import SidebarContent from "./sidebarContent";
import { Bell } from "@phosphor-icons/react";
import { User, SignOut } from "@phosphor-icons/react";
import PropTypes from "prop-types";

export function Layout({ children }) {
  const [opened, { close, open }] = useDisclosure(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const openSidebar = () => {
    open();
    setIsCollapsed(false);
  }

  return (
    <AppShell
      layout="alt"
      header={{ height: 80 }}
      navbar={{
        width: isCollapsed ? 60 : 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      bg="#fbfbfb"
    >
      <AppShell.Header bg="#fbfbfb">
        <Flex justify={{base:"space-between", sm:"flex-end"}}  align="center" pl="sm">
          <Burger opened={opened} onClick={openSidebar} hiddenFrom="sm" size="sm" />
          <Flex justify="flex-end" align="center" gap="lg" py="sm" px="xl">
            <Indicator>
              <Bell color="orange" size="32px" cursor="pointer" />
            </Indicator>
            <Popover
              opened={popoverOpened}
              onChange={setPopoverOpened}
              width={330}
              position="bottom-end"
              withArrow
              shadow="lg"
            >
              <Popover.Target>
                <Avatar
                  size="lg"
                  radius="xl"
                  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
                  onClick={() => setPopoverOpened((o) => !o)}
                  style={{ cursor: "pointer" }}
                />
              </Popover.Target>
              <Popover.Dropdown style={{
                border: "1px solid #f0f0f0",
              }}>
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
                      >
                        Sign out
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
      </AppShell.Header>

      <AppShell.Navbar
        p="xs"
        style={{
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
        }}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          closeSidebar={close}
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
