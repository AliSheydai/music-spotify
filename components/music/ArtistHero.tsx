"use client";

import { motion } from "framer-motion";
import { Pause, Play, BadgeCheck, ArrowLeft } from "lucide-react";
import { TransitionLink } from "@/components/view-transition";
import FollowButton from "@/components/music/FollowButton";
import { usePlayerStore } from "@/store/player-store";
import { isTrackInQueue } from "@/lib/playback-context";
import type { Card, Track } from "@/lib/mock-data";

export default function ArtistHero({
  artist,
  setTrack,
  tracks,
}: {
  artist: Card;
  setTrack: (track: Track, queue?: Track[]) => void;
  tracks?: Track[];
  onOpenBio: () => void;
}) {
  const seed = artist.id?.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0) ?? 0;
  const hue = (seed * 47) % 360;
  const tintSoft = `hsl(${hue}, 38%, 14%)`;
  const firstTrack = tracks?.[0];
  const currentTrack = usePlayerStore((state) => state.track);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const isCurrentQueue = isTrackInQueue(currentTrack.id, tracks ?? []);

  const handlePlayClick = () => {
    if (!firstTrack) return;

    if (isCurrentQueue) {
      togglePlay();
      return;
    }

    setTrack(firstTrack, tracks);
  };

  return (
    <div
      className="relative flex flex-col items-center md:flex-row md:items-end p-4 pb-4 min-h-[480px] md:h-[340px] overflow-hidden transition-all"
      style={{ backgroundColor: tintSoft }}>
      <div
        className="absolute inset-0 hidden md:block md:h-4/5"
        style={{
          backgroundImage: `linear-gradient(180deg, transparent 0%, ${tintSoft} 95%), url(${artist.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />

      <div className="absolute inset-0 md:hidden bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      <div className="relative z-10 md:hidden mt-12 mb-8">
        <div className="w-52 h-52 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-4 border-white/5">
          <img src={artist.cover} alt={artist.title} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-start text-right">
        <div className="flex items-center gap-2 mb-2 w-full justify-start">
          <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-400 fill-blue-400 stroke-bg-base" />
          <span className="text-xs md:text-sm font-medium">هنرمند تأیید شده</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-black drop-shadow-2xl text-white w-full">{artist.title}</h1>

        <p className="text-white/80 md:text-text-secondary mt-3 text-sm md:text-base w-full">۲٬۴۵۸٬۹۲۱ شنونده ماهانه</p>

        <div className="pt-4 flex items-center justify-start max-md:justify-between gap-6 bg-transparent w-full">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handlePlayClick}
            disabled={!firstTrack}
            aria-label={isCurrentQueue && isPlaying ? "توقف پخش آهنگ‌های هنرمند" : "پخش آهنگ‌های هنرمند"}
            className="w-14 h-14 rounded-full bg-accent-gold text-bg-base flex items-center justify-center shadow-[var(--shadow-glow-gold)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60">
            {isCurrentQueue && isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current mr-0.5" />
            )}
          </motion.button>

          <FollowButton artist={artist} />
        </div>
      </div>

      <TransitionLink href="/" className="absolute top-5 left-5 z-50 md:hidden">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface/50 text-gray-300 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
      </TransitionLink>
    </div>
  );
}
