import React from "react";
import { ProtectedPage } from "@/components/ProtectedPage";
import FormHeader from "@/components/headers/form-header";

export default function DataOperatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedPage allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
          <FormHeader />
      <main >{children}</main>
    </ProtectedPage>
  );
}