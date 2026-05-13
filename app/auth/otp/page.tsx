"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// ─── Mock OTP ─────────────────────────────────────────────────────────────
const MOCK_OTP = "123456";
const RESEND_COOLDOWN = 90; // seconds

// ─── Animation variants ───────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: ([0.22, 1, 0.36, 1] as unknown) as any },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatSeconds(s: number): string {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function maskPhone(phone: string): string {
  if (!phone) return "09xx xxx xxxx";
  return phone.replace(/^(09\d{2})(\d{3})(\d{4})$/, "$1 *** $3");
}

// ─── Component ────────────────────────────────────────────────────────────
export default function OtpPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { saveSession } = useAuth();

  // Load phone from session
  useEffect(() => {
    const stored = sessionStorage.getItem("auth_phone") ?? "";
    setPhone(stored);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const verifyOtp = useCallback(
    async (value: string) => {
      if (status === "loading" || status === "success") return;
      setError(null);
      setStatus("loading");

      // Simulate network latency
      await new Promise((r) => setTimeout(r, 900));

      if (value === MOCK_OTP) {
        setStatus("success");
        try {
          saveSession(phone || "");
        } catch {
          // ignore
        }
        // Navigate after success animation
        setTimeout(() => {
          router.push("/");
        }, 1600);
      } else {
        setStatus("error");
        setAttempts((a) => a + 1);
        setError(
          attempts >= 2
            ? "کد اشتباه است. آیا می‌خواهید کد جدیدی دریافت کنید؟"
            : "کد وارد شده صحیح نیست"
        );
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setStatus("idle");
          setOtp("");
        }, 600);
      }
    },
    [status, attempts, router, saveSession, phone]
  );

  async function handleResend() {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError(null);
    setOtp("");
    setAttempts(0);
    await new Promise((r) => setTimeout(r, 1000));
    setCooldown(RESEND_COOLDOWN);
    setResending(false);
    setStatus("idle");
  }

  const slotBorderColor =
    status === "success"
      ? "rgba(16,185,129,0.7)"
      : status === "error"
      ? "rgba(244,114,182,0.7)"
      : "rgba(201,168,76,0.4)";

  const slotGlow =
    status === "success"
      ? "0 0 16px rgba(16,185,129,0.25)"
      : status === "error"
      ? "0 0 16px rgba(244,114,182,0.25)"
      : "0 0 16px rgba(201,168,76,0.15)";

  return (
    <motion.div
      className="w-full max-w-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(26, 26, 37, 0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 4px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Animated top bar */}
        <motion.div
          className="h-[2px] w-full"
          style={{
            background:
              status === "success"
                ? "linear-gradient(90deg, #10B981, #10B981)"
                : status === "error"
                ? "linear-gradient(90deg, #F472B6, #8B5CF6)"
                : "linear-gradient(90deg, #8B5CF6, #C9A84C, #8B5CF6)",
          }}
          animate={{ backgroundPosition: status === "loading" ? ["0% 50%", "100% 50%"] : "0% 50%" }}
          transition={{ duration: 1.5, repeat: status === "loading" ? Infinity : 0 }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
        />

        <div className="p-8">
          {/* Back button */}
          <motion.button
            variants={itemVariants}
            onClick={() => router.back()}
            className="flex items-center gap-1.5 mb-6 group"
            style={{
              color: "var(--text-secondary, #94A3B8)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Vazirmatn', sans-serif",
              fontSize: "13px",
              direction: "rtl",
            }}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="rotate-180"
            >
              <path
                d="M3 7h8M7 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>بازگشت</span>
          </motion.button>

          {/* Icon */}
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    boxShadow: "0 0 32px rgba(16,185,129,0.2)",
                  }}
                >
                  <motion.svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                  >
                    <motion.path
                      d="M8 16l5 5 11-10"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </motion.svg>
                </motion.div>
              ) : (
                <motion.div
                  key="sms"
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(201,168,76,0.15))",
                    border: "1px solid rgba(201,168,76,0.2)",
                  }}
                  animate={
                    status === "loading"
                      ? { boxShadow: ["0 0 0px rgba(201,168,76,0.2)", "0 0 24px rgba(201,168,76,0.4)", "0 0 0px rgba(201,168,76,0.2)"] }
                      : {}
                  }
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path
                      d="M4 6h22a2 2 0 012 2v12a2 2 0 01-2 2H9l-5 4V8a2 2 0 012-2z"
                      stroke="url(#smsGrad)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M10 12h10M10 16h6" stroke="url(#smsGrad)" strokeWidth="1.8" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="smsGrad" x1="4" y1="6" x2="28" y2="24">
                        <stop stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#C9A84C" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-2">
            <h1
              className="text-2xl font-bold"
              style={{
                color: "var(--text-primary, #E2E8F0)",
                fontFamily: "'Vazirmatn', sans-serif",
                direction: "rtl",
              }}
            >
              {status === "success" ? "ورود موفق!" : "تأیید شماره موبایل"}
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-8">
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "var(--text-secondary, #94A3B8)",
                fontFamily: "'Vazirmatn', sans-serif",
                direction: "rtl",
              }}
            >
              {status === "success" ? (
                "در حال ورود به صفحه اصلی..."
              ) : (
                <>
                  کد ۶ رقمی ارسال شده به{" "}
                  <span
                    className="font-mono"
                    style={{ color: "var(--accent-gold, #C9A84C)" }}
                  >
                    {maskPhone(phone)}
                  </span>{" "}
                  را وارد کنید
                </>
              )}
            </p>
          </motion.div>

          {/* OTP Input */}
          <motion.div variants={itemVariants}>
            <motion.div
              animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.45 }}
              className="flex justify-center mb-4"
            >
              <style jsx global>{`
                /* Override shadcn InputOTP slots to match theme */
                [data-slot="input-otp-slot"] {
                  width: 48px !important;
                  height: 56px !important;
                  font-size: 22px !important;
                  font-weight: 600 !important;
                  border-radius: 12px !important;
                  background: rgba(37, 37, 53, 0.7) !important;
                  border: 1.5px solid rgba(255,255,255,0.08) !important;
                  color: #E2E8F0 !important;
                  transition: border-color 0.2s, box-shadow 0.2s !important;
                  font-family: 'SF Mono', 'Fira Code', monospace !important;
                }
                [data-slot="input-otp-slot"][data-active="true"] {
                  border-color: ${slotBorderColor} !important;
                  box-shadow: ${slotGlow} !important;
                }
                [data-slot="input-otp-slot"][data-filled="true"] {
                  border-color: ${slotBorderColor} !important;
                  background: rgba(37,37,53,0.95) !important;
                }
                [data-slot="input-otp-group"] {
                  gap: 8px !important;
                }
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
              `}</style>

              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={status === "loading" || status === "success"}
              >
                <InputOTPGroup dir="ltr">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </motion.div>

            {/* Loading dots */}
            <AnimatePresence>
              {status === "loading" && (
                <motion.div
                  className="flex justify-center gap-1 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#C9A84C" }}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && status !== "loading" && (
                <motion.div
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  className="text-center mb-4"
                >
                  <p
                    className="text-xs"
                    style={{
                      color: "#F472B6",
                      fontFamily: "'Vazirmatn', sans-serif",
                      direction: "rtl",
                    }}
                  >
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Resend section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-3 mt-6"
          >
            {cooldown > 0 ? (
              <div className="flex items-center gap-2">
                {/* Arc timer */}
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 8}`}
                    strokeDashoffset={`${2 * Math.PI * 8 * (1 - cooldown / RESEND_COOLDOWN)}`}
                    style={{ transformOrigin: "center", rotate: "-90deg" }}
                    transform="rotate(-90 10 10)"
                  />
                </svg>
                <span
                  className="text-sm font-mono"
                  style={{
                    color: "var(--text-secondary, #94A3B8)",
                    fontFamily: "'Vazirmatn', sans-serif",
                    direction: "rtl",
                  }}
                >
                  ارسال مجدد تا{" "}
                  <span style={{ color: "var(--accent-gold, #C9A84C)" }}>
                    {formatSeconds(cooldown)}
                  </span>
                </span>
              </div>
            ) : (
              <motion.button
                onClick={handleResend}
                disabled={resending}
                className="text-sm flex items-center gap-1.5"
                style={{
                  color: resending ? "var(--text-muted)" : "var(--accent-gold, #C9A84C)",
                  background: "none",
                  border: "none",
                  cursor: resending ? "not-allowed" : "pointer",
                  fontFamily: "'Vazirmatn', sans-serif",
                  direction: "rtl",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {resending ? (
                  <>
                    <motion.div
                      className="w-3 h-3 rounded-full border border-current border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    />
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M12 2v4H8M2 12v-4h4M12 6A5 5 0 002.5 9M2 8a5 5 0 009.5-3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>ارسال مجدد کد</span>
                  </>
                )}
              </motion.button>
            )}

            {/* Dev hint */}
            <motion.div
              className="mt-2 px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(201,168,76,0.06)",
                border: "1px dashed rgba(201,168,76,0.2)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p
                className="text-[11px] font-mono"
                style={{ color: "rgba(201,168,76,0.6)", direction: "ltr" }}
              >
                🔧 dev mode · OTP: <strong style={{ color: "#C9A84C" }}>123456</strong>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
