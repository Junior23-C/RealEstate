"use client"

import { SessionProvider } from "next-auth/react"
import { PageTransition } from "./page-transition"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PageTransition>
        {children}
      </PageTransition>
    </SessionProvider>
  )
}