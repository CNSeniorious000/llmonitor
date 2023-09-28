import { createTheme } from "@mantine/core"
import localFont from "next/font/local"
import Link from "next/link"

const circularPro = localFont({
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
  src: [
    {
      path: "../public/fonts/circular-pro-book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/circular-pro-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/circular-pro-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/circular-pro-black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
})

export const theme = createTheme({
  defaultRadius: "md",
  fontFamily: circularPro.style.fontFamily,
  headings: {
    fontWeight: "700",
  },
  components: {
    Anchor: {
      defaultProps: {
        component: Link,
      },
    },
    Button: {
      defaultProps: {
        fw: "500",
      },
    },
  },
})
