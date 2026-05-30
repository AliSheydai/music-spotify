import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  useLibraryStore,
  type LibrarySort,
  type LibraryView,
} from "@/store/library-store";
import { useSidebarItems } from "@/lib/hooks";
import type { Card } from "@/lib/mock-data";

export type MobileLibraryFilter = "all" | "playlists" | "artists" | "podcasts";

export const SORT_LABELS: Record<LibrarySort, string> = {
  recents: "موارد اخیر",
  recentlyAdded: "اخیراً اضافه‌شده",
  alphabetical: "به‌ترتیب حروف الفبا",
  creator: "محتواساز",
};

export function useMobileLibrary() {
  const {
    filter,
    setFilter,
    view,
    setView,
    sort,
    setSort,
    searchQuery,
    setSearchQuery,
    baseItems,
    customPlaylists,
    createPlaylist,
  } = useLibraryStore();

  const likedCount = useLibraryStore((s) => s.likedTracks.length);
  const { data: sidebarQueryItems } = useSidebarItems();

  const [searchOpen, setSearchOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const likedCard: Card = useMemo(
    () => ({
      id: "liked",
      title: "آهنگ‌های پسندیده‌شده",
      subtitle: `فهرست پخش • ${likedCount} آهنگ`,
      cover: "",
      type: "playlist",
    }),
    [likedCount]
  );

  const customAsCards: Card[] = useMemo(
    () =>
      customPlaylists.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: "فهرست پخش • شما",
        cover: p.cover ?? "",
        type: "playlist" as const,
      })),
    [customPlaylists]
  );

  const episodeCard: Card = {
    id: "episodes",
    title: "قسمت‌های شما",
    subtitle: "فهرست پخش • قسمت‌های ذخیره‌شده و بارگیری...",
    cover: "",
    type: "playlist",
  };

  const allItems: Card[] = useMemo(
    () => [likedCard, episodeCard, ...customAsCards, ...baseItems],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [likedCard, customAsCards, baseItems]
  );

  const filteredItems = useMemo(() => {
    let list = allItems;

    if (filter === "playlists")
      list = list.filter(
        (i) => i.type === "playlist" || i.type === "album"
      );
    if (filter === "artists")
      list = sidebarQueryItems
        ? sidebarQueryItems.filter((i) => i.type === "artist")
        : list.filter((i) => i.type === "artist");

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q));
    }

    const sorted = [...list];
    if (sort === "alphabetical")
      sorted.sort((a, b) => a.title.localeCompare(b.title, "fa"));
    else if (sort === "creator")
      sorted.sort((a, b) => a.subtitle.localeCompare(b.subtitle, "fa"));
    else if (sort === "recentlyAdded") sorted.reverse();

    return sorted;
  }, [allItems, filter, searchQuery, sort, sidebarQueryItems]);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [setSearchQuery]);

  const openSortSheet = useCallback(() => setSortSheetOpen(true), []);
  const closeSortSheet = useCallback(() => setSortSheetOpen(false), []);

  const handleSortSelect = useCallback(
    (s: LibrarySort) => {
      setSort(s);
      setSortSheetOpen(false);
    },
    [setSort]
  );

  const isGridView = view === "grid" || view === "largeGrid";
  const toggleView = useCallback(() => {
    setView(isGridView ? "list" : "grid");
  }, [isGridView, setView]);

  const handleFilterSelect = useCallback(
    (f: MobileLibraryFilter) => {
      setFilter(f === filter ? "all" : f);
    },
    [filter, setFilter]
  );

  const clearFilter = useCallback(() => {
    setFilter("all");
  }, [setFilter]);

  return {
    // state
    filter,
    view,
    sort,
    searchQuery,
    searchOpen,
    sortSheetOpen,
    isGridView,
    // data
    filteredItems,
    // refs
    searchInputRef,
    // actions
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
  };
}
