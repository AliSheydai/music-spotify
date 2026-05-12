"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import AvatarPicker from "../ui/select-avatar";
import { Dialog, DialogContent } from "../ui/dialog";
import { Sheet, SheetContent } from "../ui/sheet";

const STORAGE_KEY = "lm_profile_image";

export function ProfileCard({
  name = "کاربر",
  daysLeft = 12,
}: {
  name?: string;
  daysLeft?: number;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setImageSrc(stored);
    } catch (e) {
      // ignore
    }

    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setImageSrc(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleConfirm = (dataUrl: string | null) => {
    if (!dataUrl) return;
    try {
      localStorage.setItem(STORAGE_KEY, dataUrl);
    } catch (e) {
      // ignore
    }
    setImageSrc(dataUrl);
    setOpen(false);
  };

  return (
    <div className="max-w-md mx-auto bg-bg-surface/80 border border-white/6 rounded-xl p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setOpen(true)}
                className="p-1 rounded-full hover:opacity-95"
                aria-label="انتخاب عکس پروفایل"
              >
                <div className="rounded-full border-2 border-gray-600 flex items-center justify-center p-2">
                    <Avatar className="h-24 w-24">
                    {imageSrc ? (
                      <AvatarImage src={imageSrc} alt={name} />
                    ) : (
                      <AvatarImage src="/images/avatar-placeholder.png" alt={name} />
                    )}
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </button>
            </TooltipTrigger>

            <TooltipContent side="top">انتخاب عکس پروفایل</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="text-white font-semibold text-lg">{name}</div>

        <div className="text-sm text-gray-300">{daysLeft} روز تا پایان اشتراک باقی مانده</div>

        <div className="pt-2">
          <button
            onClick={() => window.alert("شروع فرآیند تمدید اشتراک...")}
            className="px-4 py-2 rounded-lg bg-accent-gold text-black font-medium hover:opacity-95 cursor-pointer"
          >
            تمدید اشتراک
          </button>
        </div>

        {/* Dialog for desktop */}
        <Dialog open={open && !isMobile} onOpenChange={setOpen}>
          <DialogContent>
            <div className="py-2">
              <AvatarPicker onConfirm={handleConfirm} onCancel={() => setOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Sheet (bottom) for mobile */}
        <Sheet open={open && isMobile} onOpenChange={setOpen}>
          <SheetContent side="bottom">
            <div className="py-2">
              <AvatarPicker onConfirm={handleConfirm} onCancel={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default ProfileCard;
