"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useArtist, useCurrentTrack, useHomeData, usePlaylist } from "@/lib/hooks";
import { normalizePlayableQueue, normalizePlayableTrack, type PlayableTrackInput } from "@/lib/music-catalog";
import type { Card } from "@/lib/mock-data";
import { buildCardPlaybackQueue } from "@/lib/playback-context";
import { useLibraryStore, type CustomTrack } from "@/store/library-store";
import { usePlayerStore } from "@/store/player-store";

const SAMPLE_TRACKS: PlayableTrackInput[] = Array.from({ length: 10 }).map((_, index) => ({
  id: `t${index}`,
  title: [
    "چتر خیس",
    "زخم زبون",
    "اتفاق",
    "دل‌من‌ای",
    "بی‌من‌مرو",
    "سرنوشت",
    "روزنه",
    "حیران",
    "ماه نو",
    "افسانه",
  ][index],
  artist: [
    "محسن چاوشی",
    "همایون شجریان",
    "سیروان خسروی",
    "محسن یگانه",
    "بنیامین",
  ][index % 5],
  album: "آلبوم برگزیده",
  duration: `${3 + (index % 3)}:${String((10 + index * 7) % 60).padStart(2, "0")}`,
}));

export function formatTrackDuration(duration: number | string) {
  if (typeof duration === "number") {
    return `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`;
  }

  return duration;
}

export function parseTrackDurationLabel(duration: number | string) {
  if (typeof duration === "number") return duration;

  const parts = String(duration)
    .split(":")
    .map((part) => Number.parseInt(part, 10));

  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }

  return 0;
}

function filterSuggestedTracks(tracks: CustomTrack[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return tracks;

  return tracks.filter(
    (track) =>
      (track.title ?? "").toLowerCase().includes(normalizedQuery) ||
      (track.artist ?? "").toLowerCase().includes(normalizedQuery) ||
      (track.album ?? "").toLowerCase().includes(normalizedQuery),
  );
}

export function usePlaylistPageData(id: string) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");

  const { customPlaylists, updatePlaylistCover, addTrackToPlaylist, updatePlaylistDetails } = useLibraryStore();
  const likedTracks = useLibraryStore((state) => state.likedTracks);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const currentTrack = usePlayerStore((state) => state.track);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const custom = useMemo(() => customPlaylists.find((playlist) => playlist.id === id), [customPlaylists, id]);
  const isLiked = id === "liked";
  const [showSearch, setShowSearch] = useState(
    (custom?.tracks.length ?? 0) === 0 || (isLiked && likedTracks.length === 0),
  );

  const { data: playlistData } = usePlaylist(id);
  const { data: homeData } = useHomeData();
  const { data: artistData } = useArtist(id);
  useCurrentTrack();

  const card = custom ? undefined : (playlistData?.card ?? undefined);
  const artist = artistData?.artist ?? undefined;
  const title = custom ? custom.title : isLiked ? "آهنگ‌های لایک شده" : (card?.title ?? "پلی‌لیست");
  const cover = custom?.cover ?? card?.cover;
  const tracks = custom ? custom.tracks : isLiked ? likedTracks : (playlistData?.tracks ?? SAMPLE_TRACKS);
  const headerCard: Card = card ?? {
    id,
    title,
    subtitle: "",
    cover: cover ?? "",
    type: isLiked ? "playlist" : "album",
  };

  const handleBack = useCallback(async () => {
    const viewTransitionDocument = document as Document & {
      startViewTransition?: (callback: () => Promise<void>) => { finished: Promise<void> };
    };

    if (viewTransitionDocument.startViewTransition) {
      try {
        await viewTransitionDocument.startViewTransition(() => {
          router.back();
          return Promise.resolve();
        });
      } catch {
        router.back();
      }
    } else {
      router.back();
    }
  }, [router]);

  const handleCover = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !custom) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") updatePlaylistCover(custom.id, reader.result);
      };
      reader.readAsDataURL(file);
    },
    [custom, updatePlaylistCover],
  );

  const allAvailableTracks = useMemo(() => {
    const cards = [
      ...(homeData?.featured ?? []),
      ...(homeData?.radio ?? []),
      ...(homeData?.albums ?? []),
      ...(homeData?.artists ?? []),
      ...(homeData?.playlists ?? []),
    ];
    const uniqueTracks = new Map<string, CustomTrack>();

    for (const track of [
      ...cards.flatMap((item) => buildCardPlaybackQueue(item)),
      ...SAMPLE_TRACKS.map((item) => normalizePlayableTrack(item)),
    ]) {
      if (!uniqueTracks.has(track.id)) {
        uniqueTracks.set(track.id, {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album ?? "",
          duration: String(track.duration),
          cover: track.cover,
          src: track.src,
        });
      }
    }

    return Array.from(uniqueTracks.values());
  }, [homeData]);

  const filteredSuggest = useMemo(
    () => filterSuggestedTracks(allAvailableTracks, query),
    [allAvailableTracks, query],
  );
  const playableTracks = useMemo(
    () =>
      normalizePlayableQueue(tracks as Array<PlayableTrackInput | CustomTrack>, {
        cover: cover ?? artist?.cover ?? "/images/moein.jpg",
        artist: artist?.title ?? "",
      }),
    [artist?.cover, artist?.title, cover, tracks],
  );

  return {
    custom,
    isLiked,
    fileRef,
    editing,
    setEditing,
    showSearch,
    setShowSearch,
    query,
    setQuery,
    title,
    cover,
    tracks,
    headerCard,
    handleBack,
    handleCover,
    addTrackToPlaylist,
    updatePlaylistDetails,
    artist,
    playTrack,
    currentTrack,
    isPlaying,
    playableTracks,
    filteredSuggest,
  };
}
