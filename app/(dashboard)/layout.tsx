import {Sidebar} from "./_components/sidebar";
import {Navbar} from "./_components/navbar";
import React from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Курси користувача',
    description: 'Це панель керування, де ви можете переглядати курси та їх прогрес.'
};

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
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
    )
}

export default DashboardLayout;