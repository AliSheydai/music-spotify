"use client";

import { motion } from "framer-motion";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import LikeButton from "@/components/music/LikeButton";
import AnimatedBars from "@/components/music/AnimatedBars";
import {
  normalizePlayableQueue,
  normalizePlayableTrack,
  type PlayableTrackInput,
} from "@/lib/music-catalog";
import type { Track } from "@/lib/mock-data";
import { usePlayerStore } from "@/store/player-store";

type ArtistRowTrack = PlayableTrackInput & { plays?: string };
type ArtistInfo = { title: string };

function formatDuration(duration: number | string | undefined) {
  if (typeof duration === "string") return duration;

  const sec = duration ?? 0;
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export default function ArtistTrackRow({
  track,
  index,
  artist,
  setTrack,
  queue,
}: {
  track: ArtistRowTrack;
  index: number;
  artist: ArtistInfo;
  setTrack: (t: Track, queue?: Track[]) => void;
  queue?: PlayableTrackInput[];
}) {
  const currentTrack = usePlayerStore((s) => s.track);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const playableTrack = normalizePlayableTrack({
    ...track,
    artist: artist.title,
  });
  const playableQueue = normalizePlayableQueue(
    queue?.length ? queue : [playableTrack],
    { artist: artist.title },
  );

  const isCurrent = currentTrack?.id === track.id;
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
      key={track.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={playThisTrack}
      className="group grid grid-cols-[1fr_auto] md:grid-cols-[20px_minmax(220px,1fr)_minmax(90px,160px)_96px] items-center gap-4 rounded-md w-full py-2 hover:bg-bg-elevated/70 transition-colors cursor-pointer pl-2">
      {/* ── Index / Play / AnimatedBars column ── */}
      <button
        type="button"
        onClick={handlePlaybackClick}
        aria-label={isActive ? `توقف پخش ${track.title}` : `پخش ${track.title}`}
        className="hidden md:flex w-8 h-8 items-center justify-center text-text-secondary hover:text-text-primary">
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
            <span className="group-hover:hidden text-sm tabular-nums">
              {index + 1}
            </span>
            <Play className="hidden group-hover:block w-4 h-4 fill-current" />
          </>
        )}
      </button>

      {/* ── Cover + Title ── */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <img
          src={track.cover}
          alt={track.title ?? "آهنگ"}
          className="w-10 h-10 rounded object-cover flex-shrink-0"
        />
        <div className="min-w-0 text-right">
          <div
            className={`font-bold text-sm truncate ${isCurrent ? "text-accent-gold" : "text-white"}`}>
            {track.title}
          </div>
          <div className="text-xs text-text-secondary truncate">
            {track.plays}
          </div>
        </div>
      </div>

      {/* ── Plays ── */}
      <div className="text-sm text-text-secondary tabular-nums hidden md:block">
        {track.plays}
      </div>

      {/* ── Actions + Duration ── */}
      <div className="flex items-center justify-end gap-2 md:gap-4 text-text-secondary">
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
          <LikeButton track={track} artistTitle={artist?.title} />
        </div>
        <span className="text-sm tabular-nums">
          {formatDuration(track.duration)}
        </span>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="md:opacity-0 md:group-hover:opacity-100 hover:text-text-primary transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
