import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/providers/auth-provider";
import { MessageProvider } from "@/providers/message-provider";
import "./globals.css";
import MessageDisplay from "@/components/MessageDisplay";
import { ModalProvider } from "@/providers/modal-provider";
import { ModalManager } from "@/components/modals/modal-manager";

export const metadata: Metadata = {
  title: "Santlux App",
  description: "Gerenciador de pedidos Santlux",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ModalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MessageProvider>
              <AuthProvider>
                {children}
                <ModalManager />
              </AuthProvider>
              <MessageDisplay />
            </MessageProvider>
          </ThemeProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
