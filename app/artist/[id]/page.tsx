"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AppShell } from "@/components/music/AppShell";
import { SectionRow } from "@/components/music/SectionRow";
import ArtistHero from "@/components/music/ArtistHero";
import ArtistTrackRow from "@/components/music/ArtistTrackRow";
import ArtistBioModal from "@/components/music/ArtistBioModal";
import { useArtistPageData } from "@/hooks/useArtistPageData";

export default function ArtistPage() {
  const {
    id,
    artist,
    homeData,
    bioOpen,
    setBioOpen,
    popularExpanded,
    setPopularExpanded,
    playTrack,
    playablePopularTracks,
    visiblePopularTracks,
    artistBio,
    background,
  } = useArtistPageData();

  return (
    <AppShell>
      <motion.div
        key={artist.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="-mx-6 md:-mx-10 -mt-4 px-2"
        style={{ background }}
      >
        <ArtistHero artist={artist} setTrack={playTrack} tracks={playablePopularTracks} onOpenBio={() => setBioOpen(true)} />

        <section className="px-6 py-8">
          <h2 className="text-2xl font-black mb-4">محبوب‌ترین‌ها</h2>
          <div className="max-w-5xl space-y-1" dir="rtl">
            {visiblePopularTracks.map((track, index) => (
              <ArtistTrackRow key={track.id} track={track} index={index} artist={artist} setTrack={playTrack} queue={playablePopularTracks} />
            ))}
          </div>
          <button
            onClick={() => setPopularExpanded((value) => !value)}
            className="mt-4 text-sm font-bold text-text-secondary hover:text-text-primary"
          >
            {popularExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
          </button>
        </section>

        <div className="px-6">
          <SectionRow
            title="آلبوم‌ها و تک‌آهنگ‌ها"
            isShowAll={true}
            showAllHref={`/collection/albums?artist=${artist.id}`}
            cards={(homeData?.albums ?? []).slice().reverse()}
          />

          <section className="mb-12">
            <h2 className="text-2xl font-black mb-4">درباره هنرمند</h2>
            <button
              onClick={() => setBioOpen(true)}
              className="group relative block w-full max-w-[680px] h-[340px] overflow-hidden rounded-lg text-right shadow-[var(--shadow-card)]"
            >
              <Image
                src={artist.cover}
                className="absolute inset-0 w-full h-full object-cover object-center"
                alt={artist.title}
                fill
                sizes="(max-width: 768px) 100vw, 680px"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />

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
            isShowAll={true}
            showAllHref={`/collection/related-artists?artist=${artist.id}`}
            cards={(homeData?.artists ?? []).filter((artistItem) => artistItem.id !== id)}
          />
          <SectionRow
            title="بر اساس این هنرمند"
            isShowAll={true}
            showAllHref={`/collection/artist-playlists?artist=${artist.id}`}
            cards={homeData?.playlists ?? []}
          />
        </div>
      </motion.div>

      <ArtistBioModal open={bioOpen} onClose={() => setBioOpen(false)} artist={artist} bio={artistBio} />
    </AppShell>
  );
}
