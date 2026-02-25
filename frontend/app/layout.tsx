import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/providers/auth-provider";
import { MessageProvider } from "@/providers/MessageProvider";
import "./globals.css";
import MessageDisplay from "@/components/MessageDisplay";

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MessageProvider>
            <AuthProvider>{children}</AuthProvider>
            <MessageDisplay />
          </MessageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
