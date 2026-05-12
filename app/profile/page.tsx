"use client";

import { AppShell } from "../../components/music/AppShell";
import ProfileCard from "../../components/layout/ProfileCard";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  // For now we render static/mock values as requested
  const handleBack = async () => {
    if (typeof document !== "undefined" && (document as any).startViewTransition) {
      try {
        await (document as any).startViewTransition(() => {
          router.back();
          return Promise.resolve();
        });
      } catch (e) {
        router.back();
      }
    } else {
      router.back();
    }
  };
  return (
    <AppShell withPadding={true}>
      <div className="max-w-3xl mx-auto py-8 relative">
        <button onClick={handleBack} className="absolute top-5 left-5 z-50 md:hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface/50 text-gray-300 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
        </button>

        <h1 className="text-2xl font-semibold text-white mb-6">پروفایل</h1>

        <ProfileCard name="علی رضایی" daysLeft={18} />
      </div>
    </AppShell>
  );
}
