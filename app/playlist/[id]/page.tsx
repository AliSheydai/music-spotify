"use client";

import { motion } from "framer-motion";
import {
  Play,
  Heart,
  MoreHorizontal,
  Clock,
  Music,
  Pencil,
  UserPlus,
  Search,
  X,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useRef, useState, use } from "react";
import { AppShell } from "@/components/music/AppShell";
import { usePlaylist, useArtist, useCurrentTrack } from "@/lib/hooks";
import { usePlayerStore } from "@/store/player-store";
import { useLibraryStore } from "@/store/library-store";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "@/components/music/LikeButton";

function TrackLikeHeart({ track, artistTitle }: { track: any; artistTitle?: string }) {
  const liked = useLibraryStore((s) => s.likedTracks.some((x) => x.id === track.id));
  const toggleLikedTrack = useLibraryStore((s) => s.toggleLikedTrack);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleLikedTrack({
          id: track.id,
          title: track.title,
          artist: artistTitle ?? track.artist ?? "",
          album: track.album ?? "",
          duration: String(track.duration ?? ""),
        });
      }}
      className={`hidden md:flex w-8 h-8 items-center justify-center transition-colors ${liked ? "text-accent-emerald" : "text-text-secondary hover:text-text-primary"}`}>
      <Heart className="w-4 h-4" />
    </button>
  );
}

// نمونه دیتا محلی برای زمانی که API داده‌ای برنگرداند
const allPlaylists = [];

