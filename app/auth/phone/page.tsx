"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── Iranian mobile number validator ───────────────────────────────────────
// Valid prefixes: 0910–0919, 0901, 0902, 0930–0939, 0941, 0920–0922,
//                0932, 0933, 0935–0937, 0990–0992, 0993 …
const IRAN_MOBILE_REGEX = /^09[0-9]{9}$/;

function validateIranPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "شماره موبایل را وارد کنید";
  if (digits.length < 11) return "شماره موبایل باید ۱۱ رقم باشد";
  if (!IRAN_MOBILE_REGEX.test(digits)) return "شماره موبایل معتبر نیست";
  return null;
}

// ─── Format as 0912 345 6789 ─────────────────────────────────────────────
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

// ─── Animation variants ───────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: ([0.22, 1, 0.36, 1] as unknown) as any },
  },
};

export default function PhonePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [rawValue, setRawValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const formatted = formatPhone(rawValue);
  const digits = rawValue.replace(/\D/g, "");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
    setRawValue(raw);
    if (touched) {
      setError(validateIranPhone(raw));
    }
  }

  function handleBlur() {
    setTouched(true);
    setError(validateIranPhone(rawValue));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const err = validateIranPhone(rawValue);
    if (err) {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    // Store phone in session (in a real app, use context / zustand / cookie)
    sessionStorage.setItem("auth_phone", digits);
    router.push("/auth/otp");
  }

  const isValid = !error && digits.length === 11;

  return (
    <motion.div
      className="w-full max-w-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(26, 26, 37, 0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Gold top bar */}
        <motion.div
          className="h-[2px] w-full"
          style={{ background: "linear-gradient(90deg, #C9A84C, #8B5CF6, #C9A84C)" }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ([0.22, 1, 0.36, 1] as unknown) as any }}
        />

        <div className="p-8">
          {/* Logo mark */}
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="relative">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(139,92,246,0.15))",
                  border: "1px solid rgba(201,168,76,0.25)",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4zm0 4a4 4 0 110 8 4 4 0 010-8zm0 17.2A8.8 8.8 0 017.6 21c.02-2.8 5.6-4.34 8.4-4.34s8.38 1.54 8.4 4.34A8.8 8.8 0 0116 25.2z"
                    fill="url(#logoGrad)"
                  />
                  <defs>
                    <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28">
                      <stop stopColor="#C9A84C" />
                      <stop offset="1" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-2xl -z-10 blur-lg opacity-40"
                style={{ background: "linear-gradient(135deg, #C9A84C, #8B5CF6)" }}
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1
              className="text-2xl font-bold mb-2"
              style={{
                color: "var(--text-primary, #E2E8F0)",
                fontFamily: "'Vazirmatn', sans-serif",
                direction: "rtl",
              }}
            >
              ورود به حساب کاربری
            </h1>
            <p
              className="text-sm"
              style={{
                color: "var(--text-secondary, #94A3B8)",
                fontFamily: "'Vazirmatn', sans-serif",
                direction: "rtl",
              }}
            >
              شماره موبایل خود را وارد کنید
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <motion.div variants={itemVariants} className="mb-6">
              <label
                className="block text-xs font-medium mb-2"
                style={{
                  color: "var(--text-secondary, #94A3B8)",
                  fontFamily: "'Vazirmatn', sans-serif",
                  direction: "rtl",
                  textAlign: "right",
                }}
              >
                شماره موبایل
              </label>

              {/* Input wrapper */}
              <motion.div
                animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                {/* +98 badge */}
                <div
                  className="absolute left-0 inset-y-0 flex items-center pl-4 pr-3 gap-2 select-none"
                  style={{
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Iran flag emoji as SVG-style */}
                  <span className="text-base leading-none">🇮🇷</span>
                  <span
                    className="text-sm font-mono"
                    style={{ color: "var(--accent-gold, #C9A84C)" }}
                  >
                    +98
                  </span>
                </div>

                <input
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  placeholder="0912 345 6789"
                  value={formatted}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  dir="ltr"
                  className="w-full h-14 rounded-xl text-base font-mono transition-all duration-200 outline-none"
                  style={{
                    paddingLeft: "88px",
                    paddingRight: "16px",
                    background: "rgba(37,37,53,0.6)",
                    border: `1.5px solid ${
                      error && touched
                        ? "rgba(244,114,182,0.6)"
                        : isValid
                        ? "rgba(16,185,129,0.5)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                    color: "var(--text-primary, #E2E8F0)",
                    letterSpacing: "0.05em",
                    boxShadow:
                      error && touched
                        ? "0 0 0 3px rgba(244,114,182,0.1)"
                        : isValid
                        ? "0 0 0 3px rgba(16,185,129,0.1)"
                        : "none",
                  }}
                />

                {/* Valid checkmark */}
                <AnimatePresence>
                  {isValid && (
                    <motion.div
                      className="absolute right-4 inset-y-0 flex items-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="rgba(16,185,129,0.2)" />
                        <path
                          d="M6 10l3 3 5-5"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {error && touched && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 text-xs flex items-center gap-1 justify-end"
                    style={{
                      color: "#F472B6",
                      fontFamily: "'Vazirmatn', sans-serif",
                      direction: "rtl",
                    }}
                  >
                    <span>{error}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="6" fill="rgba(244,114,182,0.2)" />
                      <path d="M6 3v4M6 8.5v.5" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full h-13 rounded-xl font-semibold text-sm relative overflow-hidden"
                style={{
                  height: "52px",
                  background: loading
                    ? "rgba(201,168,76,0.3)"
                    : "linear-gradient(135deg, #C9A84C, #8A6F2E)",
                  color: "#0A0A0F",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Vazirmatn', sans-serif",
                  fontSize: "15px",
                  border: "none",
                  boxShadow: loading ? "none" : "0 0 24px rgba(201,168,76,0.3)",
                }}
                whileHover={!loading ? { scale: 1.01, boxShadow: "0 0 32px rgba(201,168,76,0.45)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Shimmer effect */}
                {!loading && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                )}

                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    />
                    <span>در حال ارسال...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>دریافت کد تأیید</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer note */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xs mt-6 leading-relaxed"
            style={{
              color: "var(--text-muted, #4A5568)",
              fontFamily: "'Vazirmatn', sans-serif",
              direction: "rtl",
            }}
          >
            با ورود، با{" "}
            <span style={{ color: "var(--accent-gold, #C9A84C)" }}>
              قوانین و مقررات
            </span>{" "}
            موافقت می‌کنید
          </motion.p>
        </div>
      </div>

      {/* Vazirmatn font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
      `}</style>
    </motion.div>
  );
}
