"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "lm_auth_user";
const AUTH_PHONE_KEY = "auth_phone";
const AUTH_STORAGE_EVENT = "lm-auth-storage-change";

export interface AuthUser {
  phone: string;
  name?: string;
  loggedInAt: number; // timestamp
}

function notifyAuthSubscribers() {
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

function subscribeToAuthChanges(onStoreChange: () => void) {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === AUTH_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener(AUTH_STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(AUTH_STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function parseAuthUser(raw: string | null): AuthUser | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (typeof parsed.phone !== "string" || typeof parsed.loggedInAt !== "number") {
      return null;
    }

    return {
      phone: parsed.phone,
      name: typeof parsed.name === "string" ? parsed.name : undefined,
      loggedInAt: parsed.loggedInAt,
    };
  } catch {
    return null;
  }
}

function getAuthSnapshot() {
  return localStorage.getItem(AUTH_KEY);
}

function getServerAuthSnapshot() {
  return null;
}

export function useAuth() {
  const router = useRouter();
  const rawUser = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );
  const user = useMemo(() => parseAuthUser(rawUser), [rawUser]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(AUTH_PHONE_KEY);
      notifyAuthSubscribers();
    } catch {
      // ignore
    }

    router.replace("/auth/phone");
  }, [router]);

  /** Call this after OTP is verified to persist the session */
  const saveSession = useCallback((phone: string, name?: string) => {
    const authUser: AuthUser = { phone, name, loggedInAt: Date.now() };

    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      notifyAuthSubscribers();
    } catch {
      // ignore
    }
  }, []);

  const loading = false;
  const isLoggedIn = user !== null;

  return { user, loading, isLoggedIn, logout, saveSession };
}
