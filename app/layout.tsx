import "./globals.css";
import { Providers } from "@/app/providers";
import SessionGuard from "@/components/sessionGuard";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: 'Autolearn',
  description: 'Це вебдодаток для самостійного навчання студентів з автоперевіркою коду.'
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="uk" data-lt-installed="true" suppressHydrationWarning>
      <body>
      <Providers>
        <SessionGuard>
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </SessionGuard>
      </Providers>
      </body>
      </html>
  );
}