import { NextSeo } from "next-seo"
import Router from "next/router"
import { useMemo, useState } from "react"

import DataTable from "@/components/Blocks/DataTable"
import Feedback from "@/components/Blocks/Feedback"
import AppUserAvatar from "@/components/Blocks/AppUserAvatar"
import { BubbleMessage } from "@/components/Blocks/SmartViewer/Message"
import Empty from "@/components/Layout/Empty"

import {
  durationColumn,
  feedbackColumn,
  inputColumn,
  tagsColumn,
  timeColumn,
  userColumn,
} from "@/utils/datatable"

import { formatDateTime } from "@/utils/format"
import { useAppUser, useRuns } from "@/utils/dataHooks"

import {
  Alert,
  Button,
  Card,
  Drawer,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core"

import { IconMessages, IconNeedleThread } from "@tabler/icons-react"
import { createColumnHelper } from "@tanstack/react-table"
import analytics from "../../utils/analytics"

const columnHelper = createColumnHelper<any>()

const columns = [
  timeColumn("created_at"),
  durationColumn("full"),
  userColumn(),
  inputColumn("Opening Message"),
  tagsColumn(),
  feedbackColumn(true),
]

const ChatReplay = ({ run }) => {
  const { runs, loading } = useRuns("chat", {
    match: { parent_run: run.id },
    notInfinite: true,
  })

  const { user } = useAppUser(run.user)

  // Each chat run has input = user message, output = bot message
  const messages = useMemo(
    () =>
      runs &&
      runs
        .filter((run) => run.type === "chat")
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        .map((run) => {
          return [
            {
              role: "user",
              content: run.input,
              timestamp: run.created_at,
            },
            {
              role: "ai",
              content: run.output,
              took:
                new Date(run.ended_at).getTime() -
                new Date(run.created_at).getTime(),
              timestamp: run.ended_at,
              feedback: run.feedback,
            },
          ]
        })
        .flat(),
    [runs],
  )

  return (
    <Stack>
      <Card withBorder>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text>User</Text>
            <Text>
              {user ? (
                <AppUserAvatar size="sm" user={user} withName />
              ) : (
                "Unknown"
              )}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text>First message</Text>
            <Text>{formatDateTime(run.created_at)}</Text>
          </Group>
          <Group justify="space-between">
            <Text>Last message</Text>
            <Text>{formatDateTime(run.ended_at)}</Text>
          </Group>
          <Group justify="space-between">
            <Text>Messages</Text>
            <Text>{messages?.length}</Text>
          </Group>
        </Stack>
      </Card>
      <Button
        variant="outline"
        onClick={() => {
          Router.push(`/traces/${run.id}`)
        }}
        rightSection={<IconNeedleThread size="16" />}
      >
        View trace
      </Button>

      <Title order={3}>Replay</Title>

      {messages && (
        <Stack gap={0}>
          {messages?.map(({ role, content, took, feedback }) => (
            <>
              <BubbleMessage
                role={role}
                content={content}
                extra={
                  <>
                    {took && (
                      <Text color="dimmed" size="xs">
                        {took}ms
                      </Text>
                    )}

                    {feedback && <Feedback data={feedback} />}
                  </>
                }
              />
            </>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default function Chats() {
  const { runs, loading, validating, loadMore } = useRuns("convo")

  const [selected, setSelected] = useState(null)

  if (!loading && runs?.length === 0) {
    return <Empty Icon={IconMessages} what="conversations" />
  }

  return (
    <Stack h={"calc(100vh - var(--navbar-size))"}>
      <NextSeo title="Chats" />
      {loading && <Loader />}

      <Drawer
        opened={!!selected}
        keepMounted
        size="lg"
        position="right"
        title={<Title order={3}>Chat details</Title>}
        onClose={() => setSelected(null)}
      >
        {selected && <ChatReplay run={selected} />}
      </Drawer>

      <DataTable
        key="chat"
        onRowClicked={(row) => {
          analytics.track("OpenChat")
          setSelected(row)
        }}
        loading={loading || validating}
        loadMore={loadMore}
        columns={columns}
        data={runs}
      />
    </Stack>
  )
}
