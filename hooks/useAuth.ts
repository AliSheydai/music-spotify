"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "lm_auth_user";

export interface AuthUser {
  phone: string;
  name?: string;
  loggedInAt: number; // timestamp
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem("auth_phone");
    } catch {
      // ignore
    }
    setUser(null);
    router.replace("/auth/phone");
  }, [router]);

  /** Call this after OTP is verified to persist the session */
  const saveSession = useCallback((phone: string, name?: string) => {
    const authUser: AuthUser = { phone, name, loggedInAt: Date.now() };
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    } catch {
      // ignore
    }
    setUser(authUser);
  }, []);

  const isLoggedIn = !loading && user !== null;

  return { user, loading, isLoggedIn, logout, saveSession };
}
