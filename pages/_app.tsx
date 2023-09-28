import Layout from "@/components/Layout"
import AnalyticsWrapper from "@/components/Layout/Analytics"
import { Database } from "@/utils/supaTypes"
import { MantineProvider, createTheme } from "@mantine/core"
import "@mantine/core/styles.css"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { DefaultSeo } from "next-seo"
import { AppProps } from "next/app"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import "../styles/globals.css"
import { theme } from "../styles/theme"

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  const [supabase] = useState(() => createPagesBrowserClient<Database>())

  return (
    <>
      {/* <style jsx global>{`
        html {
          font-family: ${circularPro.style.fontFamily};
        }
      `}</style> */}
      <Head>
        <link
          href="https://llmonitor.com/logo.png"
          rel="icon"
          type="image/png"
        />
      </Head>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <DefaultSeo
          title="Dashboard"
          titleTemplate="%s | LLMonitor"
          defaultTitle="Dashboard | LLMonitor"
        />
        <MantineProvider theme={theme}>
          <AnalyticsWrapper>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AnalyticsWrapper>
        </MantineProvider>
      </SessionContextProvider>
    </>
  )
}
