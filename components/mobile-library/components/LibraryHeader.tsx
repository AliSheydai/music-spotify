"use client";

import { Search, X, Plus, User, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { LibrarySort } from "@/store/library-store";
import type { RefObject } from "react";
import NextLink from "next/link";
import { Avatar } from "@/components/ui/avatar";

interface LibraryHeaderProps {
  sort: LibrarySort;
  isGridView: boolean;
  searchOpen: boolean;
  searchQuery: string;
  searchInputRef: RefObject<HTMLInputElement>;
  onSearchOpen: () => void;
  onSearchClose: () => void;
  onSearchChange: (q: string) => void;
  onSortOpen: () => void;
  onToggleView: () => void;
  onCreatePlaylist: () => void;
}

export function LibraryHeader({
  searchOpen,
  searchQuery,
  searchInputRef,
  onSearchOpen,
  onSearchClose,
  onSearchChange,
  onCreatePlaylist,
}: LibraryHeaderProps) {
  return (
    // ارتفاع ثابت + relative → هیچ layout shift نخواهیم داشت
    <div className="relative px-4 pt-4 pb-3 h-18" style={{ minHeight: "4.5rem" }}>

      {/* === حالت عادی === */}
      <AnimatePresence initial={false}>
        {!searchOpen && (
          <motion.div
            key="default-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            // absolute → از جریان خارج است؛ layout shift نمی‌دهد
            className="absolute inset-x-4 top-4 bottom-3 flex items-center justify-between"
          >
            {/* آواتار + عنوان */}
            <div className="flex items-center gap-3">
              <NextLink
                href="/profile"
                className="flex items-center justify-center p-1 rounded-lg bg-white/5 border border-white/5 active:bg-white/10 transition-all"
                aria-label="پروفایل"
              >
                <Avatar className="h-8 w-8 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </Avatar>
              </NextLink>
              <h2 className="text-xl text-white font-bold">کتابخانه شما</h2>
            </div>

            {/* دکمه‌های جستجو و ایجاد */}
            <div className="flex items-center gap-1">
              <button
                onClick={onSearchOpen}
                className="p-2 text-text-secondary active:text-text-primary transition-colors"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onCreatePlaylist}
                className="p-2 text-text-secondary active:text-text-primary transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === حالت جستجو === */}
      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            key="search-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            // absolute → هم‌تراز با حالت عادی؛ بدون جابجایی layout
            className="absolute inset-x-4 top-4 bottom-3 flex items-center gap-3"
            style={{ direction: "ltr" }}
          >
            {/* دکمه بستن */}
            <button
              onClick={onSearchClose}
              className="shrink-0 active:text-text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* اینپوت */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-2 bg-bg-elevated rounded-xl px-4 py-2.5 border border-border-default overflow-hidden"
              style={{ direction: "rtl" }}
            >
              <Search className="w-4 h-4 text-text-secondary shrink-0" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجو در «کتابخانه شما»"
                dir="rtl"
                autoFocus
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none text-right min-w-0"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.12 }}
                    onClick={() => onSearchChange("")}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4 text-text-secondary" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}