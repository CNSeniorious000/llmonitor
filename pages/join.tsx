import { useSearchParams } from "next/navigation"
import {
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"

import { useForm } from "@mantine/form"
import { useSessionContext, useUser } from "@supabase/auth-helpers-react"
import {
  IconAnalyze,
  IconAt,
  IconBrandDiscord,
  IconCalendar,
  IconCheck,
  IconFolderBolt,
  IconMail,
  IconMessageBolt,
  IconUser,
} from "@tabler/icons-react"

import Router from "next/router"
import { useEffect, useState } from "react"
import errorHandler from "@/utils/errorHandler"
import analytics from "@/utils/analytics"
import { NextSeo } from "next-seo"
import { notifications } from "@mantine/notifications"
import Confetti from "react-confetti"
import { supabaseAdmin } from "../lib/supabaseClient"

export async function getServerSideProps(context) {
  const teamOwnerId = context.query.team
  const { count } = await supabaseAdmin
    .from("profile")
    .select("*", { count: "exact", head: true })
    .match({ team_owner: teamOwnerId })

  return { props: { teamSize: count + 1 } }
}

function TeamFull({ owner }) {
  return (
    <Container py={100} size={600}>
      <NextSeo title="Signup" />
      <Stack align="center" gap={30}>
        <IconAnalyze color={"#206dce"} size={60} />
        <Title order={2} fw={700} size={40} ta="center">
          Sorry, {owner}'s team is full
        </Title>

        <Flex align="center" gap={30}>
          <Button size="md" onClick={() => Router.push("/")}>
            Go back home
          </Button>
          <Anchor
            component="button"
            type="button"
            onClick={() => {
              try {
                window._gs("chat", "show")
              } catch (e) {}
            }}
          >
            Contact support →
          </Anchor>
        </Flex>
      </Stack>
    </Container>
  )
}
export default function Join({ teamSize }) {
  const searchParams = useSearchParams()
  const ownerId = searchParams.get("team")

  const [owner, setOwner] = useState("")

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const { supabaseClient } = useSessionContext()

  useEffect(() => {
    if (ownerId) {
      // TODO: server side
      supabaseClient
        .from("profile")
        .select("name")
        .match({ id: ownerId })
        .then(({ data }) => setOwner(data[0].name))
    }
  }, [ownerId])

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      projectName: "Project #1",
      password: "",
      companyName: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      name: (val) => (val.length <= 2 ? "Your name that short :) ?" : null),
      projectName: (val) =>
        val.length <= 1 ? "Can you pick something longer?" : null,

      password: (val) =>
        val.length < 6 ? "Password must be at least 6 characters" : null,
    },
  })

  const user = useUser()

  useEffect(() => {
    if (user) Router.push("/")
  }, [user])

  const handleSignup = async ({
    email,
    password,
    name,
    projectName,
  }: {
    email: string
    password: string
    name: string
    projectName: string
  }) => {
    setLoading(true)

    const ok = await errorHandler(
      supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            projectName,
            teamOwner: ownerId,
          },
        },
      })
    )

    analytics.track("Signup", { email, name })

    if (ok) {
      notifications.show({
        icon: <IconCheck size={18} />,
        color: "teal",
        title: "Email sent 💌",
        message: "Check your emails to verify your email.",
      })

      setStep(3)
    }

    setLoading(false)
  }

  const nextStep = () => {
    if (step === 1) {
      if (
        form.validateField("email").hasError ||
        form.validateField("password").hasError
      ) {
        return
      }
    }

    setStep(step + 1)
  }

  if (teamSize === 5) {
    return <TeamFull owner={owner} />
  }

  return (
    <Container py={100} size={600}>
      <NextSeo title="Join" />

      <Stack align="center" gap={50}>
        <Stack align="center">
          <IconAnalyze color={"#206dce"} size={60} />
          <Title order={2} fw={700} size={40} ta="center">
            Join {owner}'s team
          </Title>
        </Stack>
        <Paper radius="md" p="xl" withBorder miw={350}>
          <form onSubmit={form.onSubmit(handleSignup)}>
            <Stack gap="xl">
              {step === 1 && (
                <>
                  <Title order={2} fw={700} ta="center">
                    Get Started
                  </Title>
                  <TextInput
                    leftSection={<IconAt size={16} />}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    error={form.errors.email && "Invalid email"}
                    placeholder="Your email"
                    {...form.getInputProps("email")}
                  />

                  <PasswordInput
                    label="Password"
                    autoComplete="new-password"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        nextStep()
                      }
                    }}
                    error={form.errors.password && "Invalid password"}
                    placeholder="Your password"
                    {...form.getInputProps("password")}
                  />

                  <Button
                    size="md"
                    mt="md"
                    onClick={nextStep}
                    fullWidth
                    loading={loading}
                  >
                    {`Continue →`}
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <Title order={2} fw={700} ta="center">
                    Almost there...
                  </Title>

                  <TextInput
                    label="Full Name"
                    autoComplete="name"
                    description="Only used to address you properly."
                    icon={<IconUser size={16} />}
                    placeholder="Your full name"
                    error={form.errors.name && "This field is required"}
                    {...form.getInputProps("name")}
                  />

                  <Stack>
                    <Button
                      size="md"
                      mt="md"
                      type="submit"
                      fullWidth
                      loading={loading}
                    >
                      {`Create account`}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setStep(1)}
                      fullWidth
                      variant="link"
                      color="gray.4"
                    >
                      {`← Go back`}
                    </Button>
                  </Stack>
                </>
              )}

              {step === 3 && (
                <>
                  <Confetti
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.3}
                  />

                  <Stack align="center">
                    <IconAnalyze color={"#206dce"} size={60} />
                    <Title order={2} fw={700} size={40} ta="center">
                      You're all set 🎉
                    </Title>

                    <Text size="lg" mt="xs" mb="xl" fw={500}>
                      Check your emails for the confirmation to open the
                      dashboard.
                    </Text>

                    <Text>Want to say hi? We'd love to talk to you:</Text>

                    <Group>
                      <Button
                        variant="outline"
                        onClick={() => {
                          try {
                            window._gs("chat", "show")
                          } catch (e) {}
                        }}
                        rightSection={<IconMessageBolt size={18} />}
                      >
                        Chat
                      </Button>

                      <Button
                        variant="outline"
                        color="teal.8"
                        component="a"
                        href="mailto:vince@llmonitor.com"
                        rightSection={<IconMail size={18} />}
                      >
                        Email
                      </Button>

                      <Button
                        variant="outline"
                        color="violet"
                        target="_blank"
                        component="a"
                        href="https://discord.gg/8PafSG58kK"
                        rightSection={<IconBrandDiscord size={18} />}
                      >
                        Discord
                      </Button>

                      <Button
                        variant="outline"
                        color="red.8"
                        target="_blank"
                        component="a"
                        href="https://savvycal.com/vince/chat"
                        rightSection={<IconCalendar size={18} />}
                      >
                        Call with founder
                      </Button>
                    </Group>
                  </Stack>
                </>
              )}
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  )
}
