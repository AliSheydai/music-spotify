"use client";

import { Search, LayoutGrid, List, X, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { LibrarySort } from "@/store/library-store";
import { SORT_LABELS } from "../hooks/useMobileLibrary";
import type { RefObject } from "react";

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
  sort,
  isGridView,
  searchOpen,
  searchQuery,
  searchInputRef,
  onSearchOpen,
  onSearchClose,
  onSearchChange,
  onSortOpen,
  onToggleView,
  onCreatePlaylist,
}: LibraryHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2 gap-2">
      {/* Left: search icon or input */}
      <AnimatePresence initial={false} mode="wait">
        {searchOpen ? (
          <motion.div
            key="search-input"
            initial={{ opacity: 0, flex: 0 }}
            animate={{ opacity: 1, flex: 1 }}
            exit={{ opacity: 0, flex: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-bg-elevated rounded-md px-3 py-2 flex-1"
          >
            <X
              className="w-4 h-4 text-text-secondary shrink-0 cursor-pointer"
              onClick={onSearchClose}
            />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder='جستجو در «کتابخانه شما»'
              dir="rtl"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange("")}>
                <X className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="search-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onSearchOpen}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Search className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right: sort label + view toggle + create */}
      {!searchOpen && (
        <div className="flex items-center gap-1">
          <button
            onClick={onSortOpen}
            className="flex items-center gap-1 text-sm text-text-secondary px-2 py-1.5 rounded-md active:bg-bg-elevated transition-colors"
          >
            <span>{SORT_LABELS[sort]}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 16 4 4 4-4" />
              <path d="M7 20V4" />
              <path d="m21 8-4-4-4 4" />
              <path d="M17 4v16" />
            </svg>
          </button>

          <button
            onClick={onToggleView}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            {isGridView ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
          </button>

          <button
            onClick={onCreatePlaylist}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
