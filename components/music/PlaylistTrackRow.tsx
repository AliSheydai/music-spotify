"use client";

import { motion } from "framer-motion";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import LikeButton from "@/components/music/LikeButton";
import AnimatedBars from "@/components/music/AnimatedBars";
import { normalizePlayableQueue, normalizePlayableTrack, type PlayableTrackInput } from "@/lib/music-catalog";
import type { Track } from "@/lib/mock-data";
import { usePlayerStore } from "@/store/player-store";

type PlaylistRowTrack = PlayableTrackInput & { plays?: string; album?: string };
type PlaylistArtist = { title?: string; cover?: string } | undefined;

type PlaylistTrackRowProps = {
  t: PlaylistRowTrack;
  i: number;
  artist: PlaylistArtist;
  cover?: string;
  setTrack: (t: Track, queue?: Track[]) => void;
  queue?: PlayableTrackInput[];
  isPlaying: boolean;
  currentTrack: Track | null | undefined;
  formatDuration: (d: number | string) => string;
  parseDuration: (d: number | string) => number;
};

export default function PlaylistTrackRow({
  t,
  i,
  artist,
  cover,
  setTrack,
  queue,
  isPlaying,
  currentTrack,
  formatDuration,
 }: PlaylistTrackRowProps) {
  const trackCover = t.cover ?? artist?.cover ?? cover ?? "/images/moein.jpg";
  const plays = t.plays ?? undefined;

  const playableTrack = normalizePlayableTrack(
    { ...t, cover: trackCover, artist: t.artist ?? artist?.title ?? "" },
    { cover: trackCover, artist: artist?.title ?? "" },
  );
  const playableQueue = normalizePlayableQueue(queue?.length ? queue : [playableTrack], {
    cover: trackCover,
    artist: artist?.title ?? "",
  });

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const isCurrent = currentTrack?.id === t.id;
  const isActive = isCurrent && isPlaying;

  const playThisTrack = () => setTrack(playableTrack, playableQueue);
  const handlePlaybackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isCurrent) {
      togglePlay();
      return;
    }

    playThisTrack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.03 }}
      className={`group md:grid md:grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_60px] flex items-center justify-between gap-4 rounded-sm w-full py-2 cursor-pointer hover:bg-bg-elevated`}
      onClick={playThisTrack}
    >
      {/* ── Index / Play / AnimatedBars column ── */}
      <button
        type="button"
        onClick={handlePlaybackClick}
        aria-label={isActive ? `توقف پخش ${t.title}` : `پخش ${t.title}`}
        className="hidden md:flex w-8 h-8 items-center justify-center text-text-secondary hover:text-text-primary"
      >
        {isCurrent ? (
          <>
            {isActive ? (
              <Pause className="hidden group-hover:block w-4 h-4 fill-current text-accent-gold" />
            ) : (
              <Play className="hidden group-hover:block w-4 h-4 fill-current text-accent-gold" />
            )}
            <span className="group-hover:hidden">
              <AnimatedBars isPlaying={isActive} />
            </span>
          </>
        ) : (
          <>
            <span className="group-hover:hidden text-sm tabular-nums">{i + 1}</span>
            <Play className="hidden group-hover:block w-4 h-4 fill-current" />
          </>
        )}
      </button>

      {/* ── Cover + Title ── */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <img
          src={trackCover}
          alt={t.title ?? "آهنگ"}
          className="w-10 h-10 rounded object-cover flex-shrink-0"
        />
        <div className="min-w-0 text-right">
          <div className={`font-bold text-sm truncate ${isCurrent ? "text-accent-gold" : "text-text-primary"}`}>
            {t.title}
          </div>
          <div className="text-xs text-text-secondary truncate">{playableTrack.artist}</div>
        </div>
      </div>

      {/* ── Plays / Album ── */}
      <div className="text-sm text-text-secondary tabular-nums hidden md:block">{plays ?? t.album}</div>

      {/* ── Actions + Duration ── */}
      <div className="flex items-center justify-end gap-2 md:gap-4 text-text-secondary md:ml-2">
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
          <LikeButton track={t} artistTitle={artist?.title} />
        </div>
        <span className="text-sm tabular-nums max-md:hidden">{formatDuration(t.duration ?? 0)}</span>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="opacity-90 hover:text-text-primary transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
