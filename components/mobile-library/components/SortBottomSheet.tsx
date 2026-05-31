"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { LibrarySort } from "@/store/library-store";
import { SORT_LABELS } from "../hooks/useMobileLibrary";

interface SortBottomSheetProps {
  open: boolean;
  currentSort: LibrarySort;
  onSelect: (sort: LibrarySort) => void;
  onClose: () => void;
}

const SORT_OPTIONS = Object.entries(SORT_LABELS) as [LibrarySort, string][];

export function SortBottomSheet({
  open,
  currentSort,
  onSelect,
  onClose,
}: SortBottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-elevated rounded-t-2xl overflow-hidden"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-bg-overlay" />
            </div>

            {/* Title */}
            <div className="text-center py-3 border-b border-border-subtle">
              <span className="text-base font-bold text-text-primary">
                به‌ترتیب
              </span>
            </div>

            {/* Options */}
            <div className="py-2 pb-safe">
              {SORT_OPTIONS.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => onSelect(key)}
                  className="w-full flex items-center justify-between px-6 py-4 text-right active:bg-bg-overlay transition-colors"
                >
                  <span
                    className={`text-base ${
                      currentSort === key
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    {label}
                  </span>
                  {currentSort === key && (
                    <Check className="w-5 h-5 text-accent-emerald shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
