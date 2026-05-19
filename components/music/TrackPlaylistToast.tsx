"use client";

import { Check, Heart, Music, Pin, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useLibraryStore, type CustomTrack } from "@/store/library-store";

type TrackPlaylistToastProps = {
  toastId: string | number;
  track: CustomTrack;
};

const DISMISS_DELAY = 5000;

export default function TrackPlaylistToast({ toastId, track }: TrackPlaylistToastProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusedIdx, setFocusedIdx] = useState(-1);
  // Optimistic: track which playlist IDs were just added this session
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());
  // Progress bar state (0–100)
  const [progress, setProgress] = useState(100);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const customPlaylists = useLibraryStore((s) => s.customPlaylists);
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const addLikedTrack = useLibraryStore((s) => s.addLikedTrack);
  const addTrackToPlaylist = useLibraryStore((s) => s.addTrackToPlaylist);

  const playlists = useMemo(
    () => [
      {
        id: "liked",
        title: "آهنگ‌های لایک‌شده",
        trackCount: likedTracks.length,
        selected: likedTracks.some((t) => t.id === track.id),
        isLiked: true,
      },
      ...customPlaylists.map((pl) => ({
        id: pl.id,
        title: pl.title,
        trackCount: pl.tracks.length,
        selected: pl.tracks.some((t) => t.id === track.id),
        isLiked: false,
      })),
    ],
    [customPlaylists, likedTracks, track.id],
  );

  const filtered = useMemo(
    () => playlists.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase())),
    [playlists, query],
  );

  // ─── Progress bar + auto-dismiss ────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const start = Date.now();
    setProgress(100);
    intervalRef.current = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / DISMISS_DELAY) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(intervalRef.current!);
    }, 40);
    timerRef.current = setTimeout(() => toast.dismiss(toastId), DISMISS_DELAY);
  }, [toastId]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // Pause timer while dropdown is open
  useEffect(() => {
    if (open) { stopTimer(); return; }
    startTimer();
    return stopTimer;
  }, [open, startTimer, stopTimer]);

  // ─── Outside click ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  // ─── Keyboard navigation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && focusedIdx >= 0) {
        const item = filtered[focusedIdx];
        if (item && !item.selected && !justAdded.has(item.id)) handleSelect(item.id);
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open, focusedIdx, filtered, justAdded]);

  useEffect(() => { setFocusedIdx(-1); }, [query]);
  useEffect(() => { if (open) setTimeout(() => searchRef.current?.focus(), 60); }, [open]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIdx < 0) return;
    (listRef.current?.children[focusedIdx] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
  }, [focusedIdx]);

  // ─── Select handler ──────────────────────────────────────────────────────────
  const handleSelect = useCallback(
    (playlistId: string) => {
      // Optimistic UI: show checkmark immediately
      setJustAdded((prev) => new Set(prev).add(playlistId));

      if (playlistId === "liked") addLikedTrack(track);
      else addTrackToPlaylist(playlistId, track);

      // Brief pause so user sees the check, then dismiss
      setTimeout(() => {
        setOpen(false);
        toast.dismiss(toastId);
        toast.success(`«${track.title}» ذخیره شد.`);
      }, 600);
    },
    [track, addLikedTrack, addTrackToPlaylist, toastId],
  );

  return (
    <div ref={containerRef} className="relative w-full" dir="rtl">

      {/* ── Toast bar ── */}
      <div className="flex items-center gap-3 pb-1">
        {/* Gold check dot */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-gold">
          <Check className="h-3 w-3 text-black" strokeWidth={3} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">آهنگ با موفقیت اضافه شد.</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={`rounded-full border px-4 py-[5px] text-xs font-bold transition-all ${
              open
                ? "border-white bg-white text-black"
                : "border-white/40 text-white hover:border-white"
            }`}
          >
            تغییر
          </button>
          <button
            type="button"
            onClick={() => toast.dismiss(toastId)}
            aria-label="بستن"
            className="text-[#b3b3b3] transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-accent-gold transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Spotify-inspired dropdown ── */}
      {open && (
        <div
          className="absolute bottom-[calc(100%+12px)] right-0 z-[200] w-[340px] overflow-hidden rounded-md"
          style={{
            background: "#282828",
            boxShadow: "0 16px 56px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)",
            animation: "spDropIn 0.18s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-4 pt-4 pb-0">
            <div>
              <p className="text-sm font-bold text-white">افزودن به پلی‌لیست</p>
              <p className="mt-0.5 max-w-[220px] truncate text-xs text-[#b3b3b3]">{track.title}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-0.5 text-[#b3b3b3] transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pt-3 pb-3">
            <div
              className="flex items-center gap-2 rounded px-3 py-2.5 ring-1 ring-transparent focus-within:ring-white/40 transition-all"
              style={{ background: "#3e3e3e" }}
            >
              <Search className="h-4 w-4 shrink-0 text-[#b3b3b3]" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی پلی‌لیست"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#b3b3b3]"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-[#b3b3b3] hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* New playlist */}
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-right transition-colors hover:bg-white/10"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
              style={{ background: "#3e3e3e" }}
            >
              <Plus className="h-4 w-4 text-white" />
            </span>
            <span className="text-sm font-semibold text-white">پلی‌لیست جدید</span>
          </button>

          <div className="mx-4 h-px bg-white/10" />

          {/* Keyboard hint */}
          {filtered.length > 0 && (
            <p className="px-4 pt-2 text-[11px] text-[#b3b3b3]/60">
              ↑↓ برای ناوبری · Enter برای انتخاب · Esc برای بستن
            </p>
          )}

          {/* Playlist list */}
          <div
            ref={listRef}
            className="max-h-52 overflow-y-auto py-1"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#3e3e3e transparent" }}
          >
            {filtered.length > 0 ? (
              filtered.map((pl, idx) => {
                const isAdded = pl.selected || justAdded.has(pl.id);
                const isFocused = focusedIdx === idx;

                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => !isAdded && handleSelect(pl.id)}
                    onMouseEnter={() => setFocusedIdx(idx)}
                    disabled={isAdded}
                    className={`flex w-full items-center gap-3 px-4 py-[11px] text-right text-sm transition-colors ${
                      isAdded
                        ? "cursor-default opacity-70"
                        : isFocused
                        ? "bg-white/10"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {/* Icon */}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${
                        pl.isLiked
                          ? "bg-gradient-to-br from-[#450af5] to-[#8e8ee5]"
                          : ""
                      }`}
                      style={!pl.isLiked ? { background: "#3e3e3e" } : undefined}
                    >
                      {pl.isLiked
                        ? <Heart className="h-4 w-4 fill-white text-white" />
                        : <Music className="h-3.5 w-3.5 text-[#b3b3b3]" />}
                    </span>

                    {/* Text */}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-white">{pl.title}</span>
                      <span className="block truncate text-xs text-[#b3b3b3]">
                        {pl.trackCount} آهنگ
                      </span>
                    </span>

                    {/* State indicators */}
                    <span className="flex shrink-0 items-center gap-1.5">
                      {pl.isLiked && isAdded && (
                        <Pin
                          className="h-3.5 w-3.5 text-accent-gold"
                          fill="currentColor"
                          style={{ transition: "opacity 0.2s" }}
                        />
                      )}
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200 ${
                          isAdded
                            ? "border-accent-gold bg-accent-gold scale-110"
                            : isFocused
                            ? "border-white/60"
                            : "border-[#b3b3b3]"
                        }`}
                      >
                        {isAdded && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <Music className="mb-2 h-6 w-6 text-[#b3b3b3]/40" />
                <p className="text-sm text-[#b3b3b3]">نتیجه‌ای یافت نشد.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-[#b3b3b3] transition-colors hover:text-white"
            >
              لغو
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spDropIn {
          from { opacity: 0; transform: translateY(6px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}