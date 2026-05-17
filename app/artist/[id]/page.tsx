"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/music/AppShell";
import { SectionRow } from "@/components/music/SectionRow";
import { useArtist, useHomeData } from "@/lib/hooks";
import { usePlayerStore } from "@/store/player-store";
import ArtistHero from "@/components/music/ArtistHero";
import ArtistTrackRow from "@/components/music/ArtistTrackRow";
import ArtistBioModal from "@/components/music/ArtistBioModal";
import { normalizePlayableQueue } from "@/lib/music-catalog";
// در Next.js پارامترها به این صورت دریافت می‌شوند

export default function ArtistPage() {
  const params = useParams();
  const id = (params && (params as any).id) || "";

  // منطق دریافت هنرمند و محتوای مرتبط از TanStack Query
  const { data: artistData } = useArtist(id);
  const { data: homeData } = useHomeData();
  const artist = artistData?.artist ??
    homeData?.artists?.[0] ?? {
      id: "",
      title: "هنرمند",
      subtitle: "",
      cover: "/images/moein.jpg",
      type: "artist",
    };
  const [bioOpen, setBioOpen] = useState(false);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const popularTracks = (homeData?.albums ?? Array.from({ length: 5 })).map(
    (alb, i) => ({
      id: `${artist.id}-t${i + 1}`,
      title:
        ["بی‌قرار", "شاید", "باران", "دل دیوانه", "خاطره‌ها"][i] ??
        `قطعه ${i + 1}`,
      plays:
        ["۶٬۴۶۳٬۶۰۴", "۳٬۲۷۱٬۵۱۰", "۲٬۳۷۱٬۵۶۳", "۲٬۵۲۱٬۰۵۶", "۸۰۹٬۰۷۸"][i] ??
        "",
      duration: [314, 345, 238, 379, 165][i] ?? 200,
      artist: artist.title,
      cover:
        homeData?.albums?.[i]?.cover ??
        homeData?.albums?.[0]?.cover ??
        artist.cover ??
        "/images/moein.jpg",
    }),
  );
  const playablePopularTracks = normalizePlayableQueue(popularTracks, {
    artist: artist.title,
    cover: artist.cover,
  });

  const artistBio = `${artist.title} از چهره‌های شناخته‌شده موسیقی فارسی است...`;
  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  const seed = artist.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = (seed * 47) % 360;
  const tint = `hsl(${hue}, 42%, 22%)`;
  const tintSoft = `hsl(${hue}, 38%, 14%)`;

  return (
    <AppShell>
      <motion.div
        key={artist.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="-mx-6 md:-mx-10 -mt-4 px-2"
        style={{
          background: `linear-gradient(180deg, ${tint} 0%, ${tintSoft} 360px, var(--bg-surface) 720px)`,
        }}>
        <ArtistHero artist={artist} setTrack={playTrack} tracks={playablePopularTracks} onOpenBio={() => setBioOpen(true)} />

        <section className="px-6 py-8">
          <h2 className="text-2xl font-black mb-4">محبوب‌ترین‌ها</h2>
          <div className="max-w-5xl space-y-1" dir="rtl">
            {playablePopularTracks.map((track, index) => (
              <ArtistTrackRow key={track.id} track={track} index={index} artist={artist} setTrack={playTrack} queue={playablePopularTracks} />
            ))}
          </div>
          <button className="mt-4 text-sm font-bold text-text-secondary hover:text-text-primary">
            نمایش بیشتر
          </button>
        </section>

        <div className="px-6">
          <SectionRow
            title="آلبوم‌ها و تک‌آهنگ‌ها"
            isShowAll={false}
            cards={(homeData?.albums ?? []).slice().reverse()}
          />

          <section className="mb-12">
            <h2 className="text-2xl font-black mb-4">درباره هنرمند</h2>
            <button
              onClick={() => setBioOpen(true)}
              className="group relative block w-full max-w-[680px] h-[340px] overflow-hidden rounded-lg text-right shadow-[var(--shadow-card)]">
              {/* عکس به صورت یک لایه جداگانه با کنترل کامل */}
              <img
                src={artist.cover}
                className="absolute inset-0 w-full h-full object-cover object-center"
                alt={artist.title}
              />

              {/* لایه گرادینت روی عکس */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />

              {/* محتوا */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <div className="text-sm font-bold mb-2 text-white">
                  ۲٬۴۵۸٬۹۲۱ شنونده ماهانه
                </div>
                <p className="text-sm leading-7 text-white/90 max-w-[560px] line-clamp-3">
                  {artistBio}
                </p>
              </div>
            </button>
          </section>
          <SectionRow
            title="طرفداران همچنین گوش می‌دهند"
            isShowAll={false}
            cards={(homeData?.artists ?? []).filter((a) => a.id !== id)}
          />
          <SectionRow
            title="بر اساس این هنرمند"
            isShowAll={false}
            cards={homeData?.playlists ?? []}
          />
        </div>
      </motion.div>

      <ArtistBioModal open={bioOpen} onClose={() => setBioOpen(false)} artist={artist} bio={artistBio} />
    </AppShell>
  );
}
