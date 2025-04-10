'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider refetchInterval={4 * 60}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </SessionProvider>
    )
}