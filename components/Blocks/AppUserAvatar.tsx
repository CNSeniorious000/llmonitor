import { formatAppUser } from "@/utils/format"
import { Anchor, Avatar, AvatarProps, Group, MantineSize } from "@mantine/core"
import { memo } from "react"

const colors = [
  "cyan",
  "purple",
  "violet",
  "blue",
  "red",
  "teal",
  "yellow",
  "pink",
  "indigo",
  "green",
]

function AppUserAvatar({
  user,
  size = "md",
  withName = false,
}: {
  user: any
  size?: AvatarProps["size"]
  withName?: boolean
}) {
  // use user.id (int) as seed for random color
  const color = colors[user?.id % colors.length]

  if (!user) return null

  const nameOrEmail = formatAppUser(user)

  return (
    <Group gap="sm">
      <Avatar lh={0.4} radius="xl" color={color} size={size}>
        {nameOrEmail?.slice(0, 2)?.toUpperCase()}
      </Avatar>
      {withName && (
        <Anchor href={`/users/${user.id}`}>{formatAppUser(user)}</Anchor>
      )}
    </Group>
  )
}

export default memo(AppUserAvatar)
