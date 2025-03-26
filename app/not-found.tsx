import React from 'react';
import Image from "next/image";
import NotFoundPageImageSrc from "@/public/404-page.svg";
import {Navbar} from "@/app/(dashboard)/_components/navbar";
import {Sidebar} from "@/app/(dashboard)/_components/sidebar";

const NotFound = () => {
    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            <div className="hidden md:!flex h-full w-56 fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-56 h-full">
                <div className="flex flex-col items-center justify-center text-center h-screen">
                    <Image
                        src={NotFoundPageImageSrc}
                        alt="Сторінка не існує"
                        width={600}
                        height={400}
                        className="max-w-full h-auto"
                    />
                    <div className="text-center mt-10">
                        <h1 className="text-2xl font-bold uppercase">404 - Сторінку не знайдено</h1>
                        <p className="mt-2 text-md text-muted-foreground">
                            Перевірте правильність адреси або поверніться на головну.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFound;