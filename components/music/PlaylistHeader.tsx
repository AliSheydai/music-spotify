"use client";

import React from "react";
import { Music, Heart, Pencil, Pause, Play } from "lucide-react";
import { TransitionLink } from "@/components/view-transition";
import AlbumSaveButton from "@/components/music/AlbumSaveButton";
import { ArrowLeft } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { isTrackInQueue } from "@/lib/playback-context";
import type { Card, Track } from "@/lib/mock-data";
import type { CustomPlaylist } from "@/store/library-store";

export default function PlaylistHeader({
  custom,
  isLiked,
  headerCard,
  cover,
  title,
  tracksLength,
  fileRef,
  editing,
  onCoverChange,
  tracks,
}: {
  custom?: CustomPlaylist;
  isLiked: boolean;
  headerCard: Card;
  cover?: string;
  title: string;
  tracksLength: number;
  fileRef: React.RefObject<HTMLInputElement | null>;
  editing: boolean;
  setEditing: (v: boolean) => void;
  onCoverChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tracks: Track[];
}) {

  const playTrack = usePlayerStore((state) => state.playTrack);
  const currentTrack = usePlayerStore((state) => state.track);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const firstTrack = tracks[0];
  const isCurrentQueue = isTrackInQueue(currentTrack.id, tracks);

  const handlePlayClick = () => {
    if (!firstTrack) return;

    if (isCurrentQueue) {
      togglePlay();
      return;
    }

    playTrack(firstTrack, tracks);
  };

  return (
    <>
      <TransitionLink href="/" className="absolute top-5 left-5 z-50 md:hidden">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface/50 text-gray-300 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
      </TransitionLink>

      <div className={`relative px-4 pt-12 pb-6 bg-gradient-to-b from-violet-700/40 to-transparent md:pt-8`}>
        <div className="flex flex-col items-center md:flex-row md:items-end gap-6">
          <div className="relative w-48 h-48 md:w-56 md:h-56 mb-4 md:mb-0">
            {custom ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group bg-bg-elevated flex items-center justify-center">
                {cover ? (
                  <img src={cover} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-16 h-16 text-text-secondary" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <Pencil className="w-6 h-6 text-white" />
                </div>
                <input ref={fileRef} onChange={onCoverChange} type="file" accept="image/*" className="hidden" />
              </button>
            ) : isLiked ? (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-700 flex items-center justify-center shadow-2xl">
                <Heart className="w-20 h-20 text-white fill-white" />
              </div>
            ) : (
              <img src={cover} alt={title} className="w-full h-full shadow-2xl object-cover" />
            )}
          </div>

          <div className="flex-1 w-full text-right md:text-right">
            <p className="hidden md:block text-xs font-bold uppercase mb-2">{custom ? "پلی‌لیست عمومی" : "پلی‌لیست"}</p>
            {custom && editing ? (
              <input autoFocus className="text-3xl md:text-6xl font-black bg-white/10 rounded px-2 outline-none w-full" />
            ) : (
              <h1 className="text-3xl md:text-7xl font-black text-white mb-2 leading-tight">{title}</h1>
            )}

            <p className="text-sm text-white/60 mt-1 md:mt-2">{tracksLength} آهنگ</p>
          </div>
        </div>

        <div className="py-8 flex items-center gap-4 relative">
          <div className="flex items-center gap-6">
            <button
              onClick={handlePlayClick}
              disabled={!firstTrack}
              aria-label={isCurrentQueue && isPlaying ? "توقف پخش آهنگ‌های پلی‌لیست" : "پخش آهنگ‌های پلی‌لیست"}
              className="w-14 h-14 rounded-full bg-accent-gold text-bg-base flex items-center justify-center shadow-[var(--shadow-glow-gold)] transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCurrentQueue && isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current mr-0.5" />
              )}
            </button>
            <AlbumSaveButton card={headerCard} className="cursor-pointer" />
            <button className="text-white/70">
              <MoreHorizontalIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function MoreHorizontalIcon() {
  return <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>;
}
