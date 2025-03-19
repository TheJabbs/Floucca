import type { Metadata } from "next";
import { Inter } from "next/font/google";
import FormHeader from "@/components/headers/form-header";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flouca Web",
  description: "Flouca Web Fish Landing System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FormHeader />
        {children}
      </body>
    </html>
  );
}