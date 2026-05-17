import type { Track } from "./mock-data";

export const LOCAL_AUDIO_SOURCES = [
  "/music/local-track-1.wav",
  "/music/local-track-2.wav",
  "/music/local-track-3.wav",
  "/music/local-track-4.wav",
  "/music/local-track-5.wav",
  "/music/local-track-6.wav",
] as const;

export function parseTrackDuration(duration: number | string | undefined): number {
  if (typeof duration === "number" && Number.isFinite(duration)) return duration;
  if (typeof duration !== "string") return 0;

  const parts = duration.split(":").map((part) => Number.parseInt(part, 10));
  if (parts.length === 2 && parts.every((part) => Number.isFinite(part))) {
    return parts[0] * 60 + parts[1];
  }

  return 0;
}

function sourceIndexForId(id: string) {
  const seed = id.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return seed % LOCAL_AUDIO_SOURCES.length;
}

export function getLocalAudioSource(id: string) {
  return LOCAL_AUDIO_SOURCES[sourceIndexForId(id)];
}

export function withLocalAudioSource<T extends { id: string; src?: string }>(track: T): T & { src: string } {
  return {
    ...track,
    src: track.src ?? getLocalAudioSource(track.id),
  };
}

export type PlayableTrackInput = Omit<Partial<Track>, "duration"> & {
  id: string;
  duration?: number | string;
  plays?: string;
  album?: string;
};

export function normalizePlayableTrack(
  track: PlayableTrackInput,
  fallback?: Omit<Partial<Track>, "duration"> & { duration?: number | string },
): Track {
  const id = track.id;
  return withLocalAudioSource({
    id,
    title: track.title ?? fallback?.title ?? "آهنگ بدون نام",
    artist: track.artist ?? fallback?.artist ?? "هنرمند ناشناس",
    cover: track.cover ?? fallback?.cover ?? "/images/moein.jpg",
    duration: parseTrackDuration(track.duration ?? fallback?.duration) || 12,
    album: track.album,
  });
}

export function normalizePlayableQueue(
  tracks: PlayableTrackInput[],
  fallback?: Omit<Partial<Track>, "duration"> & { duration?: number | string },
) {
  return tracks.map((track) => normalizePlayableTrack(track, fallback));
}