import { create } from "zustand";
import { currentTrack, type Track } from "@/lib/mock-data";
import { normalizePlayableQueue, normalizePlayableTrack } from "@/lib/music-catalog";

type PlayerState = {
  track: Track;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  progress: number; // 0..1
  volume: number; // 0..1
  hoveredCardId: string | null;
  nowPlayingOpen: boolean;
  nowPlayingFullscreen: boolean;
  setTrack: (t: Track) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  setQueue: (queue: Track[], currentTrackId?: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setProgress: (p: number) => void;
  setVolume: (v: number) => void;
  setHoveredCard: (id: string | null) => void;
  toggleNowPlaying: () => void;
  setNowPlayingOpen: (v: boolean) => void;
  toggleNowPlayingFullscreen: () => void;
};

const initialTrack = normalizePlayableTrack(currentTrack);

function clamp(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function prepareQueue(track: Track, queue?: Track[]) {
  const normalizedTrack = normalizePlayableTrack(track);
  const normalizedQueue = queue?.length ? normalizePlayableQueue(queue) : [normalizedTrack];
  const existingIndex = normalizedQueue.findIndex((item) => item.id === normalizedTrack.id);

  if (existingIndex >= 0) {
    return {
      track: normalizedQueue[existingIndex],
      queue: normalizedQueue,
      currentIndex: existingIndex,
    };
  }

  return {
    track: normalizedTrack,
    queue: [normalizedTrack, ...normalizedQueue],
    currentIndex: 0,
  };
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  track: initialTrack,
  queue: [initialTrack],
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  volume: 0.7,
  hoveredCardId: null,
  nowPlayingOpen: false,
  nowPlayingFullscreen: false,
  setTrack: (track) => get().playTrack(track),
  playTrack: (track, queue) => {
    const prepared = prepareQueue(track, queue);
    set({ ...prepared, isPlaying: true, progress: 0, nowPlayingOpen: true });
  },
  setQueue: (queue, currentTrackId) => {
    const normalizedQueue = normalizePlayableQueue(queue);
    const currentIndex = Math.max(
      0,
      normalizedQueue.findIndex((item) => item.id === currentTrackId),
    );
    set({
      queue: normalizedQueue,
      currentIndex,
      track: normalizedQueue[currentIndex] ?? get().track,
    });
  },
  playNext: () => {
    const { queue, currentIndex, track } = get();
    if (queue.length <= 1) {
      set({ progress: 0, track });
      return;
    }
    const nextIndex = (currentIndex + 1) % queue.length;
    set({ track: queue[nextIndex], currentIndex: nextIndex, isPlaying: true, progress: 0, nowPlayingOpen: true });
  },
  playPrevious: () => {
    const { queue, currentIndex, track, progress } = get();
    if (progress > 0.04) {
      set({ progress: 0 });
      return;
    }
    if (queue.length <= 1) {
      set({ progress: 0, track });
      return;
    }
    const previousIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({ track: queue[previousIndex], currentIndex: previousIndex, isPlaying: true, progress: 0, nowPlayingOpen: true });
  },
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setProgress: (progress) => set({ progress: clamp(progress) }),
  setVolume: (volume) => set({ volume: clamp(volume) }),
  setHoveredCard: (hoveredCardId) => set({ hoveredCardId }),
  toggleNowPlaying: () => set((s) => ({ nowPlayingOpen: !s.nowPlayingOpen, nowPlayingFullscreen: false })),
  setNowPlayingOpen: (nowPlayingOpen) =>
    set((s) => ({ nowPlayingOpen, nowPlayingFullscreen: nowPlayingOpen ? s.nowPlayingFullscreen : false })),
  toggleNowPlayingFullscreen: () =>
    set((s) => ({ nowPlayingFullscreen: !s.nowPlayingFullscreen, nowPlayingOpen: true })),
}));