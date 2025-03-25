﻿'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider refetchInterval={4 * 60}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    )
}