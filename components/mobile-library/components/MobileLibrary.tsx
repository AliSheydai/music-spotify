"use client";

import { useRouter } from "next/navigation";
import { LibraryHeader } from "./LibraryHeader";
import { FilterChips } from "./FilterChips";
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

  const showEmpty =
    searchOpen && !searchQuery && filteredItems.length === 0;
  const showNotFound =
    searchQuery.trim() !== "" && filteredItems.length === 0;

  return (
    <div className="flex flex-col h-full bg-bg-base">
      {/* Header with search, sort, view toggle */}
      <LibraryHeader
        sort={sort}
        isGridView={isGridView}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        searchInputRef={searchInputRef}
        onSearchOpen={openSearch}
        onSearchClose={closeSearch}
        onSearchChange={setSearchQuery}
        onSortOpen={openSortSheet}
        onToggleView={toggleView}
        onCreatePlaylist={handleCreatePlaylist}
      />

      {/* Filter chips - hide when search is open */}
      {!searchOpen && (
        <FilterChips
          activeFilter={filter}
          onFilterSelect={handleFilterSelect}
          onClear={clearFilter}
        />
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {showEmpty || showNotFound ? (
          <EmptyState query={showNotFound ? searchQuery : undefined} />
        ) : isGridView ? (
          <LibraryGrid items={filteredItems} />
        ) : (
          <LibraryList items={filteredItems} />
        )}
      </div>

      {/* Sort bottom sheet */}
      <SortBottomSheet
        open={sortSheetOpen}
        currentSort={sort}
        onSelect={handleSortSelect}
        onClose={closeSortSheet}
      />
    </div>
  );
}
