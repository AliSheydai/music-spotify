"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import AvatarPicker from "../ui/select-avatar";
import { Dialog, DialogContent } from "../ui/dialog";
import { Sheet, SheetContent } from "../ui/sheet";
import { User, Phone, Crown, LogOut, RefreshCw, ChevronRight, Sparkles, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "lm_profile_image";
const SUBSCRIPTION_TOTAL_DAYS = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  return phone;
}

function getSubscriptionColor(daysLeft: number): string {
  if (daysLeft <= 3) return "#F472B6";
  if (daysLeft <= 7) return "#F59E0B";
  return "#10B981";
}

// ─── Stagger variants ──────────────────────────────────────────────────────
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: ([0.22, 1, 0.36, 1] as unknown) as any } },
};

// ─── Guest View ────────────────────────────────────────────────────────────
function GuestCard() {
  return (
    <motion.div
      className="max-w-md mx-auto text-center"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: ([0.22, 1, 0.36, 1] as unknown) as any }}
    >
      <div
        className="relative rounded-2xl overflow-hidden p-10"
        style={{
          background: "rgba(26, 26, 37, 0.8)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Top shimmer border */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)" }}
        />

        {/* Lock icon with glow */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(139,92,246,0.12))",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
              animate={{ boxShadow: ["0 0 0px rgba(201,168,76,0)", "0 0 28px rgba(201,168,76,0.2)", "0 0 0px rgba(201,168,76,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Lock className="w-8 h-8" style={{ color: "#C9A84C" }} />
            </motion.div>
          </div>
        </div>

        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "#E2E8F0", fontFamily: "'Vazirmatn', sans-serif", direction: "rtl" }}
        >
          وارد حساب خود شوید
        </h2>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: "#94A3B8", fontFamily: "'Vazirmatn', sans-serif", direction: "rtl" }}
        >
          برای مشاهده پروفایل و مدیریت اشتراک، ابتدا وارد شوید
        </p>

        <Link href="/auth/phone">
          <motion.div
            className="relative overflow-hidden w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #8A6F2E)",
              color: "#0A0A0F",
              fontFamily: "'Vazirmatn', sans-serif",
              boxShadow: "0 0 20px rgba(201,168,76,0.25)",
            }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(201,168,76,0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
            />
            <User className="w-4 h-4" />
            <span>ورود / ثبت‌نام</span>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export function ProfileCard({
  name = "کاربر",
  daysLeft = 12,
}: {
  name?: string;
  daysLeft?: number;
}) {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setImageSrc(stored);
    } catch { /* ignore */ }

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
    try { localStorage.setItem(STORAGE_KEY, dataUrl); } catch { /* ignore */ }
    setImageSrc(dataUrl);
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto">
        <div
          className="rounded-2xl p-8 animate-pulse"
          style={{ background: "rgba(26,26,37,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-white/5" />
            <div className="w-32 h-4 rounded bg-white/5" />
            <div className="w-48 h-3 rounded bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return <GuestCard />;

  const phone = user?.phone ?? "";
  const subColor = getSubscriptionColor(daysLeft);
  const progress = Math.max(0, Math.min(100, (daysLeft / SUBSCRIPTION_TOTAL_DAYS) * 100));
  const displayName = user?.name ?? name;

  return (
    <motion.div
      className="max-w-md mx-auto space-y-3"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      {/* ── Hero card ────────────────────────────────────────── */}
      <motion.div
        variants={rowVariants}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(26, 26, 37, 0.85)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Gold shimmer top border */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: "linear-gradient(90deg, transparent 0%, #C9A84C 40%, #8B5CF6 60%, transparent 100%)" }}
        />

        {/* Ambient glow behind avatar */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)" }}
        />

        <div className="px-6 pt-8 pb-6 flex flex-col items-center gap-4">
          {/* Avatar */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => setOpen(true)}
                  className="relative group"
                  aria-label="انتخاب آواتار پروفایل"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    className="rounded-full p-[2px]"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #8B5CF6)" }}
                  >
                    <div
                      className="rounded-full p-1"
                      style={{ background: "#111118" }}
                    >
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={imageSrc ?? undefined} alt={displayName} />
                        <AvatarFallback style={{ background: "rgba(37,37,53,1)" }}>
                          <User className="w-10 h-10 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  {/* Edit badge */}
                  <div
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "#C9A84C" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 9l2-2L8 2 8 2 6 0 0 6 0 9h1zM7 1l2 2" stroke="#0A0A0F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="top">تغییر تصویر پروفایل</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Name */}
          <div className="text-center">
            <h2
              className="text-xl font-bold"
              style={{ color: "#E2E8F0", fontFamily: "'Vazirmatn', sans-serif", direction: "rtl" }}
            >
              {displayName}
            </h2>
          </div>

          {/* Phone row */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: "rgba(37,37,53,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
            <span
              className="text-sm font-mono tracking-wider"
              style={{ color: "#94A3B8", direction: "ltr" }}
            >
              {formatPhone(phone)}
            </span>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={open && !isMobile} onOpenChange={setOpen}>
          <DialogContent>
            <div className="py-2">
              <AvatarPicker onConfirm={handleConfirm} onCancel={() => setOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
        <Sheet open={open && isMobile} onOpenChange={setOpen}>
          <SheetContent side="bottom">
            <div className="py-2">
              <AvatarPicker onConfirm={handleConfirm} onCancel={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>

      {/* ── Subscription card ────────────────────────────────── */}
      <motion.div
        variants={rowVariants}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(26, 26, 37, 0.85)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <Crown className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "#E2E8F0", fontFamily: "'Vazirmatn', sans-serif", direction: "rtl" }}
              >
                اشتراک فعال
              </span>
            </div>
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono"
              style={{
                background: `${subColor}18`,
                border: `1px solid ${subColor}35`,
                color: subColor,
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>{daysLeft} روز</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${subColor}80, ${subColor})` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3, ease: ([0.22, 1, 0.36, 1] as unknown) as any }}
              />
            </div>
          </div>

          <p
            className="text-xs mb-4"
            style={{ color: "#4A5568", fontFamily: "'Vazirmatn', sans-serif", direction: "rtl" }}
          >
            {daysLeft} روز از {SUBSCRIPTION_TOTAL_DAYS} روز باقی مانده
          </p>

          {/* Renew button */}
          <motion.button
            onClick={() => window.alert("شروع فرآیند تمدید اشتراک...")}
            className="relative w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #8A6F2E)",
              color: "#0A0A0F",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Vazirmatn', sans-serif",
              boxShadow: "0 0 20px rgba(201,168,76,0.2)",
            }}
            whileHover={{ scale: 1.01, boxShadow: "0 0 28px rgba(201,168,76,0.35)" }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            />
            <RefreshCw className="w-4 h-4" />
            <span>تمدید اشتراک</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Logout card ──────────────────────────────────────── */}
      <motion.div variants={rowVariants}>
        <AnimatePresence mode="wait">
          {!logoutConfirm ? (
            <motion.button
              key="logout-btn"
              onClick={() => setLogoutConfirm(true)}
              className="w-full rounded-2xl flex items-center justify-between px-5 py-4 group"
              style={{
                background: "rgba(26,26,37,0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
              whileHover={{
                borderColor: "rgba(244,114,182,0.2)",
                boxShadow: "0 4px 24px rgba(244,114,182,0.05)",
              }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: "rgba(244,114,182,0.08)",
                    border: "1px solid rgba(244,114,182,0.15)",
                  }}
                >
                  <LogOut className="w-3.5 h-3.5" style={{ color: "#F472B6" }} />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: "#94A3B8",
                    fontFamily: "'Vazirmatn', sans-serif",
                    direction: "rtl",
                  }}
                >
                  خروج از حساب
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-30 rotate-180" style={{ color: "#94A3B8" }} />
            </motion.button>
          ) : (
            <motion.div
              key="logout-confirm"
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(26,26,37,0.95)",
                border: "1px solid rgba(244,114,182,0.2)",
                boxShadow: "0 0 24px rgba(244,114,182,0.06)",
              }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-5">
                <p
                  className="text-sm text-center mb-4"
                  style={{
                    color: "#E2E8F0",
                    fontFamily: "'Vazirmatn', sans-serif",
                    direction: "rtl",
                  }}
                >
                  از خروج اطمینان دارید؟
                </p>
                <div className="flex gap-2">
                  <motion.button
                    onClick={logout}
                    className="flex-1 h-10 rounded-xl text-sm font-semibold"
                    style={{
                      background: "rgba(244,114,182,0.12)",
                      border: "1px solid rgba(244,114,182,0.3)",
                      color: "#F472B6",
                      cursor: "pointer",
                      fontFamily: "'Vazirmatn', sans-serif",
                    }}
                    whileHover={{ background: "rgba(244,114,182,0.2)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    خروج
                  </motion.button>
                  <motion.button
                    onClick={() => setLogoutConfirm(false)}
                    className="flex-1 h-10 rounded-xl text-sm font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#94A3B8",
                      cursor: "pointer",
                      fontFamily: "'Vazirmatn', sans-serif",
                    }}
                    whileHover={{ background: "rgba(255,255,255,0.08)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    انصراف
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default ProfileCard;
