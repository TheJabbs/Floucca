"use client";

import React, { ReactNode } from "react";
import { FormsDataProvider } from "@/contexts/FormDataContext";

interface FormsLayoutProps {
  children: ReactNode;
}

export default function FormsLayout({ children }: FormsLayoutProps) {
  return (
    <FormsDataProvider>
      {children}
    </FormsDataProvider>
  );
}