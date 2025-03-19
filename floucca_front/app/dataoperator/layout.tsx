import { PortProvider } from "@/contexts/PortContext";
import Navbar from "@/components/navigators/nav-bar-form";
import React from "react";

export default function DataOperatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortProvider>
      <Navbar />
      <main >{children}</main>
    </PortProvider>
  );
}