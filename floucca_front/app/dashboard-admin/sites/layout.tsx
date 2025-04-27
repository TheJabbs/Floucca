import Navbar from "@/components/navigators/nav-bar-sites";
import React from "react";

export default function DataOperatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
