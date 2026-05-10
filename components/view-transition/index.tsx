"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Minimal View Transition provider and helpers using the native
// `document.startViewTransition` API where available. This avoids
// adding an external dependency and works in modern browsers.

export function ViewTransitionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useViewTransitionNavigate() {
  const router = useRouter();

  async function navigate(href: string) {
    if (typeof document !== "undefined" && (document as any).startViewTransition) {
      try {
        // startViewTransition accepts a callback where DOM updates happen
        await (document as any).startViewTransition(() => {
          // Use router.push to change route
          router.push(href);
          return Promise.resolve();
        });
      } catch (e) {
        // fallback to router push
        router.push(href);
      }
    } else {
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
