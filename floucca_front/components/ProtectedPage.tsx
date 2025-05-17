'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AccessDenied from '@/components/auth/access-denied';

export const ProtectedPage = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  const { user, loading, hasRole } = useAuth();

  // Loading state
  if (loading) {
    return <AccessDenied type="loading" />;
  }

  // Not logged in
  if (!user) {
    return (
      <AccessDenied 
        type="not-logged-in"
        title="Authentication Required"
        message="You need to log in to access this page."
        showLoginButton={true}
      />
    );
  }

  if (!hasRole(allowedRoles)) {
    const userRoles = user?.user_role?.map((ur: any) => ur?.roles?.role_name).filter(Boolean) || [];
    
    return (
      <AccessDenied 
        type="access-denied"
        title="Access Denied"
        message={`You don't have the required permissions to access this page. Your current role${userRoles.length > 1 ? 's' : ''}: ${userRoles.join(', ')}`}
        requiredRoles={allowedRoles}
        showLoginButton={false}
      />
    );
  }

  return <>{children}</>;
};