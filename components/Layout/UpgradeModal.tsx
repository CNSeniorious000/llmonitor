import analytics from "@/utils/analytics"

import { ContextModalProps } from "@mantine/modals"
import { IconAnalyze, IconCheck, IconCircleCheck } from "@tabler/icons-react"

import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  List,
  Mark,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core"

import Script from "next/script"
import { useEffect } from "react"

export const UpgradeBody = () => {
  return (
    <>
      <Stack align="center" ta="center">
        <IconAnalyze color={"#206dce"} size={60} />
        <Title order={2} fw={700} size={40} ta="center">
          Limited time offer
        </Title>

        <Text size="xl" mt="xs" fw={500}>
          Upgrade now and lock in{" "}
          <Mark>{` the lowest price we'll ever offer. `}</Mark>
        </Text>
        <Text size="lg" mt="xs" mb="xl" fw={500}>
          Unlock unlimited usage & team access, support development and get
          involved in the product's future.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: "sm", sm: "md" }}>
        <Card p="xl" withBorder shadow="md">
          <Group gap={6}>
            <Text
              tt="uppercase"
              fw="bold"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            >
              Pro
            </Text>
            <Badge variant="outline">-60%</Badge>
          </Group>

          <Group my={20} align="center" gap={10}>
            <Title order={3} size={30}>
              <Text span td="line-through" size="20">
                $69
              </Text>
              {` 29$`}
              <Text span size="20">
                / mo
              </Text>
            </Title>
          </Group>
          <List
            spacing="sm"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck size={16} />
              </ThemeIcon>
            }
          >
            <List.Item>Unlimited projects & events</List.Item>
            <List.Item>Invite 5 team members</List.Item>
            <List.Item>Unlimited data retention</List.Item>
            <List.Item>1-on-1 support</List.Item>
          </List>

          <Button
            size="md"
            href="https://buy.stripe.com/00gdSVbFdaLY5qMfYZ?prefilled_promo_code=BETA40"
            fullWidth
            component="a"
            variant="gradient"
            gradient={{ from: "violet", to: "blue", deg: 45 }}
            color="violet"
            mt={40}
          >
            Claim -60% forever
          </Button>
        </Card>
        <Card p="xl" withBorder>
          <Group gap={6}>
            <Text
              tt="uppercase"
              fw="bold"
              variant="gradient"
              gradient={{ from: "teal", to: "lime", deg: 45 }}
            >
              Lifetime
            </Text>
            <Badge color="teal" variant="outline">
              -70%
            </Badge>
          </Group>

          <Group my={20} align="center" gap={10}>
            <Title order={3} size={30}>
              <Text span td="line-through" size="20">
                {`$1999`}
              </Text>
              {` $599`}
            </Title>
          </Group>
          <List
            spacing="sm"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck size={16} />
              </ThemeIcon>
            }
          >
            <List.Item>Pay once, access forever</List.Item>
            <List.Item>All the benefits of Pro</List.Item>
            <List.Item>Your company featured on our GitHub</List.Item>
            <List.Item>Early access to new features</List.Item>
          </List>

          <Button
            size="md"
            component="a"
            href="https://buy.stripe.com/14k02538HcU6g5q7su?prefilled_promo_code=BETALIFETIME"
            target="_blank"
            fullWidth
            variant="gradient"
            gradient={{ from: "teal", to: "lime", deg: 25 }}
            mt={40}
          >
            Get lifetime access
          </Button>
        </Card>
      </SimpleGrid>
    </>
  )
}

const UpgradeModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ modalBody: string }>) => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) return null

  useEffect(() => {
    analytics.track("Upgrade Modal")
  }, [])

  return (
    <Stack p={60} pt={0}>
      <UpgradeBody />
    </Stack>
  )
}

export default UpgradeModal
