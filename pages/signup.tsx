import Router from "next/router"
import { useEffect, useState } from "react"

import {
  Anchor,
  Box,
  Button,
  Container,
  Grid,
  Group,
  List,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core"

import Confetti from "react-confetti"

import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { useSessionContext, useUser } from "@supabase/auth-helpers-react"
import {
  IconAnalyze,
  IconArrowRight,
  IconAt,
  IconBrandDiscord,
  IconCalendar,
  IconCheck,
  IconCircleCheck,
  IconFolderBolt,
  IconMail,
  IconMessageBolt,
  IconUser,
} from "@tabler/icons-react"

import analytics from "@/utils/analytics"
import errorHandler from "@/utils/errorHandler"
import { NextSeo } from "next-seo"
import SocialProof from "@/components/Blocks/SocialProof"

function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const { session, isLoading, supabaseClient } = useSessionContext()

  const form = useForm({
    initialValues: {
      email: "",
      name: "",

      projectName: "Project #1",
      password: "",
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
    if (session && !isLoading && step === 1) Router.push("/")
  }, [isLoading, session, step])

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
          data: {
            signupMethod: "signup",
            name,
            projectName,
          },
        },
      }),
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

  return (
    <Container size={800} mih="60%">
      <NextSeo title="Sign Up" />

      <Stack align="center" gap={50}>
        {step < 3 && (
          <>
            <Stack align="center">
              <IconAnalyze color={"#206dce"} size={60} />
              <Title order={2} fw={700} size={40} ta="center">
                lunary cloud
              </Title>
            </Stack>
            <Grid gutter={50} align="center" mb="sm">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper radius="md" p="xl" withBorder>
                  <form onSubmit={form.onSubmit(handleSignup)}>
                    <Stack gap="xl">
                      {step === 1 && (
                        <>
                          <Title order={2} fw={700} ta="center">
                            Get Started
                          </Title>
                          <TextInput
                            leftSection={<IconAt size="16" />}
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

                          <Text size="sm" style={{ textAlign: "center" }}>
                            {`Already have an account? `}
                            <Anchor href="/login">Log In</Anchor>
                          </Text>
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
                            leftSection={<IconUser size="16" />}
                            placeholder="Your full name"
                            error={form.errors.name && "This field is required"}
                            {...form.getInputProps("name")}
                            onChange={(e) => {
                              form.setFieldValue("name", e.target.value)
                              form.setFieldValue(
                                "orgName",
                                e.target.value + "'s Org",
                              )
                            }}
                          />

                          <TextInput
                            label="Project Name"
                            description="Can be changed later."
                            leftSection={<IconFolderBolt size="16" />}
                            placeholder="Your project name"
                            error={
                              form.errors.projectName &&
                              "This field is required"
                            }
                            {...form.getInputProps("projectName")}
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
                              variant="transparent"
                              color="black"
                            >
                              {`← Go back`}
                            </Button>
                          </Stack>
                        </>
                      )}
                    </Stack>
                  </form>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Box>
                  <List
                    spacing="xl"
                    size="md"
                    icon={
                      <ThemeIcon
                        variant="light"
                        color="teal"
                        size={24}
                        radius="xl"
                      >
                        <IconCircleCheck size="16" />
                      </ThemeIcon>
                    }
                  >
                    <List.Item>
                      <Text fw="bold">Free usage every month</Text>
                      <Text>
                        1K free events per day. Forever.
                        <br />
                        No credit card required.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text fw="bold">Collect data immediately</Text>
                      <Text>
                        Integrate with dev-friendly SDKs, with native support
                        for LangChain and OpenAI.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text fw="bold">No config required</Text>
                      <Text>Get insights without complicated setup.</Text>
                    </List.Item>
                  </List>
                </Box>
              </Grid.Col>
            </Grid>
            <SocialProof />
          </>
        )}

        {step === 3 && (
          <>
            {typeof window !== "undefined" && (
              <Confetti
                recycle={false}
                numberOfPieces={500}
                gravity={0.3}
                width={window.innerWidth}
                height={window.innerHeight}
              />
            )}

            <Stack align="center">
              <IconAnalyze color={"#206dce"} size={60} />
              <Title order={2} fw={700} size={40} ta="center">
                You&apos;re all set 🎉
              </Title>

              <Text size="xl" mt="xs" mb="xl" fw={500}>
                Check your emails for the confirmation link.
              </Text>

              <Button
                onClick={() => {
                  // use this to refresh properly
                  window.location.href = "/"
                }}
                mb="xl"
                rightSection={<IconArrowRight size={18} />}
                size="lg"
              >
                Open Dashboard
              </Button>

              <Text size="lg">
                Want to say hi? We&apos;d love to talk to you:
              </Text>

              <Group>
                <Button
                  variant="outline"
                  onClick={() => {
                    $crisp.push(["do", "chat:open"])
                  }}
                  rightSection={<IconMessageBolt size={18} />}
                >
                  Chat
                </Button>

                <Button
                  variant="outline"
                  color="teal.8"
                  component="a"
                  href="mailto:hello@lk.com"
                  rightSection={<IconMail size={18} />}
                >
                  Email
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
    </Container>
  )
}

export default SignupPage
