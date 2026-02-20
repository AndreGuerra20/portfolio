import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import { TrafficHeartbeat } from "@/components/TrafficHeartbeat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio André Guerra",
  description: "Welcome to my portfolio website showcasing my work and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          >
            <TrafficHeartbeat />
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
