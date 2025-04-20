"use client";

import React from "react";
import Image from "next/image";
import OppsPageImageSrc from "@/public/opps-page.svg";

export const ErrorPage = () => {
    return (
        <div className="pt-[80px] flex flex-col items-center justify-center text-center">
            <Image
                src={OppsPageImageSrc}
                alt="Сторінка недоступна"
                height={300}
                priority
                className="max-w-full h-auto self-center"
            />
            <div className="text-center mt-10">
                <h1 className="text-2xl font-bold uppercase">Щось пішло не так!</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    Ми вибачаємося за незручності. Спробуйте оновити сторінку або зверніться до служби підтримки.
                </p>
            </div>
        </div>
    );
};