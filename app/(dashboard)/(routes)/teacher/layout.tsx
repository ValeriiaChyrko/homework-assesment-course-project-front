"use client";

import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const TeacherLayout = ({
                           children,
                       }: { children: React.ReactNode }) => {

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const response = await axios.get('/api/users');
                if (!response.data) {
                    redirect("/");
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        };

        checkUserRole().then();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default TeacherLayout;