"use client";

import { motion } from "framer-motion";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import LikeButton from "@/components/music/LikeButton";
import AnimatedBars from "@/components/music/AnimatedBars";
import { normalizePlayableQueue, normalizePlayableTrack } from "@/lib/music-catalog";
import { usePlayerStore } from "@/store/player-store";

function formatDuration(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export default function ArtistTrackRow({
  track,
  index,
  artist,
  setTrack,
  queue,
}: {
  track: any;
  index: number;
  artist: any;
  setTrack: (t: any, queue?: any[]) => void;
  queue?: any[];
}) {
  const currentTrack = usePlayerStore((s) => s.track);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const playableTrack = normalizePlayableTrack({ ...track, artist: artist.title });
  const playableQueue = normalizePlayableQueue(queue?.length ? queue : [playableTrack], { artist: artist.title });

  const isCurrent = currentTrack.id === track.id;
  const isActive = isCurrent && isPlaying;

  const playThisTrack = () => setTrack(playableTrack, playableQueue);

  return (
    <motion.div
      key={track.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={playThisTrack}
      className="group grid grid-cols-[1fr_auto] md:grid-cols-[20px_minmax(220px,1fr)_minmax(90px,160px)_96px] items-center gap-4 rounded-md w-full py-2 hover:bg-bg-elevated/70 transition-colors cursor-pointer pl-2"
    >
      {/* ── Index / Play / AnimatedBars column ── */}
      <button
        onClick={playThisTrack}
        className="hidden md:flex w-8 h-8 items-center justify-center text-text-secondary hover:text-text-primary"
      >
        {isCurrent ? (
          <>
            {/* When hovering: show Pause icon */}
            <Pause className="hidden group-hover:block w-4 h-4 fill-current text-accent-gold" />
            {/* When NOT hovering: show animated bars */}
            <span className="group-hover:hidden">
              <AnimatedBars isPlaying={isActive} />
            </span>
          </>
        ) : (
          <>
            {/* Normal row: index number, Play icon on hover */}
            <span className="group-hover:hidden text-sm tabular-nums">{index + 1}</span>
            <Play className="hidden group-hover:block w-4 h-4 fill-current" />
          </>
        )}
      </button>

      {/* ── Cover + Title ── */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <img
          src={track.cover}
          alt={track.title}
          className="w-10 h-10 rounded object-cover flex-shrink-0"
        />
        <div className="min-w-0 text-right">
          <div className={`font-bold text-sm truncate ${isActive ? "text-accent-gold" : "text-white"}`}>
            {track.title}
          </div>
          <div className="text-xs text-text-secondary truncate">{track.plays}</div>
        </div>
      </div>

      {/* ── Plays ── */}
      <div className="text-sm text-text-secondary tabular-nums hidden md:block">{track.plays}</div>

      {/* ── Actions + Duration ── */}
      <div className="flex items-center justify-end gap-2 md:gap-4 text-text-secondary">
        <button className="hidden md:block opacity-0 group-hover:opacity-100 hover:text-text-primary transition-opacity">
          <LikeButton track={track} artistTitle={artist?.title} />
        </button>
        <span className="text-sm tabular-nums">{formatDuration(track.duration)}</span>
        <button className="md:opacity-0 md:group-hover:opacity-100 hover:text-text-primary transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
