"use client";

import { motion } from "framer-motion";
import { Play, MoreHorizontal } from "lucide-react";
import LikeButton from "@/components/music/LikeButton";

export default function PlaylistTrackRow({
  t,
  i,
  artist,
  cover,
  setTrack,
  isPlaying,
  currentTrack,
  formatDuration,
  parseDuration,
}: {
  t: any;
  i: number;
  artist: any;
  cover?: string;
  setTrack: (t: any) => void;
  isPlaying: boolean;
  currentTrack: any;
  formatDuration: (d: any) => string;
  parseDuration: (d: any) => number;
}) {
  const trackCover = t.cover ?? artist?.cover ?? cover ?? "/images/moein.jpg";
  const plays = t.plays ?? undefined;
  const isActive = currentTrack?.id === t.id && isPlaying;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.03 }}
      className={`group md:grid md:grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_60px] flex items-center justify-between gap-4 rounded-sm w-full py-2 cursor-pointer hover:bg-bg-elevated`}
      onClick={() =>
        setTrack({
          id: t.id,
          title: t.title,
          artist: t.artist ?? artist?.title ?? "",
          cover: trackCover,
          duration: parseDuration(t.duration),
        })
      }>
      <button
        onClick={() =>
          setTrack({
            ...(t as any),
            artist: t.artist ?? artist?.title ?? "",
          })
        }
        className="hidden md:flex w-8 h-8 items-center justify-center text-text-secondary hover:text-text-primary">
        <span className="group-hover:hidden text-sm tabular-nums">{i + 1}</span>
        <Play className="hidden group-hover:block w-4 h-4 fill-current" />
      </button>

      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <img src={trackCover} alt={t.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
        <div className="min-w-0 text-right">
          <div className={`font-bold text-sm truncate ${isActive ? "text-accent-gold" : "text-text-primary"}`}>{t.title}</div>
          <div className="text-xs text-text-secondary truncate">{t.artist}</div>
        </div>
      </div>

      <div className="text-sm text-text-secondary tabular-nums hidden md:block">{plays ?? t.album}</div>

      <div className="flex items-center justify-end gap-2 md:gap-4 text-text-secondary md:ml-2">
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
          <LikeButton track={t} artistTitle={artist?.title} />
        </div>
        <span className="text-sm tabular-nums max-md:hidden">{formatDuration(t.duration)}</span>
        <button className="opacity-90 hover:text-text-primary transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
