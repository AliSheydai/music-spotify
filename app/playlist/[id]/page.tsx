"use client";

import { motion } from "framer-motion";
import { Heart, Clock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState, use } from "react";
import { AppShell } from "@/components/music/AppShell";
import { usePlaylist, useArtist, useCurrentTrack } from "@/lib/hooks";
import { usePlayerStore } from "@/store/player-store";
import { useLibraryStore } from "@/store/library-store";
import Link from "next/link";
// LikeButton used inside track rows; imported by row component
import PlaylistHeader from "@/components/music/PlaylistHeader";
import PlaylistTrackRow from "@/components/music/PlaylistTrackRow";
import AddSongsPanel from "@/components/music/AddSongsPanel";
// tooltip primitives removed from this page (used in shared UI components)
import { TransitionLink } from "@/components/view-transition";

// AlbumSaveButton and header/rows extracted to components in components/music/

// نمونه دیتا محلی برای زمانی که API داده‌ای برنگرداند

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

  const router = useRouter();

  const handleBack = async () => {
    if (typeof document !== "undefined" && (document as any).startViewTransition) {
      try {
        await (document as any).startViewTransition(() => {
          router.back();
          return Promise.resolve();
        });
      } catch (e) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const {
    customPlaylists,
    updatePlaylistCover,
    addTrackToPlaylist,
  } = useLibraryStore();
  const likedTracks = useLibraryStore((s) => s.likedTracks);

  const custom = customPlaylists.find((p) => p.id === id);
  const { data: playlistData } = usePlaylist(id);
  const card = custom ? undefined : (playlistData?.card ?? undefined);
  const isLiked = id === "liked";

  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [showSearch, setShowSearch] = useState(
    (custom?.tracks.length ?? 0) === 0 || (isLiked && likedTracks.length === 0),
  );
  const [query, setQuery] = useState("");

  const title = custom
    ? custom.title
    : isLiked
      ? "آهنگ‌های لایک شده"
      : (card?.title ?? "پلی‌لیست");
  const cover = custom?.cover ?? card?.cover;
  const tracks = custom
    ? custom.tracks
    : isLiked
    ? likedTracks
    : (playlistData?.tracks ?? sampleTracks);

  // headerCard represents the item shown in the header (playlist/album)
  const headerCard: any = card ?? {
    id,
    title,
    subtitle: "",
    cover: cover ?? "",
    type: isLiked ? "playlist" : ((card as any)?.type ?? "album"),
  };
  const headerIsSaved = useLibraryStore((s) => s.isAlbumSaved(headerCard.id));

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
    const parts = String(d)
      .split(":")
      .map((p) => parseInt(p, 10));
    if (
      parts.length === 2 &&
      !Number.isNaN(parts[0]) &&
      !Number.isNaN(parts[1])
    ) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const { data: artistData } = useArtist(id);
  const artist = artistData?.artist ?? undefined;
  useCurrentTrack();
  const setTrack = usePlayerStore((s) => s.setTrack);
  const currentTrack = usePlayerStore((s) => s.track);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="-mx-6 md:-mx-10 -mt-4 px-2">
        {/* back button */}
        <button onClick={handleBack} className="absolute top-5 left-5 z-50 md:hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface/50 text-gray-300 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
        </button>
        <PlaylistHeader
          custom={custom}
          isLiked={isLiked}
          headerCard={headerCard}
          cover={cover}
          title={title}
          tracksLength={tracks.length}
          fileRef={fileRef}
          editing={editing}
          setEditing={setEditing}
          onCoverChange={handleCover}
          headerIsSaved={headerIsSaved}
        />

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

          {tracks.map((t, i) => (
            <PlaylistTrackRow
              key={t.id}
              t={t}
              i={i}
              artist={artist}
              cover={cover}
              setTrack={setTrack}
              isPlaying={isPlaying}
              currentTrack={currentTrack}
              formatDuration={formatDuration}
              parseDuration={parseDuration}
            />
          ))}

          {/* Empty state for liked playlist */}
          {isLiked && tracks.length === 0 && (
            <div className="py-24 text-center text-white/90">
              <div className="max-w-2xl mx-auto">
                <div className="w-40 h-40 mx-auto rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-2xl mb-6">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-black mb-3">آهنگ‌های لایک‌شده</h2>
                <p className="text-lg text-white/70 mb-6">آهنگ‌هایی که دوست دارید و علامت قلب می‌زنید اینجا نمایش داده می‌شوند.</p>
                <p className="text-sm text-white/60 mb-6">برای ذخیره آهنگ، روی آیکون قلب کنار هر آهنگ کلیک کنید.</p>
                <div className="flex items-center justify-center">
                  <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold shadow-sm">
                    یافتن آهنگ
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* Empty state for custom playlist */}
          {custom && tracks.length === 0 && !showSearch && (
            <div className="py-16 text-center text-text-secondary">
              این پلی‌لیست هنوز خالی است. روی دکمه افزودن آهنگ بزن.
            </div>
          )}

          <AddSongsPanel
            custom={custom}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            query={query}
            setQuery={setQuery}
            filteredSuggest={filteredSuggest}
            addTrackToPlaylist={addTrackToPlaylist}
          />
        </div>
      </motion.div>
    </AppShell>
  );
}
