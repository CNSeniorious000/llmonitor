import {
  ActionIcon,
  AppShell,
  AppShellSection,
  Group,
  Menu,
  Stack,
  ThemeIcon,
  Tooltip,
} from "@mantine/core"

import {
  IconBrandOpenai,
  IconFileInvoice,
  IconGraph,
  IconLogout,
  IconMessages,
  IconRobot,
  IconSettings,
  IconStethoscope,
  IconUsers,
} from "@tabler/icons-react"

import { useSessionContext } from "@supabase/auth-helpers-react"

import UserAvatar from "@/components/Blocks/UserAvatar"
import { useProfile } from "@/utils/supabaseHooks"
import Link from "next/link"
import Router, { useRouter } from "next/router"

const menu = [
  { label: "Analytics", icon: IconGraph, link: "/analytics" },
  { label: "Traces", icon: IconRobot, link: "/traces" },
  { label: "Generations", icon: IconBrandOpenai, link: "/generations" },
  { label: "Users", icon: IconUsers, link: "/users" },
  { label: "Tests", icon: IconStethoscope, link: "/tests" },
  { label: "Chats", icon: IconMessages, link: "/chats" },
  { label: "Settings", icon: IconSettings, link: "/settings" },
]

function NavbarLink({ icon: Icon, label, link, active }) {
  return (
    <Tooltip label={label} withArrow position="right">
      <Link href={link}>
        <ThemeIcon
          variant={active ? "filled" : "light"}
          color={"blue.4"}
          size="lg"
        >
          <Icon size="1.1rem" />
        </ThemeIcon>
      </Link>
    </Tooltip>
  )
}

export default function Navbar() {
  const router = useRouter()

  const { supabaseClient } = useSessionContext()

  const { profile } = useProfile()

  const isActive = (link: string) => router.pathname.startsWith(link)

  const links = menu.map((item) => (
    <NavbarLink {...item} active={isActive(item.link)} key={item.label} />
  ))

  return (
    <AppShell.Navbar px="md" py="xl">
      <Stack justify="space-between" h="full">
        <Stack gap="xl" align="center">
          {links}
        </Stack>

        {profile && (
          <AppShellSection py="sm">
            <Stack gap="sm" align="center">
              <Menu
                trigger="hover"
                shadow="md"
                width={200}
                position="top"
                withArrow
              >
                <Menu.Target>
                  <ActionIcon>
                    <UserAvatar profile={profile} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown ml="lg">
                  <Menu.Label>Account</Menu.Label>
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
                    <Menu.Item
                      leftSection={<IconFileInvoice size={16} />}
                      onClick={() => {
                        Router.push("/billing")
                      }}
                    >
                      Billing
                    </Menu.Item>
                  )}
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={() => {
                      supabaseClient.auth.signOut().then(() => {
                        Router.push("/login")
                      })
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Stack>
          </AppShellSection>
        )}
      </Stack>
    </AppShell.Navbar>
  )
}
