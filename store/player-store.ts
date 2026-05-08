import { create } from "zustand";
import { currentTrack, type Track } from "@/lib/mock-data";

type PlayerState = {
  track: Track;
  isPlaying: boolean;
  progress: number; // 0..1
  volume: number; // 0..1
  hoveredCardId: string | null;
  nowPlayingOpen: boolean;
  nowPlayingFullscreen: boolean;
  setTrack: (t: Track) => void;
  togglePlay: () => void;
  setProgress: (p: number) => void;
  setVolume: (v: number) => void;
  setHoveredCard: (id: string | null) => void;
  toggleNowPlaying: () => void;
  setNowPlayingOpen: (v: boolean) => void;
  toggleNowPlayingFullscreen: () => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  track: currentTrack,
  isPlaying: false,
  progress: 0.25,
  volume: 0.7,
  hoveredCardId: null,
  nowPlayingOpen: false,
  nowPlayingFullscreen: false,
  setTrack: (track) => set({ track, isPlaying: true, progress: 0, nowPlayingOpen: true }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setProgress: (progress) => set({ progress }),
  setVolume: (volume) => set({ volume }),
  setHoveredCard: (hoveredCardId) => set({ hoveredCardId }),
  toggleNowPlaying: () => set((s) => ({ nowPlayingOpen: !s.nowPlayingOpen, nowPlayingFullscreen: false })),
  setNowPlayingOpen: (nowPlayingOpen) =>
    set((s) => ({ nowPlayingOpen, nowPlayingFullscreen: nowPlayingOpen ? s.nowPlayingFullscreen : false })),
  toggleNowPlayingFullscreen: () =>
    set((s) => ({ nowPlayingFullscreen: !s.nowPlayingFullscreen, nowPlayingOpen: true })),
}));
