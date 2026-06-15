"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MobileLibraryFilter } from "../hooks/useMobileLibrary";
import { SORT_LABELS } from "../hooks/useMobileLibrary";
import type { LibrarySort } from "@/store/library-store";

interface FilterChipsProps {
  activeFilter: string;
  searchOpen?: boolean;
  searchQuery?: string;
  onSortOpen?: () => void;
  onToggleView?: () => void;
  onCreatePlaylist?: () => void;
  onFilterSelect: (f: MobileLibraryFilter) => void;
  onClear: () => void;
}

const FILTER_OPTIONS: { id: MobileLibraryFilter; label: string }[] = [
  { id: "playlists", label: "فهرست‌های پخش" },
  { id: "artists", label: "هنرمندان" },
  { id: "podcasts", label: "پادکست‌ها" },
];

export function FilterChips({
  activeFilter,
  onFilterSelect,
  onClear,
}: FilterChipsProps) {
  const hasActiveFilter = activeFilter !== "all";

  return (
    <div className="flex flex-col items-stretch gap-2 px-4 py-2 overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-start gap-2">
        <AnimatePresence initial={false}>
        {hasActiveFilter && (
          <motion.button
            initial={{ opacity: 0, width: 0, marginRight: 0 }}
            animate={{ opacity: 1, width: 32, marginRight: 0 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClear}
            className="shrink-0 w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary">
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onFilterSelect(opt.id)}
          className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            activeFilter === opt.id
              ? "bg-text-primary text-bg-base"
              : "bg-bg-elevated text-text-primary"
          }`}>
          {opt.label}
        </button>
      ))}
      </div>
      {/* moved sort/view controls to container that shows items */}
    </div>
  );
}
