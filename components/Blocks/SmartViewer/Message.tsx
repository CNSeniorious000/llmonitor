import {
  Code,
  Flex,
  Paper,
  Select,
  Space,
  Text,
  Textarea,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core"
import { IconRobot, IconUser } from "@tabler/icons-react"
import ProtectedText from "../ProtectedText"
import { RenderJson } from "./RenderJson"
import { useColorScheme } from "@mantine/hooks"
import { getColorForRole } from "../../../utils/colors"

const RenderFunction = ({ color, codeBg, data }) => {
  const scheme = useColorScheme()

  return (
    <Code block bg={codeBg}>
      <Text w={300} color={color} mb="xs">
        {`function call: `}
        <Text span fw="bolder">
          {data?.name}
        </Text>
      </Text>

      <RenderJson data={data?.arguments} />
    </Code>
  )
}

// Use for logging AI chat queries
// Editable is used for the playground
export function ChatMessage({
  data,
  editable = false,
  onChange,
  compact = false,
}: {
  data: any
  editable?: boolean
  onChange?: any
  compact?: boolean
}) {
  const scheme = useColorScheme()
  const theme = useMantineTheme()

  // console.log(data?.role)

  const color = getColorForRole(data?.role)

  // console.log(`var(--mantine-color-${color}-light)`)
  // console.log()
  // const color = data?.role
  //   ? `var(--mantine-color-${typesColors[data?.role]}-light)`
  //   : "gray"
  // const color =
  //   `var(--mantine-color-${typesColors[data?.role]}-light)` || "gray"

  const codeBg = `rgba(${scheme === "dark" ? "0,0,0" : "255,255,255"},0.6)`

  return (
    <Paper
      p={compact ? 0 : 12}
      pt={compact ? 0 : 8}
      style={{
        overflow: "hidden",
        backgroundColor: color,
        // theme.colors[color][
        //   scheme === "dark" ? (color === "gray" ? 7 : 9) : 2
        // ],
      }}
    >
      {!compact && (
        <Text
          mb={5}
          size="xs"
          color={color + "." + (scheme === "dark" ? 2 : 8)}
        >
          {editable ? (
            <Select
              variant="unstyled"
              size="xs"
              w={75}
              withCheckIcon={false}
              styles={{
                input: {
                  color: "inherit",
                },
              }}
              value={data?.role}
              data={["ai", "user", "system", "function", "tool"]}
              onChange={(role) => onChange({ ...data, role })}
            />
          ) : (
            data?.role
          )}
        </Text>
      )}

      {data?.functionCall ? (
        <RenderFunction
          color={color}
          data={data?.functionCall}
          codeBg={codeBg}
        />
      ) : data?.toolCalls ? (
        data?.toolCalls.map((toolCall, index) => (
          <RenderFunction
            key={index}
            color={color}
            data={toolCall.function}
            codeBg={codeBg}
          />
        ))
      ) : (
        typeof data?.text === "string" && (
          <Code block bg={codeBg}>
            <ProtectedText>
              {editable ? (
                <Textarea
                  value={data?.text}
                  variant="unstyled"
                  p={0}
                  styles={{
                    root: {
                      fontFamily: "inherit",
                      fontSize: "inherit",
                    },
                    input: {
                      padding: "0 !important",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                    },
                  }}
                  autosize
                  minRows={1}
                  onChange={(e) => onChange({ ...data, text: e.target.value })}
                  style={{ width: "100%" }}
                />
              ) : (
                data?.text
              )}
            </ProtectedText>
          </Code>
        )
      )}

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
