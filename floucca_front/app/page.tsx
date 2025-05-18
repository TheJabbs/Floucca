"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Fish } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading, user, hasRole } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // User is not authenticated, redirect to login
        router.replace("/login");
      } else {
        // User is authenticated, redirect based on role
        const userRoles = user?.user_role.map(
            (role: { roles: { role_name: string } }) => role.roles.role_name
            );

        if (userRoles?.includes("Super Admin") || userRoles?.includes("Administrator")) {
          router.replace("/dashboard-admin");
        } else if (userRoles?.includes("Data Operator")) {
          router.replace("/do");
        }
      }
    }
  }, [isAuthenticated, loading, user, router]);

  // Show loading state while determining redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full animate-pulse">
            <Fish className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">FLOUCA</h1>
        <p className="text-gray-600 mb-4">Fish Landing System</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Initializing...</p>
      </div>
    </div>
  );
}