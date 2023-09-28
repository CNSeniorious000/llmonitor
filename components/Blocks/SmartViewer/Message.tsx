import {
  Code,
  Flex,
  Paper,
  Space,
  Spoiler,
  Text,
  ThemeIcon,
} from "@mantine/core"
import { IconRobot, IconUser } from "@tabler/icons-react"

const typesColors = {
  ai: "green",
  human: "blue",
  user: "blue",
  error: "red",
  function: "violet",
  system: "gray",
}

const tc = (role) => {
  const color = typesColors[role]
  if (!color) return "var(--mantine-color-gray-2)"
  return `var(--mantine-color-${color}-2)`
}

// Use for logging AI chat queries
export function ChatMessage({ data, compact = false }) {
  return (
    <Paper
      p={compact ? 0 : 12}
      pt={compact ? 0 : 8}
      style={{ backgroundColor: tc(data?.role) }}
    >
      {!compact && (
        <Text size="xs" color={typesColors[data?.role] + ".9"}>
          {data?.role}
        </Text>
      )}
      <Spoiler mt={5} maxHeight={300} showLabel="Show all ↓" hideLabel="Hide ↑">
        {data?.text && (
          <Code color={typesColors[data?.role]} block>
            {data?.text}
          </Code>
        )}
        {data?.functionCall && (
          <Text>
            <Code color={typesColors[data?.role]} block>
              <Text w={300} color={typesColors[data?.role]} mb="xs">
                {`function call: `}
                <Text span fw="bolder">
                  {data?.functionCall?.name}
                </Text>
              </Text>

              {typeof data?.functionCall?.arguments === "string"
                ? data?.functionCall?.arguments
                : JSON.stringify(data?.functionCall?.arguments, null, 2)}
            </Code>
          </Text>
        )}
      </Spoiler>
      <style jsx>{`
        :global(pre) {
          white-space: pre-wrap;
        }

        :global(pre code) {
          padding: 10px;
          display: block;
        }
      `}</style>
    </Paper>
  )
}

// Used for chat replays
export function BubbleMessage({ role, content, extra }) {
  const isBot = role === "ai"

  return (
    <>
      <Flex direction={isBot ? "row" : "row-reverse"} align="center" gap="md">
        {isBot ? (
          <ThemeIcon size={36} variant="light" radius="xl" color={"blue"}>
            <IconRobot size={24} />
          </ThemeIcon>
        ) : (
          <ThemeIcon size={36} variant="light" radius="xl" color={"pink"}>
            <IconUser size={24} />
          </ThemeIcon>
        )}
        <div>
          <Paper
            mb="xs"
            px="md"
            py={"sm"}
            radius="lg"
            shadow="sm"
            withBorder
            maw={270}
          >
            <span style={{ whiteSpace: "pre-line" }}>{content}</span>
          </Paper>
          {extra}
        </div>
      </Flex>

      <Space h="lg" />
    </>
  )
}
