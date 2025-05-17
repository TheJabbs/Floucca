'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedPage = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must log in to access this page.</p>;
  if (!hasRole(allowedRoles)) return <p>Access denied.</p>;

  return <>{children}</>;
};
