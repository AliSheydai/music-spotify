import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Mic2,
  Maximize2,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { usePlayerStore } from "../../store/player-store";
import { useLibraryStore } from "../../store/library-store";
import LikeButton from "./LikeButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function MobileHeart({ track }: { track: any }) {
  const router = useRouter();
  const liked = useLibraryStore((s) => s.likedTracks.some((x) => x.id === track.id));
  const toggleLikedTrack = useLibraryStore((s) => s.toggleLikedTrack);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeLiked = !liked;
    toggleLikedTrack({
      id: track.id,
      title: track.title,
      artist: track.artist ?? "",
      album: track.album ?? "",
      duration: String(track.duration ?? ""),
    });

    if (willBeLiked) {
      toast.success("به اهنگ های لایک شده اضافه شد.", {
        action: {
          label: "بررسی",
          onClick: () => router.push("/playlist/liked"),
        },
      });
    } else {
      toast("از اهنگ های لایک شده حذف شد.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 transition-colors ${liked ? "text-[var(--accent-gold)]" : "text-white/60 hover:text-white"}`}
      style={liked ? { color: "var(--accent-gold)" } : undefined}
    >
      <Heart className="w-5 h-5 fill-current" />
    </button>
  );
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export function Player() {
  const {
    track,
    isPlaying,
    togglePlay,
    progress,
    setProgress,
    volume,
    setVolume,
  } = usePlayerStore();
  const toggleNowPlaying = usePlayerStore((s) => s.toggleNowPlaying);
  const nowPlayingOpen = usePlayerStore((s) => s.nowPlayingOpen);
  const nowPlayingFullscreen = usePlayerStore((s) => s.nowPlayingFullscreen);
  const toggleNowPlayingFullscreen = usePlayerStore(
    (s) => s.toggleNowPlayingFullscreen,
  );

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [prevVolume, setPrevVolume] = useState(volume);
  const isMobile = useIsMobile();

  // Auto-advance progress when playing (UI only)
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const cur = usePlayerStore.getState().progress;
      const next = cur + 1 / track.duration;
      usePlayerStore.getState().setProgress(next >= 1 ? 0 : next);
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, track.duration]);

  const current = progress * track.duration;

  const handleRepeat = () => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  };

  const handleMuteToggle = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume > 0 ? prevVolume : 0.5);
    }
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // Mobile fullscreen player
  if (isMobile) {
    return (
      <>
        {/* Mobile mini player */}
        <AnimatePresence>
          {!nowPlayingFullscreen && (
            <motion.footer
              dir="ltr"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={toggleNowPlayingFullscreen}
              className="fixed bottom-[64px] left-0 right-0 z-50 md:hidden h-[64px] shrink-0 bg-[#1a1a1a] border-t rounded-xl border-white/10 px-3 mx-2 flex items-center gap-3 cursor-pointer active:bg-white/5 transition-colors">
              <motion.img
                key={track.cover}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={track.cover}
                alt={track.title}
                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {track.title}
                </div>
                <div className="text-xs text-white/60 truncate">
                  {track.artist}
                </div>
              </div>

              {/* Like button (mobile heart) */}
              <div className="p-0">
                <MobileHeart track={track} />
              </div>

              {/* Play/Pause button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                whileTap={{ scale: 0.9 }}
                className="p-1 text-white">
                <AnimatePresence mode="wait" initial={false}>
                  {isPlaying ? (
                    <motion.div
                      key="pause"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.12 }}>
                      <Pause className="w-7 h-7 fill-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.12 }}>
                      <Play className="w-7 h-7 fill-white ml-0.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Next button */}
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProgress(0);
                }}
                className="p-1 text-white/80 hover:text-white transition-colors">
                <SkipForward className="w-6 h-6" />
              </button> */}

              {/* Progress bar at bottom of mini player */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                <div
                  className="h-full bg-white/60 transition-none"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </motion.footer>
          )}
        </AnimatePresence>

        {/* Mobile Fullscreen Player */}
        <AnimatePresence>
          {nowPlayingFullscreen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-50 flex flex-col"
              style={{
                background:
                  "linear-gradient(180deg, #4a2020 0%, #1a0a0a 40%, #121212 100%)",
              }}>
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 pt-6 pb-4">
                <button
                  onClick={toggleNowPlayingFullscreen}
                  className="text-white/70 hover:text-white transition-colors">
                  <ChevronDown className="w-7 h-7" />
                </button>
                <div className="text-center">
                  <div className="text-xs text-white/50 uppercase tracking-widest">
                    در حال پخش
                  </div>
                </div>
                <button className="text-white/70 hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <circle cx="12" cy="5" r="1" fill="currentColor" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                    <circle cx="12" cy="19" r="1" fill="currentColor" />
                  </svg>
                </button>
              </div>

              {/* Album Art */}
              <div className="flex-1 flex items-center justify-center -mx-3 py-4">
                <motion.img
                  key={track.cover}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: isPlaying ? 1 : 0.88, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src={track.cover}
                  alt={track.title}
                  className="w-full aspect-square object-cover shadow-2xl"
                  style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}
                />
              </div>

              {/* Track info + like */}
              <div className="px-2 pb-10 flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-base font-bold text-white truncate block">
                    {track.title || ""}
                  </div>
                  <div className="text-sm text-white/70 truncate block">
                    {track.artist || ""}
                  </div>
                </div>
                <div className="ml-3 flex-shrink-0 z-10">
                  <MobileHeart track={track} />
                </div>
              </div>

              {/* Progress */}
              <div className="px-6 pb-4">
                <ProgressSlider
                  value={progress}
                  onChange={setProgress}
                  accent
                />
                <div className="flex justify-between mt-1.5 text-[11px] text-white/40 tabular-nums">
                  <span>{fmt(current)}</span>
                  <span>{fmt(track.duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="px-6 pb-6 flex items-center justify-between">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setShuffle((s) => !s)}
                  className={`transition-colors ${shuffle ? "text-[#1DB954]" : "text-white/60 hover:text-white"}`}>
                  <Shuffle className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setProgress(0)}
                  className="text-white hover:text-white/80 transition-colors">
                  <SkipForward className="w-7 h-7" />
                </motion.button>

                <motion.button
                  onClick={togglePlay}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.04 }}
                  className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                  <AnimatePresence mode="wait" initial={false}>
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.12 }}>
                        <Pause className="w-6 h-6 fill-black" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.12 }}>
                        <Play className="w-6 h-6 fill-black ml-0.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setProgress(0)}
                  className="text-white hover:text-white/80 transition-colors">
                  <SkipBack className="w-7 h-7" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleRepeat}
                  className={`transition-colors relative ${repeat !== "off" ? "text-[#1DB954]" : "text-white/60 hover:text-white"}`}>
                  <Repeat className="w-5 h-5" />
                  {repeat === "one" && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#1DB954]">
                      1
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Volume + extra controls */}
              {/* <div className="px-6 pb-10 flex items-center gap-3">
                <button onClick={handleMuteToggle} className="text-white/50 hover:text-white transition-colors">
                  <VolumeIcon className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <ProgressSlider value={volume} onChange={setVolume} />
                </div>
                <button className="text-white/50 hover:text-white transition-colors ml-1">
                  <Volume2 className="w-4 h-4" />
                </button>
              </div> */}

              {/* Bottom icons */}
              <div className="px-4 pb-4 flex items-center justify-between">
                <button className="text-white/50 hover:text-white transition-colors">
                  <Mic2 className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleNowPlaying}
                  className={`hover:text-white transition-colors ${nowPlayingOpen ? "text-[#1DB954]" : "text-white/50"}`}>
                  <ListMusic className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop player (original UI, with functional buttons)
  return (
    <footer className="h-[88px] shrink-0 bg-bg-base border-t border-border-default px-4 grid grid-cols-3 items-center gap-4 shadow-[var(--shadow-player)]">
      {/* Track info */}
      <div className="flex items-center gap-3 min-w-0">
        <motion.img
          key={track.cover}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={track.cover}
          alt={track.title}
          className="w-14 h-14 rounded-md object-cover"
        />
        <div className="min-w-0">
          <div className="text-sm font-medium text-text-primary truncate hover:underline cursor-pointer">
            {track.title}
          </div>
          <div className="text-xs text-text-secondary truncate hover:underline cursor-pointer">
            {track.artist}
          </div>
        </div>
        <div className="flex-shrink-0">
          <LikeButton
            track={track}
            artistTitle={track.artist}
            className="text-text-secondary hover:text-accent-rose"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setShuffle((s) => !s)}
            className={`transition-colors ${shuffle ? "text-accent-gold" : "text-text-secondary hover:text-text-primary"}`}>
            <Shuffle className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() =>
              setProgress(Math.max(0, progress - (1 / track.duration) * 10))
            }
            className="text-text-secondary hover:text-text-primary transition-colors">
            <SkipBack className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={togglePlay}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            className="w-9 h-9 rounded-full bg-text-primary text-bg-base flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}>
                  <Pause className="w-4 h-4 fill-current" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}>
                  <Play className="w-4 h-4 fill-current mr-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() =>
              setProgress(Math.min(1, progress + (1 / track.duration) * 10))
            }
            className="text-text-secondary hover:text-text-primary transition-colors">
            <SkipForward className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleRepeat}
            className={`transition-colors relative ${repeat !== "off" ? "text-accent-gold" : "text-text-secondary hover:text-text-primary"}`}>
            <Repeat className="w-4 h-4" />
            {repeat === "one" && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-accent-gold">
                1
              </span>
            )}
          </motion.button>
        </div>

        <div className="flex items-center gap-2 w-full max-w-[500px] text-[10px] text-text-secondary">
          <span className="w-9 text-right tabular-nums">{fmt(current)}</span>
          <ProgressSlider value={progress} onChange={setProgress} />
          <span className="w-9 tabular-nums">{fmt(track.duration)}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center justify-end gap-3 text-text-secondary">
        <button className="hover:text-text-primary transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <button
          onClick={toggleNowPlaying}
          className={`hover:text-text-primary transition-colors ${nowPlayingOpen ? "text-accent-gold" : ""}`}
          title="در حال پخش">
          <ListMusic className="w-4 h-4" />
        </button>
        <button
          onClick={handleMuteToggle}
          className="hover:text-text-primary transition-colors">
          <VolumeIcon className="w-4 h-4" />
        </button>
        <div className="w-24">
          <ProgressSlider value={volume} onChange={setVolume} />
        </div>
        <button
          onClick={toggleNowPlayingFullscreen}
          className={`hover:text-text-primary transition-colors ${nowPlayingFullscreen ? "text-accent-gold" : ""}`}
          title="تمام صفحه در حال پخش">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}

function ProgressSlider({
  value,
  onChange,
  accent,
}: {
  value: number;
  onChange: (v: number) => void;
  accent?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (r.right - e.clientX) / r.width;
    onChange(Math.max(0, Math.min(1, x)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const r = trackRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (r.right - touch.clientX) / r.width;
    onChange(Math.max(0, Math.min(1, x)));
  };

  return (
    <div
      ref={trackRef}
      className="relative h-1 flex-1 bg-bg-elevated rounded-full cursor-pointer group"
      onClick={handleClick}
      onTouchMove={handleTouchMove}>
      <motion.div
        className={`absolute top-0 right-0 h-full rounded-full transition-colors ${accent ? "bg-white group-hover:bg-[#1DB954]" : "bg-text-primary group-hover:bg-accent-gold"}`}
        style={{ width: `${value * 100}%` }}
      />
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${accent ? "bg-white" : "bg-text-primary"}`}
        style={{ right: `calc(${value * 100}% - 6px)` }}
      />
    </div>
  );
}
