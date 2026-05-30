"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useArtist, useHomeData } from "@/lib/hooks";
import { buildArtistPlaybackQueue } from "@/lib/playback-context";
import { usePlayerStore } from "@/store/player-store";

const DEFAULT_ARTIST = {
  id: "",
  title: "هنرمند",
  subtitle: "",
  cover: "/images/moein.jpg",
  type: "artist" as const,
};

function buildArtistTint(artistId: string) {
  const seed = artistId.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const hue = (seed * 47) % 360;

  return {
    tint: `hsl(${hue}, 42%, 22%)`,
    tintSoft: `hsl(${hue}, 38%, 14%)`,
  };
}

export function useArtistPageData() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const [bioOpen, setBioOpen] = useState(false);
  const [popularExpanded, setPopularExpanded] = useState(false);

  const { data: artistData } = useArtist(id);
  const { data: homeData } = useHomeData();
  const playTrack = usePlayerStore((state) => state.playTrack);

  const artist = artistData?.artist ?? homeData?.artists?.[0] ?? DEFAULT_ARTIST;

  const playablePopularTracks = useMemo(() => buildArtistPlaybackQueue(artist), [artist]);
  const visiblePopularTracks = useMemo(
    () => (popularExpanded ? playablePopularTracks : playablePopularTracks.slice(0, 5)),
    [playablePopularTracks, popularExpanded],
  );
  const artistBio = useMemo(
    () => `${artist.title} از چهره‌های شناخته‌شده موسیقی فارسی است...`,
    [artist.title],
  );
  const background = useMemo(() => {
    const { tint, tintSoft } = buildArtistTint(artist.id);
    return `linear-gradient(180deg, ${tint} 0%, ${tintSoft} 360px, var(--bg-surface) 720px)`;
  }, [artist.id]);

  return {
    id,
    artist,
    homeData,
    bioOpen,
    setBioOpen,
    popularExpanded,
    setPopularExpanded,
    playTrack,
    playablePopularTracks,
    visiblePopularTracks,
    artistBio,
    background,
  };
}
