"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { runWithViewTransition } from "@/lib/view-transition";

export default function MobileBackButton({ onClick, className }: { onClick?: () => void | Promise<void>; className?: string }) {
  const router = useRouter();

  const handle = async () => {
    if (onClick) {
      try {
        await onClick();
      } catch {
        // ignore
      }
      return;
    }

    try {
      await runWithViewTransition(() => router.back());
    } catch {
      router.back();
    }
  };

  return (
    <button onClick={handle} className={`absolute top-5 left-5 z-50 md:hidden ${className ?? ""}`}>
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface/50 text-gray-300 hover:text-white transition-all">
        <ArrowLeft className="w-4 h-4" />
      </div>
    </button>
  );
}
