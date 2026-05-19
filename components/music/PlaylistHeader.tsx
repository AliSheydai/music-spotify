"use client";

import React, { useEffect, useState } from "react";
import { Music, Heart, Pencil, Pause, Play, X } from "lucide-react";
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
  onCoverChange,
  tracks,
  onUpdateDetails,
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
  onUpdateDetails?: (details: { title: string; description?: string }) => void;
  tracks: Track[];
}) {

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftDescription, setDraftDescription] = useState(custom?.description ?? "");

  const playTrack = usePlayerStore((state) => state.playTrack);
  const currentTrack = usePlayerStore((state) => state.track);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const firstTrack = tracks[0];
  const isCurrentQueue = isTrackInQueue(currentTrack.id, tracks);

  useEffect(() => {
    if (!detailsOpen) {
      setDraftTitle(title);
      setDraftDescription(custom?.description ?? "");
    }
  }, [custom?.description, detailsOpen, title]);


  const handlePlayClick = () => {
    if (!firstTrack) return;

    if (isCurrentQueue) {
      togglePlay();
      return;
    }

    playTrack(firstTrack, tracks);
  };

  const saveDetails = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanTitle = draftTitle.trim() || title;
    onUpdateDetails?.({ title: cleanTitle, description: draftDescription.trim() });
    setDetailsOpen(false);
  };

  return (
    <>
      <TransitionLink href="/" className="absolute top-5 left-5 z-50 md:hidden">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface/50 text-gray-300 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
      </TransitionLink>

      <div className="relative px-4 pt-12 pb-6 bg-gradient-to-b from-violet-700/40 to-transparent md:pt-8">
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
                  <span className="mt-2 text-sm font-bold text-white">انتخاب تصویر</span>
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
            <p className="hidden md:block text-xs font-bold uppercase mb-2">{custom ? "پلی‌لیست شخصی" : "پلی‌لیست"}</p>
            {custom ? (
              <button
                type="button"
                onClick={() => setDetailsOpen(true)}
                className="block w-full rounded-md text-right outline-none hover:underline focus-visible:ring-2 focus-visible:ring-white/80"
                aria-label="ویرایش اطلاعات پلی‌لیست"
              >
                <h1 className="text-3xl md:text-7xl font-black text-white mb-2 leading-tight">{title}</h1>
              </button>
            ) : (
              <h1 className="text-3xl md:text-7xl font-black text-white mb-2 leading-tight">{title}</h1>
            )}
            
            {custom?.description && <p className="mb-2 max-w-2xl text-sm leading-6 text-white/70">{custom.description}</p>}
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
            {!custom && <AlbumSaveButton card={headerCard} className="cursor-pointer" />}
            <button className="text-white/70">
              <MoreHorizontalIcon />
            </button>
          </div>
        </div>
      </div>

      {custom && detailsOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true" dir="rtl">
          <form onSubmit={saveDetails} className="w-full max-w-xl rounded-xl bg-[#282828] p-6 text-right text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">ویرایش اطلاعات</h2>
              <button type="button" onClick={() => setDetailsOpen(false)} className="rounded-full p-2 text-text-secondary hover:bg-white/10 hover:text-white" aria-label="بستن">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[180px_1fr]">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative flex aspect-square items-center justify-center overflow-hidden rounded bg-bg-elevated shadow-lg"
              >
                {cover ? <img src={cover} alt={title} className="h-full w-full object-cover" /> : <Music className="h-16 w-16 text-text-secondary" />}
                <span className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                  <Pencil className="h-6 w-6" />
                  <span className="mt-2 text-sm font-bold">انتخاب تصویر</span>
                </span>
              </button>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-text-secondary">نام</span>
                  <input
                    autoFocus
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    className="w-full rounded border border-border-strong bg-white/10 px-3 py-3 font-bold outline-none focus:border-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-text-secondary">توضیحات</span>
                  <textarea
                    value={draftDescription}
                    onChange={(event) => setDraftDescription(event.target.value)}
                    placeholder="توضیح اختیاری اضافه کنید"
                    className="h-28 w-full resize-none rounded border border-transparent bg-white/10 px-3 py-3 text-sm outline-none placeholder:text-text-secondary focus:border-white"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="max-w-sm text-xs leading-6 text-white/70">با ذخیره تغییرات، اطلاعات این پلی‌لیست شخصی در کتابخانه شما به‌روزرسانی می‌شود.</p>
              <button type="submit" className="rounded-full bg-white px-8 py-3 text-sm font-black text-black hover:scale-105">
                ذخیره
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function MoreHorizontalIcon() {
  return <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>;
}
