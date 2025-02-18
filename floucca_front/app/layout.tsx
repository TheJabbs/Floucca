import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigators/nav-bar-form";
import FormHeader from "@/components/headers/form-header";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Operators",
  description: "Collection Data from the field",
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
      <Navbar />
      <main>{children}</main>
      </body>
      </html>
  );
}
