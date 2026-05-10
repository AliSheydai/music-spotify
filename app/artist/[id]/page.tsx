"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Play, BadgeCheck, MoreHorizontal, Plus, X } from "lucide-react";
import { AppShell } from "@/components/music/AppShell";
import { SectionRow } from "@/components/music/SectionRow";
import { useArtist, useHomeData } from "@/lib/hooks";
import { useLibraryStore } from "@/store/library-store";
import { usePlayerStore } from "@/store/player-store";
import { ArrowLeft } from "lucide-react";
import { TransitionLink } from "@/components/view-transition";
// در Next.js پارامترها به این صورت دریافت می‌شوند
import LikeButton from "@/components/music/LikeButton";

function ArtistTrackLikeButton({ track, artist }: { track: any; artist: any }) {
  return <LikeButton track={track} artistTitle={artist?.title} />;
}

function FollowButton({ artist }: { artist: any }) {
  const isFollowed = useLibraryStore((s) => s.isArtistFollowed(artist.id));
  const toggle = useLibraryStore((s) => s.toggleFollowArtist);

  const card = {
    id: artist.id,
    title: artist.title,
    subtitle: artist.subtitle ?? "هنرمند",
    cover: artist.cover ?? "",
    type: "artist",
  } as const;

  const handle = () => {
    toggle(card as any);
    if (!isFollowed) {
      toast.success("به کتابخانه اضافه شد.");
    } else {
      toast("از کتابخانه حذف شد.");
    }
  };

  return (
    <button
      onClick={handle}
      className={`px-6 py-2 rounded-full border transition-transform text-sm font-bold cursor-pointer`}>
      {isFollowed ? "دنبال شده" : "دنبال کردن"}
    </button>
  );
}

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
  const setTrack = usePlayerStore((s) => s.setTrack);

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
      cover:
        homeData?.albums?.[i]?.cover ??
        homeData?.albums?.[0]?.cover ??
        "/images/moein.jpg",
    }),
  );

  const artistBio = `${artist.title} از چهره‌های شناخته‌شده موسیقی فارسی است...`;
  const formatDuration = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

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
        {/* back button */}
        <TransitionLink href="/" className="absolute top-5 left-5 z-50 md:hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface/50 text-gray-300 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
        </TransitionLink>

        {/* Hero */}
        <div
          className="relative flex flex-col items-center md:flex-row md:items-end p-4 pb-4 min-h-[480px] md:h-[340px] overflow-hidden transition-all"
          style={{ backgroundColor: tintSoft }} // رنگ اصلی هنرمند در پس‌زمینه موبایل
        >
          {/* پس‌زمینه مخصوص دسکتاپ (Banner Mode) - در موبایل مخفی است */}
          <div
            className="absolute inset-0 hidden md:block md:h-4/5"
            style={{
              backgroundImage: `linear-gradient(180deg, transparent 0%, ${tintSoft} 95%), url(${artist.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
            }}
          />

          {/* لایه گرادینت برای موبایل (برای شبیه شدن به عکس ارسالی) */}
          <div className="absolute inset-0 md:hidden bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* عکس دایره‌ای - فقط در موبایل نمایش داده می‌شود */}
          <div className="relative z-10 md:hidden mt-12 mb-8">
            <div className="w-52 h-52 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-4 border-white/5">
              <img
                src={artist.cover}
                alt={artist.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* بخش متون */}
          <div className="relative z-10 w-full flex flex-col items-start text-right">
            {/* تغییر: items-center حذف و items-start جایگزین شد تا در موبایل هم راست‌چین باشد */}

            <div className="flex items-center gap-2 mb-2 w-full justify-start">
              <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-400 fill-blue-400 stroke-bg-base" />
              <span className="text-xs md:text-sm font-medium">
                هنرمند تأیید شده
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black drop-shadow-2xl text-white w-full">
              {artist.title}
            </h1>

            <p className="text-white/80 md:text-text-secondary mt-3 text-sm md:text-base w-full">
              ۲٬۴۵۸٬۹۲۱ شنونده ماهانه
            </p>

            {/* بخش دکمه‌ها */}
            <div className="pt-4 flex items-center justify-start max-md:justify-between gap-6 bg-transparent w-full">
              {/* تغییر: max-md:justify-between به justify-start تغییر کرد تا دکمه‌ها به راست بچسبند */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="w-14 h-14 rounded-full bg-accent-gold text-bg-base flex items-center justify-center shadow-[var(--shadow-glow-gold)] cursor-pointer">
                <Play className="w-6 h-6 fill-current mr-0.5" />
              </motion.button>

              {/* Follow button wired to library store */}
              <FollowButton artist={artist} />
            </div>
          </div>
        </div>

        <section className="px-6 py-8">
          <h2 className="text-2xl font-black mb-4">محبوب‌ترین‌ها</h2>
          <div className="max-w-5xl space-y-1" dir="rtl">
            {popularTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                // تغییرات اصلی در خط پایین اعمال شده است:
                className="group grid grid-cols-[1fr_auto] md:grid-cols-[20px_minmax(220px,1fr)_minmax(90px,160px)_96px] items-center gap-4 rounded-md w-full py-2 hover:bg-bg-elevated/70 transition-colors">
                {/* دکمه ایندکس (فقط در دسکتاپ) */}
                <button
                  onClick={() => setTrack({ ...track, artist: artist.title })}
                  className="hidden md:flex w-8 h-8 items-center justify-center text-text-secondary hover:text-text-primary">
                  <span className="group-hover:hidden text-sm tabular-nums">
                    {index + 1}
                  </span>
                  <Play className="hidden group-hover:block w-4 h-4 fill-current" />
                </button>

                {/* بخش اطلاعات آهنگ (باید در موبایل کل فضای باقی‌مانده را بگیرد) */}
                <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 text-right">
                    <div className="font-bold text-sm truncate text-white">
                      {track.title}
                    </div>
                    <div className="text-xs text-text-secondary truncate">
                      {track.plays}
                    </div>
                  </div>
                </div>

                {/* ستون تعداد پخش (مخفی در موبایل) */}
                <div className="text-sm text-text-secondary tabular-nums hidden md:block">
                  {track.plays}
                </div>

                {/* بخش زمان و دکمه‌های کنترلی */}
                <div className="flex items-center justify-end gap-2 md:gap-4 text-text-secondary">
                  <button className="hidden md:block opacity-0 group-hover:opacity-100 hover:text-text-primary transition-opacity">
                    {/* like button */}
                    <ArtistTrackLikeButton track={track} artist={artist} />
                  </button>
                  <span className="text-sm tabular-nums">
                    {formatDuration(track.duration)}
                  </span>
                  <button className="md:opacity-0 md:group-hover:opacity-100 hover:text-text-primary transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
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

      {bioOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[80] bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setBioOpen(false)}>
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-full max-w-3xl max-h-[86vh] overflow-y-auto rounded-lg bg-bg-surface shadow-[var(--shadow-card)] text-right"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setBioOpen(false)}
              className="absolute left-4 top-4 z-10 w-9 h-9 rounded-full bg-bg-overlay/90 hover:bg-bg-elevated flex items-center justify-center text-text-primary"
              title="بستن">
              <X className="w-5 h-5" />
            </button>
            <img
              src={artist.cover}
              alt={artist.title}
              className="w-full h-[360px] object-cover object-center"
            />
            <div className="grid md:grid-cols-[160px_1fr] gap-8 md:gap-16 p-4 bg-bg-card">
              <div className="space-y-6">
                <div className="flex flex-row md:flex-col items-center gap-2">
                  <div className="text-3xl font-black tabular-nums">
                    ۳۶۴٬۳۹۸
                  </div>
                  <div className="text-sm text-text-secondary">دنبال‌کننده</div>
                </div>
                <div className="flex flex-row md:flex-col items-center gap-2">
                  <div className="text-3xl font-black tabular-nums">
                    ۲٬۴۵۸٬۹۲۱
                  </div>
                  <div className="text-sm text-text-secondary">
                    شنونده ماهانه
                  </div>
                </div>
                <div className="text-sm font-bold">تهران، ایران</div>
              </div>
              <div>
                <h2 className="text-2xl font-black mb-4">{artist.title}</h2>
                <p className="text-text-secondary leading-8">{artistBio}</p>
                <p className="mt-4 text-text-secondary leading-8">
                  این صفحه نمایی نزدیک‌تر از هویت هنری، آثار محبوب و مسیر
                  موسیقایی خواننده را نمایش می‌دهد؛ درست مانند تجربه پروفایل
                  هنرمندان در وب‌اپ‌های موسیقی.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AppShell>
  );
}
