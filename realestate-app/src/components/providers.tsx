"use client"

import { SessionProvider } from "next-auth/react"
import { PageTransition } from "./page-transition"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PageTransition>
        {children}
      </PageTransition>
      <Toaster richColors position="top-right" />
    </SessionProvider>
  )
}