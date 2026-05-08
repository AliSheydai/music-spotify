'use client';

import { motion } from "framer-motion";
import { Play, Heart, MoreHorizontal, Clock, Music, Pencil, UserPlus, Search, X } from "lucide-react";
import { useRef, useState, use } from "react";
import { AppShell } from "@/components/music/AppShell";
import { featuredCards, playlistCards, albumCards } from "@/lib/mock-data";
import { usePlayerStore } from "@/store/player-store";
import { useLibraryStore } from "@/store/library-store";
import Image from "next/image";

// تعریف دیتای ثابت خارج از کامپوننت (همانند فایل اصلی خودتان)
const allPlaylists = [...featuredCards, ...playlistCards, ...albumCards];

const sampleTracks = Array.from({ length: 10 }).map((_, i) => ({
  id: `t${i}`,
  title: ["چتر خیس", "زخم زبون", "اتفاق", "دل‌من‌ای", "بی‌من‌مرو", "سرنوشت", "روزنه", "حیران", "ماه نو", "افسانه"][i],
  artist: ["محسن چاوشی", "همایون شجریان", "سیروان خسروی", "محسن یگانه", "بنیامین"][i % 5],
  album: "آلبوم برگزیده",
  duration: `${3 + (i % 3)}:${String((10 + i * 7) % 60).padStart(2, "0")}`,
}));

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export default function PlaylistPage({ params }: Props) {
  const { id } = use(params as Promise<{ id: string }>); // unwrap params safely
  
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const { customPlaylists, updatePlaylistCover, renamePlaylist, addTrackToPlaylist } = useLibraryStore();

  const custom = customPlaylists.find((p) => p.id === id);
  const card = allPlaylists.find((c) => c.id === id);
  const isLiked = id === "liked";

  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [showSearch, setShowSearch] = useState(custom?.tracks.length === 0);
  const [query, setQuery] = useState("");

  const title = custom ? custom.title : isLiked ? "آهنگ‌های لایک شده" : card?.title ?? "پلی‌لیست";
  const cover = custom?.cover ?? card?.cover;
  const tracks = custom ? custom.tracks : sampleTracks;

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !custom) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updatePlaylistCover(custom.id, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const filteredSuggest = sampleTracks.filter((t) =>
    !query.trim() || t.title.includes(query) || t.artist.includes(query),
  );

  const headerGradient = isLiked
    ? "from-violet-700/60 via-violet-900/30 to-transparent"
    : "from-violet-700/40 to-transparent";

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="-mx-6 -mt-4">
        {/* Header */}
        <div className={`px-6 pt-8 pb-6 bg-gradient-to-b ${headerGradient}`}>
          <div className="flex items-end gap-6">
            {/* Cover */}
            {custom ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="relative w-56 h-56 rounded-lg shadow-[var(--shadow-card)] overflow-hidden group bg-bg-elevated flex items-center justify-center"
                title="تغییر تصویر پلی‌لیست"
              >
                {cover ? (
                  <img src={cover} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-20 h-20 text-text-secondary" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Pencil className="w-8 h-8 text-white" />
                  <span className="text-white text-sm">انتخاب تصویر</span>
                </div>
                <input ref={fileRef} onChange={handleCover} type="file" accept="image/*" className="hidden" />
              </button>
            ) : isLiked ? (
              <div className="w-56 h-56 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-700 flex items-center justify-center shadow-[var(--shadow-card)]">
                <Heart className="w-24 h-24 text-white fill-white" />
              </div>
            ) : (
              (cover ? (
                <img src={cover} alt={title} className="w-56 h-56 rounded-lg shadow-[var(--shadow-card)] object-cover" />
              ) : (
                <div className="w-56 h-56 rounded-lg shadow-[var(--shadow-card)] bg-bg-elevated flex items-center justify-center">
                  <Music className="w-20 h-20 text-text-secondary" />
                </div>
              ))
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase">{custom ? "پلی‌لیست عمومی" : "پلی‌لیست"}</p>

              {custom && editing ? (
                <input
                  autoFocus
                  defaultValue={title}
                  onBlur={(e) => {
                    renamePlaylist(custom.id, e.target.value || title);
                    setEditing(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  className="text-6xl font-black my-3 bg-bg-elevated/60 rounded px-2 py-1 outline-none w-full max-w-[90%]"
                />
              ) : (
                <h1
                  className={`text-6xl font-black my-3 break-words ${custom ? "cursor-pointer hover:opacity-80" : ""}`}
                  onClick={() => custom && setEditing(true)}
                >
                  {title}
                </h1>
              )}

              <p className="text-sm text-text-secondary mt-2">
                <span className="text-text-primary font-semibold">شما</span>
                {tracks.length > 0 && <span> • {tracks.length} آهنگ</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="px-6 py-4 flex items-center gap-6">
          {tracks.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-accent-gold text-bg-base flex items-center justify-center shadow-[var(--shadow-glow-gold)]"
            >
              <Play className="w-6 h-6 fill-current mr-0.5" />
            </motion.button>
          )}
          {custom && (
            <button
              onClick={() => setShowSearch((v) => !v)}
              className="text-text-secondary hover:text-text-primary transition-colors"
              title="افزودن آهنگ"
            >
              <UserPlus className="w-7 h-7" />
            </button>
          )}
          {!custom && (
            <button className="text-text-secondary hover:text-accent-rose transition-colors">
              <Heart className="w-8 h-8" />
            </button>
          )}
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <MoreHorizontal className="w-7 h-7" />
          </button>
        </div>

        {/* Track list */}
        <div className="px-6">
          {tracks.length > 0 && (
            <div className="grid grid-cols-[24px_1fr_1fr_60px] gap-4 px-4 py-2 border-b border-border-default text-xs text-text-secondary uppercase">
              <span>#</span>
              <span>عنوان</span>
              <span>آلبوم</span>
              <Clock className="w-4 h-4 mx-auto" />
            </div>
          )}

          {tracks.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[24px_1fr_1fr_60px] gap-4 px-4 py-2 rounded-md hover:bg-bg-elevated text-sm group cursor-pointer"
            >
              <span className="text-text-secondary self-center">{i + 1}</span>
              <div className="min-w-0">
                <div className="font-medium text-text-primary truncate">{t.title}</div>
                <div className="text-text-secondary text-xs truncate">{t.artist}</div>
              </div>
              <div className="text-text-secondary self-center truncate">{t.album}</div>
              <div className="text-text-secondary self-center text-center tabular-nums">{t.duration}</div>
            </motion.div>
          ))}

          {/* Empty state for custom playlist */}
          {custom && tracks.length === 0 && !showSearch && (
            <div className="py-16 text-center text-text-secondary">
              این پلی‌لیست هنوز خالی است. روی دکمه افزودن آهنگ بزن.
            </div>
          )}

          {/* Add-songs panel */}
          {custom && showSearch && (
            <div className="mt-6 border-t border-border-default pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">بگذار چیزی برای پلی‌لیستت پیدا کنیم</h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center text-text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative max-w-md mb-6">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی آهنگ یا قسمت پادکست"
                  className="w-full bg-bg-elevated rounded-md pr-9 pl-3 py-2.5 text-sm outline-none border border-transparent focus:border-border-strong"
                />
              </div>

              <div className="space-y-1">
                {filteredSuggest.map((t) => {
                  const added = custom.tracks.some((x) => x.id === t.id);
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-bg-elevated group"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-text-primary truncate">{t.title}</div>
                        <div className="text-xs text-text-secondary truncate">
                          {t.artist} • {t.album}
                        </div>
                      </div>
                      <button
                        disabled={added}
                        onClick={() => addTrackToPlaylist(custom.id, t)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold border border-border-strong transition-colors ${
                          added
                            ? "text-text-secondary cursor-default"
                            : "text-text-primary hover:scale-105"
                        }`}
                      >
                        {added ? "افزوده شد" : "افزودن"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AppShell>
  );
}