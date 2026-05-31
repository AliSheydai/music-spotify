"use client";

import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LibraryHeader } from "./LibraryHeader";
import { FilterChips } from "./FilterChips";
import { List, LayoutGrid } from "lucide-react";
import { SORT_LABELS } from "../hooks/useMobileLibrary";
import { SortBottomSheet } from "./SortBottomSheet";
import { LibraryList, LibraryGrid, EmptyState } from "./LibraryItemLayout";
import { useMobileLibrary } from "../hooks/useMobileLibrary";

function resolveTo(to: string, params?: Record<string, string>) {
  return to.replace(/\$(\w+)/g, (_, k) =>
    params && params[k] ? params[k] : ""
  );
}

export function MobileLibrary() {
  const router = useRouter();

  const {
    filter,
    sort,
    searchQuery,
    searchOpen,
    sortSheetOpen,
    isGridView,
    filteredItems,
    searchInputRef,
    setSearchQuery,
    openSearch,
    closeSearch,
    openSortSheet,
    closeSortSheet,
    handleSortSelect,
    handleFilterSelect,
    clearFilter,
    toggleView,
    createPlaylist,
  } = useMobileLibrary();

  const handleCreatePlaylist = () => {
    const pl = createPlaylist();
    router.push(resolveTo("/playlist/$id", { id: pl.id }));
  };

  // جستجو باز است ولی هنوز چیزی تایپ نشده → EmptyState راهنما
  const showSearchPlaceholder = searchOpen && !searchQuery.trim();
  // جستجو دارد ولی نتیجه‌ای نیست
  const showNotFound =
    searchOpen && searchQuery.trim() !== "" && filteredItems.length === 0;
  // نمایش لیست / گرید
  const showItems = !showSearchPlaceholder && !showNotFound;

  return (
    <div className="flex flex-col h-full bg-bg-base">
      {/* هدر */}
      <LibraryHeader
        sort={sort}
        isGridView={isGridView}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        searchInputRef={(searchInputRef as RefObject<HTMLInputElement>)}
        onSearchOpen={openSearch}
        onSearchClose={closeSearch}
        onSearchChange={setSearchQuery}
        onSortOpen={openSortSheet}
        onToggleView={toggleView}
        onCreatePlaylist={handleCreatePlaylist}
      />

      {/* چیپ‌های فیلتر — همچنان در DOM نگه داشته می‌شوند تا پرش صفحه حذف شود */}
      <motion.div
        key="filter-chips"
        initial={false}
        animate={{
          opacity: searchOpen ? 0 : 1,
          pointerEvents: searchOpen ? "none" : "auto",
        }}
        transition={{ duration: 0.18 }}
        style={{ visibility: searchOpen ? "hidden" : "visible" }}
        aria-hidden={searchOpen}
      >
        <FilterChips
          activeFilter={filter}
          onFilterSelect={handleFilterSelect}
          onClear={clearFilter}
        />
      </motion.div>
      {/* محتوا */}
      <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col">
        <AnimatePresence mode="wait" initial={false} >
          {showSearchPlaceholder && (
            <motion.div
              key="search-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex-1 h-full"
            >
              <EmptyState />
            </motion.div>
          )}

          {showNotFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex-1 h-full"
            >
              <EmptyState query={searchQuery} />
            </motion.div>
          )}

          {showItems && (
            <>
              <div className="px-4 pt-4 border-t border-border-default">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <button
                      onClick={openSortSheet}
                      className="flex items-center gap-2 text-sm text-text-secondary px-2 py-1 rounded-md active:bg-bg-elevated transition-colors"
                      aria-label="مرتب‌سازی">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-text-secondary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4" />
                        <path d="M7 20V4" />
                        <path d="m21 8-4-4-4 4" />
                        <path d="M17 4v16" />
                      </svg>
                      <span className="text-sm font-medium text-text-primary">{SORT_LABELS[sort]}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={toggleView}
                      className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                      aria-label="تغییر نما">
                      {isGridView ? (
                        <List className="w-5 h-5" />
                      ) : (
                        <LayoutGrid className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <motion.div
                key={isGridView ? "grid" : "list"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {isGridView ? (
                  <LibraryGrid items={filteredItems} />
                ) : (
                  <LibraryList items={filteredItems} />
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom sheet مرتب‌سازی */}
      <SortBottomSheet
        open={sortSheetOpen}
        currentSort={sort}
        onSelect={handleSortSelect}
        onClose={closeSortSheet}
      />
    </div>
  );
}