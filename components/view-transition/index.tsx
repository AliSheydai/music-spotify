"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { runWithViewTransition } from "@/lib/view-transition";

// Minimal View Transition provider and helpers using the native
// `document.startViewTransition` API where available. This avoids
// adding an external dependency and works in modern browsers.

export function ViewTransitionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useViewTransitionNavigate() {
  const router = useRouter();

  async function navigate(href: string) {
    try {
      await runWithViewTransition(() => {
        router.push(href);
      });
    } catch {
      router.push(href);
    }
  }

  return { navigate };
}

export function TransitionLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const { navigate } = useViewTransitionNavigate();
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

export default ViewTransitionProvider;

export function TransitoinBackButton() {
  const router = useRouter();

  // تابع برای رفتن به مسیر مشخص
  async function navigate(href: string) {
    await runWithViewTransition(() => {
      router.push(href);
    });
  }

  // تابع جدید برای برگشت به عقب
  async function back() {
    await runWithViewTransition(() => {
      router.back();
    });
  }

  return { navigate, back };
}