const sampleTracks = Array.from({ length: 10 }).map((_, i) => ({
  id: `t${i}`,
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
  ][i],
  artist: [
    "محسن چاوشی",
    "همایون شجریان",
    "سیروان خسروی",
    "محسن یگانه",
    "بنیامین",
  ][i % 5],
  album: "آلبوم برگزیده",
  duration: `${3 + (i % 3)}:${String((10 + i * 7) % 60).padStart(2, "0")}`,
}));

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export default function PlaylistPage({ params }: Props) {
  const { id } = use(params as Promise<{ id: string }>); // unwrap params safely

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const {
    customPlaylists,
    updatePlaylistCover,
    renamePlaylist,
    addTrackToPlaylist,
  } = useLibraryStore();
  const likedTracks = useLibraryStore((s) => s.likedTracks);

  const custom = customPlaylists.find((p) => p.id === id);
  const { data: playlistData } = usePlaylist(id);
  const card = custom ? undefined : playlistData?.card ?? undefined;
  const isLiked = id === "liked";

  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [showSearch, setShowSearch] = useState((custom?.tracks.length ?? 0) === 0 || (isLiked && likedTracks.length === 0));
  const [query, setQuery] = useState("");

  const title = custom
    ? custom.title
    : isLiked
      ? "آهنگ‌های لایک شده"
      : (card?.title ?? "پلی‌لیست");
  const cover = custom?.cover ?? card?.cover;
  const tracks = custom ? custom.tracks : isLiked ? likedTracks : sampleTracks;

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !custom) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string")
        updatePlaylistCover(custom.id, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const filteredSuggest = sampleTracks.filter(
    (t) => !query.trim() || t.title.includes(query) || t.artist.includes(query),
  );

  const formatDuration = (d: number | string) => {
    if (typeof d === "number")
      return `${Math.floor(d / 60)}:${String(d % 60).padStart(2, "0")}`;
    return d;
  };

  const parseDuration = (d: number | string) => {
    if (typeof d === "number") return d;
    const parts = String(d).split(":").map((p) => parseInt(p, 10));
    if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const headerGradient = isLiked
    ? "from-violet-700/60 via-violet-900/30 to-transparent"
    : "from-violet-700/40 to-transparent";

  const { data: artistData } = useArtist(id);
  const artist = artistData?.artist ?? undefined;
  useCurrentTrack();
  const setTrack = usePlayerStore((s) => s.setTrack);
  const currentTrack = usePlayerStore((s) => s.track);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const toggleLikedTrack = useLibraryStore((s) => s.toggleLikedTrack);

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="-mx-6 md:-mx-10 -mt-4 px-2">
        {/* back button */}
        <Link href="/" className="absolute top-5 left-5 z-50 md:hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface/50 text-gray-300 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
        </Link>
        {/* Header */}
        <div
          className={`relative px-4 pt-12 pb-6 bg-gradient-to-b ${headerGradient} md:pt-8`}>
          <div className="flex flex-col items-center md:flex-row md:items-end gap-6">
            {/* Cover Image */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 mb-4 md:mb-0">
              {custom ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group bg-bg-elevated flex items-center justify-center">
                  {cover ? (
                    <img
                      src={cover}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-16 h-16 text-text-secondary" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <Pencil className="w-6 h-6 text-white" />
                  </div>
                  <input
                    ref={fileRef}
                    onChange={handleCover}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </button>
              ) : isLiked ? (
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-700 flex items-center justify-center shadow-2xl">
                  <Heart className="w-20 h-20 text-white fill-white" />
                </div>
              ) : (
                <img
                  src={cover}
                  alt={title}
                  className="w-full h-full shadow-2xl object-cover"
                />
              )}
            </div>

            {/* Metadata Information */}
            <div className="flex-1 w-full text-right md:text-right">
              <p className="hidden md:block text-xs font-bold uppercase mb-2">
                {custom ? "پلی‌لیست عمومی" : "پلی‌لیست"}
              </p>

              {custom && editing ? (
                <input
                  autoFocus
                  className="text-3xl md:text-6xl font-black bg-white/10 rounded px-2 outline-none w-full"
                  // ... بقیه پراپ‌ها
                />
              ) : (
                <h1 className="text-3xl md:text-7xl font-black text-white mb-2 leading-tight">
                  {title}
                </h1>
              )}

              <p className="text-sm text-white/60 mt-1 md:mt-2">
                {tracks.length} آهنگ
              </p>
            </div>
          </div>
          {/* Action Bar - Floating Play Button for Mobile */}
          <div
            dir="ltr"
            className="py-8 flex items-center justify-between relative">
            <div className="flex items-center gap-6">
              <button className="text-white/70 hover:text-accent-rose transition-colors">
                <Heart className="w-7 h-7" />
              </button>
              <button className="text-white/70">
                <MoreHorizontal className="w-7 h-7" />
              </button>
            </div>

            {/* دکمه پلی که در موبایل روی مرز هدر قرار می‌گیرد */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="w-14 h-14 rounded-full bg-accent-gold text-bg-base flex items-center justify-center shadow-[var(--shadow-glow-gold)] cursor-pointer">
              <Play className="w-6 h-6 fill-current mr-0.5" />
            </motion.button>
          </div>
        </div>

        {/* Track list */}
        <div className="px-6">
          {tracks.length > 0 && (
            <div className="hidden md:grid grid-cols-[24px_1fr_1fr_60px] gap-4 px-4 py-2 mb-4 border-b border-border-default text-xs text-text-secondary uppercase">
              <span>#</span>
              <span>عنوان</span>
              <span>آلبوم</span>
              <Clock className="w-4 h-4 mx-auto" />
            </div>
          )}

          {tracks.map((t, i) => {
            const trackCover = (t as any).cover ?? artist?.cover ?? cover ?? "/images/moein.jpg";
            const plays = (t as any).plays ?? undefined;
            const isActive = currentTrack?.id === t.id && isPlaying;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`group md:grid md:grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_60px] flex items-center justify-between gap-4 rounded-sm w-full py-2 cursor-pointer hover:bg-bg-elevated`}
                onClick={() =>
                    setTrack({
                      id: t.id,
                      title: t.title,
                      artist: (t as any).artist ?? artist?.title ?? "",
                      cover: (t as any).cover ?? artist?.cover ?? cover ?? "/images/moein.jpg",
                      duration: parseDuration((t as any).duration),
                    })
                }>
                <button
                  onClick={() =>
                    setTrack({
                      ...(t as any),
                      artist: (t as any).artist ?? artist?.title ?? "",
                    })
                  }
                  className="hidden md:flex w-8 h-8 items-center justify-center text-text-secondary hover:text-text-primary">
                  <span className="group-hover:hidden text-sm tabular-nums">
                    {i + 1}
                  </span>
                  <Play className="hidden group-hover:block w-4 h-4 fill-current" />
                </button>

                <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                  <img
                    src={trackCover}
                    alt={(t as any).title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 text-right">
                    <div className={`font-bold text-sm truncate ${isActive ? "text-accent-gold" : "text-text-primary"}`}>
                      {t.title}
                    </div>
                    <div className="text-xs text-text-secondary truncate">
                      {(t as any).artist}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-text-secondary tabular-nums hidden md:block">
                  {plays ?? (t as any).album}
                </div>

                <div className="flex items-center justify-end gap-2 md:gap-4 text-text-secondary md:ml-2">
                  <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Like/Add to liked songs button for this track */}
                    <LikeButton track={t} artistTitle={artist?.title} />
                  </div>
                  <span className="text-sm tabular-nums max-md:hidden">
                    {formatDuration((t as any).duration)}
                  </span>
                  <button className="opacity-90 hover:text-text-primary transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Empty state for custom playlist */}
          {custom && tracks.length === 0 && !showSearch && (
            <div className="py-16 text-center text-text-secondary">
              این پلی‌لیست هنوز خالی است. روی دکمه افزودن آهنگ بزن.
            </div>
          )}

          {/* Add-songs panel */}
          {custom && showSearch && (
            <div className="mt-6 border-t border-border-default pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  بگذار چیزی برای پلی‌لیستت پیدا کنیم
                </h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center text-text-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative max-w-md mb-6">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی آهنگ یا قسمت پادکست"
                  className="w-full bg-bg-elevated rounded-md pr-9 pl-3 py-2.5 text-sm outline-none border border-transparent focus:border-border-strong"
                />
              </div>

              <div className="space-y-1">
                {filteredSuggest.map((t) => {
                  const added = custom.tracks.some((x) => x.id === t.id);
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-bg-elevated group">
                      <div className="min-w-0">
                        <div className="font-medium text-text-primary truncate">
                          {t.title}
                        </div>
                        <div className="text-xs text-text-secondary truncate">
                          {t.artist} • {t.album}
                        </div>
                      </div>
                      <button
                        disabled={added}
                        onClick={() => addTrackToPlaylist(custom.id, t)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold border border-border-strong transition-colors ${
                          added
                            ? "text-text-secondary cursor-default"
                            : "text-text-primary hover:scale-105"
                        }`}>
                        {added ? "افزوده شد" : "افزودن"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AppShell>
  );
}
