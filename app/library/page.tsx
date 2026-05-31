"use client";

import { MobileLibrary } from "@/components/mobile-library";
import { AppShell } from "@/components/music/AppShell";

export default function LibraryPage() {
  return (
    <AppShell withPadding={false} transparentBg={true} contentClassName="h-full min-h-0">
      <div className="h-full min-h-0 md:hidden">
        <MobileLibrary />
      </div>
      <div className="hidden h-full min-h-0 items-center justify-center px-6 text-center md:flex">
        <div className="max-w-md rounded-2xl border border-border-default bg-bg-surface/80 p-8 shadow-[var(--shadow-card)]">
          <h1 className="mb-3 text-2xl font-bold text-text-primary">کتابخانه شما</h1>
          <p className="text-sm leading-7 text-text-secondary">
            در نمایش دسکتاپ، کتابخانه از طریق سایدبار سمت چپ در دسترس است. در موبایل همین مسیر از تب پایین، کتابخانه موبایل را باز می‌کند.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
