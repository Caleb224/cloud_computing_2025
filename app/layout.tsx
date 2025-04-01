import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { AuthenticationProvider } from "@/components/providers/AuthenticationProvider";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cloud Computing 2025",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthenticationProvider>
          <SessionProvider>{children}</SessionProvider>
        </AuthenticationProvider>
      </body>
    </html>
  );
}
