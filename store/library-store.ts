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
  cover?: string;
  src?: string;
};

export type CustomPlaylist = {
  id: string;
  title: string;
  cover: string | null; // data URL or null
  tracks: CustomTrack[];
  description?: string;
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
  // followed artists and saved albums are represented by entries in `baseItems`
  isArtistFollowed: (id: string) => boolean;
  followArtist: (card: Card) => void;
  unfollowArtist: (id: string) => void;
  toggleFollowArtist: (card: Card) => void;
  isAlbumSaved: (id: string) => boolean;
  saveAlbum: (card: Card) => void;
  unsaveAlbum: (id: string) => void;
  toggleSaveAlbum: (card: Card) => void;
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
  updatePlaylistDetails: (id: string, details: { title: string; description?: string }) => void;
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
          description: "",
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
        updatePlaylistDetails: (id, details) =>
        set((s) => ({
          customPlaylists: s.customPlaylists.map((p) => (p.id === id ? { ...p, ...details } : p)),
        })),
      addTrackToPlaylist: (id, track) =>
        set((s) => ({
          customPlaylists: s.customPlaylists.map((p) =>
            p.id === id
              ? p.tracks.some((existing) => existing.id === track.id)
                ? p
                : { ...p, tracks: [...p.tracks, track] }
              : p,
          ),
        })),

      // Base items manipulation (used to add followed artists / saved albums to sidebar)
      isArtistFollowed: (id) => get().baseItems.some((i) => i.type === "artist" && i.id === id),
      followArtist: (card) =>
        set((s) => {
          if (s.baseItems.some((i) => i.id === card.id)) return s;
          return { baseItems: [card, ...s.baseItems] } as any;
        }),
      unfollowArtist: (id) =>
        set((s) => ({ baseItems: s.baseItems.filter((i) => i.id !== id) })),
      toggleFollowArtist: (card) => {
        const exists = get().baseItems.some((i) => i.id === card.id && i.type === "artist");
        if (exists) get().unfollowArtist(card.id);
        else get().followArtist(card);
      },

      // consider an item saved if its id exists in baseItems (covers albums and playlists)
      isAlbumSaved: (id) => get().baseItems.some((i) => i.id === id),
      saveAlbum: (card) =>
        set((s) => {
          if (s.baseItems.some((i) => i.id === card.id)) return s;
          return { baseItems: [card, ...s.baseItems] } as any;
        }),
      unsaveAlbum: (id) =>
        set((s) => ({ baseItems: s.baseItems.filter((i) => i.id !== id) })),
      toggleSaveAlbum: (card) => {
        const exists = get().baseItems.some((i) => i.id === card.id);
        if (exists) get().unsaveAlbum(card.id);
        else get().saveAlbum(card);
      },

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
      partialize: (state) => ({ likedTracks: state.likedTracks, customPlaylists: state.customPlaylists, baseItems: state.baseItems }),
    },
  ),
);
