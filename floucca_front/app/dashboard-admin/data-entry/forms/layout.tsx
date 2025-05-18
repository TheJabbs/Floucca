import { PortProvider } from "@/contexts/PortContext";
import { PeriodProvider } from "@/contexts/PeriodContext";
import Navbar from "@/components/navigators/form-admin";
import React from "react";

export default function DataOperatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortProvider>
      <PeriodProvider>
        <Navbar />
        <main>{children}</main>
      </PeriodProvider>
    </PortProvider>
  );
}