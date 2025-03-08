import "./globals.css";
import {Providers} from "@/app/providers";
import SessionGuard from "@/components/sessionGuard";
import {ConfettiProvider} from "@/components/providers/confetti-provider";
import {ToastProvider} from "@/components/providers/toaster-provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
        lang="ua"
        data-lt-installed="true"
    >
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
