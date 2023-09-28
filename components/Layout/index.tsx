import { AppShell } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { ReactNode, useEffect } from "react"

import { useSessionContext } from "@supabase/auth-helpers-react"

import Router, { useRouter } from "next/router"

import { AppContext } from "@/utils/context"
import Header from "./Header"
import Navbar from "./Navbar"

import { useLocalStorage } from "@mantine/hooks"
import { ModalsProvider } from "@mantine/modals"
import UpgradeModal from "./UpgradeModal"

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const isAuthPage = ["/login", "/signup", "/join"].includes(router.pathname)

  const { session, isLoading } = useSessionContext()

  const [appId, setAppId] = useLocalStorage({
    key: "appId",
    defaultValue: null,
  })

  useEffect(() => {
    if (!session && !isLoading && !isAuthPage) {
      Router.push("/login")
    }
  }, [session, isLoading, router.pathname])

  if (!session && !isAuthPage) return null

  return (
    <>
      <Notifications position="top-right" />
      <ModalsProvider modals={{ upgrade: UpgradeModal }}>
        <AppContext.Provider value={{ appId, setAppId }}>
          <AppShell
            header={{ height: 60 }}
            navbar={{ width: { base: 80 }, breakpoint: null }}
            mih={"100vh"}
            padding={"xl"}
            style={{ backgroundColor: "#fafafa" }}
          >
            {!isAuthPage && <Header />}
            {!isAuthPage && appId && <Navbar />}
            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </AppContext.Provider>
      </ModalsProvider>
    </>
  )
}
