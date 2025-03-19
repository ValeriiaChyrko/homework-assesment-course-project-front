"use client";

import {Sidebar} from "./_components/sidebar";
import {Navbar} from "./_components/navbar";
import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-full">
                <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
                    <Navbar />
                </div>
                <div className="hidden md:!flex h-full w-56 fixed inset-y-0 z-50">
                    <Sidebar />
                </div>
                <main className="md:pl-56 pt-[80px] h-full">
                        {children}
                </main>
            </div>
        </QueryClientProvider>
    )
}

export default DashboardLayout;