'use client'

import Image from "next/image";
import OppsPageImageSrc from "@/public/opps-page.svg";
import React from "react";
import {useRouter} from "next/router";

export default function GlobalError({
                                        error,
                                    }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const { back } = useRouter();

    return (
        <html>
            <body>
                <div className="h-screen flex flex-col items-center justify-center text-center">
                    <Image
                        src={OppsPageImageSrc}
                        alt="Помилка опрацювання даних"
                        width={400}
                        height={300}
                        className="max-w-full h-auto"
                    />
                    <h1 className="text-2xl font-bold uppercase">Щось пішло не так!</h1>
                    <p className="mt-2 text-md text-muted-foreground">
                        {error.message || "Ми вибачаємося за незручності. Спробуйте оновити сторінку або зверніться до служби підтримки."}
                    </p>
                    <button onClick={() => back()} className="mt-4 text-blue-500">Повернутися назад</button>
                </div>
            </body>
        </html>
    )
}