import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import { Providers } from "./components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexGen.AI",
  description: "Your Intelligent Companion for Smarter Conversations.",
  authors: "Surya teja",
  role: "Senior Frontend Developer"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <LayoutWithNavbar>{children}</LayoutWithNavbar>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
