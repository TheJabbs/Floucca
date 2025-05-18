'use client';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not logged in');
        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const hasRole = (allowedRoles: string[] = []) => {
    if (!user || !user.user_role) return false;
    const roleMap: Record<string, string> = {
      "Administrator": "ADMIN",
      "Super Admin": "SUPER_ADMIN",
      "Data Operator": "DATA_OPERATOR",
    };
    const roleCodes = user.user_role.map((ur: any) =>
      roleMap[ur?.roles?.role_name] ?? undefined
    );
    console.log("Extracted role codes:", roleCodes);
    return roleCodes.some((r: string | undefined) => allowedRoles.includes(r!));
  };
  
  

  return { user, loading, hasRole, isAuthenticated };
};
