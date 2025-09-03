import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  AppShell, 
  Navbar, 
  Header, 
  Footer, 
  Text, 
  MediaQuery, 
  Burger, 
  useMantineTheme, 
  Group, 
  ActionIcon, 
  Menu, 
  Avatar, 
  Divider,
  UnstyledButton,
  Box
} from '@mantine/core';
import { 
  IconHome, 
  IconBriefcase, 
  IconUsers, 
  IconCalendarTime, 
  IconClock, 
  IconFileInvoice, 
  IconLogout, 
  IconSettings, 
  IconUser,
  IconChevronRight
} from '@tabler/icons-react';

interface LayoutProps {
  children: ReactNode;
}

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavLink = ({ icon, label, href, active, onClick }: NavLinkProps) => {
  return (
    <Link href={href} passHref>
      <UnstyledButton
        onClick={onClick}
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          backgroundColor: active ? theme.colors.orange[1] : 'transparent',
          '&:hover': {
            backgroundColor: theme.colors.orange[0],
          },
        })}
      >
        <Group>
          {icon}
          <Text size="sm">{label}</Text>
          {active && (
            <Box ml="auto">
              <IconChevronRight size={16} />
            </Box>
          )}
        </Group>
      </UnstyledButton>
    </Link>
  );
};

export default function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 250 }}>
          <Navbar.Section grow>
            <NavLink 
              icon={<IconHome size={20} />} 
              label="Dashboard" 
              href="/" 
              active={isActive('/')}
              onClick={() => setOpened(false)}
            />
            <NavLink 
              icon={<IconBriefcase size={20} />} 
              label="Matters" 
              href="/matters" 
              active={isActive('/matters')}
              onClick={() => setOpened(false)}
            />
            <NavLink 
              icon={<IconUsers size={20} />} 
              label="Clients" 
              href="/clients" 
              active={isActive('/clients')}
              onClick={() => setOpened(false)}
            />
            <NavLink 
              icon={<IconCalendarTime size={20} />} 
              label="Deadlines" 
              href="/deadlines" 
              active={isActive('/deadlines')}
              onClick={() => setOpened(false)}
            />
            <NavLink 
              icon={<IconClock size={20} />} 
              label="Time Tracking" 
              href="/time" 
              active={isActive('/time')}
              onClick={() => setOpened(false)}
            />
            <NavLink 
              icon={<IconFileInvoice size={20} />} 
              label="Invoices" 
              href="/invoices" 
              active={isActive('/invoices')}
              onClick={() => setOpened(false)}
            />
          </Navbar.Section>
          <Navbar.Section>
            <Divider my="sm" />
            <NavLink 
              icon={<IconSettings size={20} />} 
              label="Settings" 
              href="/settings" 
              active={isActive('/settings')}
              onClick={() => setOpened(false)}
            />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <Group>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text size="lg" weight={700} color="orange">LegisFlow</Text>
            </Group>
            
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon>
                  <Avatar color="orange" radius="xl">JD</Avatar>
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>John Doe</Menu.Label>
                <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item>
                <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" icon={<IconLogout size={14} />}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Header>
      }
      footer={
        <Footer height={60} p="md">
          <Text size="sm" align="center" color="dimmed">
            © {new Date().getFullYear()} LegisFlow CEMAC. All rights reserved.
          </Text>
        </Footer>
      }
    >
      {children}
    </AppShell>
  );
}

