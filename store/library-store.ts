import { create } from "zustand";
import { persist } from "zustand/middleware";
import { syncLikedTracks } from "@/lib/api";
import type { Card } from "@/lib/mock-data";

export type SidebarMode = "normal" | "collapsed" | "expanded";
export type LibraryFilter = "all" | "playlists" | "artists";
export type LibraryView = "compact" | "list" | "grid" | "largeGrid";
export type LibrarySort = "recents" | "recentlyAdded" | "alphabetical" | "creator";

export type CustomTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
};

export type CustomPlaylist = {
  id: string;
  title: string;
  cover: string | null; // data URL or null
  tracks: CustomTrack[];
  createdAt: number;
};

type LibraryState = {
  sidebarMode: SidebarMode;
  filter: LibraryFilter;
  view: LibraryView;
  sort: LibrarySort;
  searchOpen: boolean;
  searchQuery: string;
  baseItems: Card[];
  customPlaylists: CustomPlaylist[];
  likedTracks: CustomTrack[];
  setMode: (m: SidebarMode) => void;
  toggleCollapsed: () => void;
  toggleExpanded: () => void;
  setFilter: (f: LibraryFilter) => void;
  setView: (v: LibraryView) => void;
  setSort: (s: LibrarySort) => void;
  setSearchOpen: (v: boolean) => void;
  setSearchQuery: (q: string) => void;
  createPlaylist: () => CustomPlaylist;
  updatePlaylistCover: (id: string, cover: string) => void;
  renamePlaylist: (id: string, title: string) => void;
  addTrackToPlaylist: (id: string, track: CustomTrack) => void;
  isTrackLiked: (id: string) => boolean;
  addLikedTrack: (track: CustomTrack) => void;
  removeLikedTrack: (id: string) => void;
  toggleLikedTrack: (track: CustomTrack) => void;
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      sidebarMode: "collapsed",
      filter: "all",
      view: "list",
      sort: "recents",
      searchOpen: false,
      searchQuery: "",
      baseItems: [],
      customPlaylists: [],
      likedTracks: [],

      setView: (view) => set({ view }),
      setSort: (sort) => set({ sort }),

      setMode: (sidebarMode) => set({ sidebarMode }),
      toggleCollapsed: () =>
        set((s) => ({ sidebarMode: s.sidebarMode === "collapsed" ? "normal" : "collapsed" })),
      toggleExpanded: () =>
        set((s) => ({ sidebarMode: s.sidebarMode === "expanded" ? "normal" : "expanded" })),
      setFilter: (filter) => set({ filter }),
      setSearchOpen: (searchOpen) => set({ searchOpen, searchQuery: searchOpen ? get().searchQuery : "" }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      createPlaylist: () => {
        const n = get().customPlaylists.length + 1;
        const pl: CustomPlaylist = {
          id: `my-${Date.now()}`,
          title: `پلی‌لیست من #${n}`,
          cover: null,
          tracks: [],
          createdAt: Date.now(),
        };
        set((s) => ({ customPlaylists: [pl, ...s.customPlaylists] }));
        return pl;
      },
      updatePlaylistCover: (id, cover) =>
        set((s) => ({
          customPlaylists: s.customPlaylists.map((p) => (p.id === id ? { ...p, cover } : p)),
        })),
      renamePlaylist: (id, title) =>
        set((s) => ({
          customPlaylists: s.customPlaylists.map((p) => (p.id === id ? { ...p, title } : p)),
        })),
      addTrackToPlaylist: (id, track) =>
        set((s) => ({
          customPlaylists: s.customPlaylists.map((p) =>
            p.id === id ? { ...p, tracks: [...p.tracks, track] } : p,
          ),
        })),

      isTrackLiked: (id) => get().likedTracks.some((t) => t.id === id),
      addLikedTrack: (track) => {
        set((s) => {
          if (s.likedTracks.some((t) => t.id === track.id)) return s;
          const next = [track, ...s.likedTracks];
          // best-effort sync to server
          void syncLikedTracks(next);
          return { likedTracks: next } as any;
        });
      },
      removeLikedTrack: (id) => {
        set((s) => {
          const next = s.likedTracks.filter((t) => t.id !== id);
          void syncLikedTracks(next);
          return { likedTracks: next } as any;
        });
      },
      toggleLikedTrack: (track) => {
        const exists = get().likedTracks.some((t) => t.id === track.id);
        if (exists) get().removeLikedTrack(track.id);
        else get().addLikedTrack(track);
      },
    }),
    {
      name: "lovable-library",
      partialize: (state) => ({ likedTracks: state.likedTracks, customPlaylists: state.customPlaylists }),
    },
  ),
);
