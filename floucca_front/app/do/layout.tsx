import { PortProvider } from "@/contexts/PortContext";
import { ProtectedPage } from "@/components/ProtectedPage";
import Navbar from "@/components/navigators/nav-bar-form";
import React from "react";
import FormHeader from "@/components/headers/form-header";

export default function DataOperatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedPage allowedRoles={["ADMIN", "SUPER_ADMIN", "DATA_OPERATOR"]}>
      <PortProvider>
        <FormHeader />
        <Navbar />
        <main>{children}</main>
      </PortProvider>
    </ProtectedPage>
  );
}
