import "./global.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EDUCHAT AI — Your School Assistant",
  description: "AI-powered assistant for Coppin State University students and applicants.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
