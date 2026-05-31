"use client";

import { AppShell } from "@/components/music/AppShell";
import ProfileCard from "@/components/layout/ProfileCard";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { runWithViewTransition } from "@/lib/view-transition";
import MobileBackButton from "@/components/ui/MobileBackButton";

export default function ProfilePage() {
  const router = useRouter();

  const handleBack = async () => {
    try {
      await runWithViewTransition(() => {
        router.back();
      });
    } catch {
      router.back();
    }
  };

  return (
    <AppShell withPadding={true}>
      <div className="max-w-3xl mx-auto py-8 relative">
        {/* Mobile back button */}
        <MobileBackButton onClick={handleBack} />

        <h1
          className="text-2xl font-semibold text-white mb-6"
          style={{ fontFamily: "'Vazirmatn', sans-serif", direction: "rtl" }}
        >
          پروفایل
        </h1>

        {/*
          name and daysLeft would come from your API / context in production.
          For now they remain as static mock values.
        */}
        <ProfileCard name="علی رضایی" daysLeft={18} />
      </div>
    </AppShell>
  );
}
