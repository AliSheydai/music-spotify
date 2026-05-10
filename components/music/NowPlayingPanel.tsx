import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, Maximize2, Minimize2, MoreHorizontal, Share2, Plus, BadgeCheck, ChevronRight, Music2 } from "lucide-react";
import { useRef } from "react";
import { usePlayerStore } from "../../store/player-store";
import { artistCards, albumCards } from "../../lib/mock-data";
import Image from "next/image";

export function NowPlayingPanel() {
  const open = usePlayerStore((s) => s.nowPlayingOpen);
  const fullscreen = usePlayerStore((s) => s.nowPlayingFullscreen);
  const setOpen = usePlayerStore((s) => s.setNowPlayingOpen);
  const toggleFs = usePlayerStore((s) => s.toggleNowPlayingFullscreen);
  const track = usePlayerStore((s) => s.track);

  return (
    <>
      <AnimatePresence>
        {!open && !fullscreen && (
          <motion.aside
            key="np-rail"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 38, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="shrink-0 overflow-hidden hidden md:flex"
          >
            <button
              onClick={() => setOpen(true)}
              title="باز کردن در حال پخش"
              className="h-full w-[38px] rounded-xl bg-bg-surface hover:bg-bg-elevated transition-colors flex flex-col items-center justify-center gap-4 text-text-secondary hover:text-text-primary"
            >
              <ChevronRight className="w-5 h-5" />
              <Music2 className="w-4 h-4 opacity-70" />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
      {open && !fullscreen && (
        <motion.aside
          key="np-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="shrink-0 overflow-hidden hidden md:flex"
        >
          <div className="h-full w-[360px] rounded-xl bg-bg-surface flex flex-col">
            <PanelHeader onClose={() => setOpen(false)} onFs={toggleFs} fullscreen={false} />
            <div className="flex-1 overflow-y-auto">
              <PanelBody track={track} fullscreen={false} />
            </div>
          </div>
        </motion.aside>
      )}

      {open && fullscreen && (
        <motion.div
          key="np-fs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-20 rounded-xl overflow-hidden hidden md:block"
          style={{
            background: `radial-gradient(120% 80% at 50% 0%, rgba(220,38,38,0.55), rgba(10,10,15,1) 60%)`,
          }}
        >
          <FullscreenView track={track} onClose={() => setOpen(false)} onFs={toggleFs} />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

function PanelHeader({
  onClose,
  onFs,
  fullscreen,
  title,
}: {
  onClose: () => void;
  onFs: () => void;
  fullscreen: boolean;
  title?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-sm font-bold truncate">{title ?? "در حال پخش"}</div>
      <div className="flex items-center gap-1 text-text-secondary">
        <button className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center hover:text-text-primary transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <button
          onClick={onFs}
          title={fullscreen ? "کوچک کردن" : "تمام صفحه"}
          className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center hover:text-text-primary transition-colors"
        >
          {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PanelBody({ track, fullscreen }: { track: { title: string; artist: string; cover: string }; fullscreen: boolean }) {
  const artist = artistCards[0];
  const album = albumCards[0];

  return (
    <div className={`flex flex-col gap-4 ${fullscreen ? "px-8 pb-12" : "px-4 pb-6"}`}>
      {/* Cover */}
      <motion.img
        layout
        src={track.cover}
        alt={track.title}
        className={`w-full aspect-square object-cover rounded-lg shadow-[var(--shadow-card)] ${fullscreen ? "max-w-[420px] mx-auto" : ""}`}
      />

      {/* Track meta */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xl font-bold truncate hover:underline cursor-pointer">{track.title}</div>
          <div className="text-sm text-text-secondary truncate hover:underline cursor-pointer">{track.artist}</div>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <button className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center hover:text-text-primary transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center hover:text-text-primary transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* About artist card */}
      <div
        className="rounded-lg overflow-hidden bg-bg-card relative"
        style={{
          backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 70%, var(--bg-card) 100%), url(${artist.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="h-44" />
        <div className="px-4 pb-4 -mt-16 relative">
          <div className="text-xs text-text-secondary mb-1">درباره هنرمند</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold">{artist.title}</span>
            <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400 stroke-bg-base" />
          </div>
          <div className="text-xs text-text-secondary mb-3">۲٬۴۵۸٬۹۲۱ شنونده ماهانه</div>
          <p className="text-xs text-text-secondary leading-6 line-clamp-3">
            یکی از برجسته‌ترین هنرمندان موسیقی فارسی با سبکی منحصربه‌فرد. آثار این هنرمند ترکیبی از موسیقی سنتی و مدرن است که مخاطبان بسیاری در سراسر جهان دارد.
          </p>
          <button className="mt-3 px-4 py-1.5 rounded-full border border-border-strong text-xs font-bold hover:scale-105 transition-transform">
            دنبال کردن
          </button>
        </div>
      </div>

      {/* Credits */}
      <div className="rounded-lg bg-bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold">عوامل</div>
          <button className="text-xs text-text-secondary hover:underline">نمایش همه</button>
        </div>
        <div className="space-y-3">
          <CreditRow name={track.artist} role="هنرمند اصلی" />
          <CreditRow name="استودیو ترانه" role="تهیه کننده" />
          <CreditRow name="بهرام دهلوی" role="آهنگساز" />
        </div>
      </div>

      {/* Next in queue */}
      <div className="rounded-lg bg-bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold">بعدی در صف پخش</div>
          <button className="text-xs text-text-secondary hover:underline">باز کردن صف</button>
        </div>
        <div className="flex items-center gap-3">
          <img src={album.cover} alt={album.title} className="w-10 h-10 rounded-md object-cover" />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{album.title}</div>
            <div className="text-xs text-text-secondary truncate">{album.subtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreditRow({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{name}</div>
        <div className="text-xs text-text-secondary truncate">{role}</div>
      </div>
      <button className="px-3 py-1 rounded-full border border-border-strong text-xs hover:scale-105 transition-transform">
        دنبال کردن
      </button>
    </div>
  );
}

function FullscreenView({
  track,
  onClose,
  onFs,
}: {
  track: { title: string; artist: string; cover: string };
  onClose: () => void;
  onFs: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: ref });
  const coverOpacity = useTransform(scrollY, [0, 300], [1, 0.15]);
  const coverScale = useTransform(scrollY, [0, 300], [1, 0.85]);
  const coverY = useTransform(scrollY, [0, 300], [0, -40]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between shrink-0">
        <div className="text-base font-bold">{track.artist}</div>
        <div className="flex items-center gap-1 text-text-secondary">
          <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center hover:text-text-primary transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={onFs}
            title="کوچک کردن"
            className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center hover:text-text-primary transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={ref} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="min-h-[60vh] flex items-center justify-center px-6 pt-6 pb-12">
          <motion.img
            src={track.cover}
            alt={track.title}
            style={{ opacity: coverOpacity, scale: coverScale, y: coverY }}
            className="max-w-[420px] w-full aspect-square object-cover rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className="max-w-5xl mx-auto px-8 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white/5 backdrop-blur-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold">درباره هنرمند</div>
            </div>
            <img
              src={artistCards[0].cover}
              alt={artistCards[0].title}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <div className="text-base font-bold mb-1">{artistCards[0].title}</div>
            <div className="text-xs text-text-secondary mb-4">۲۱۹٬۲۷۴ شنونده ماهانه</div>
            <button className="px-5 py-1.5 rounded-full border border-border-strong text-sm font-bold hover:scale-105 transition-transform mb-4">
              دنبال کردن
            </button>
            <p className="text-sm text-text-secondary leading-7">
              یکی از برجسته‌ترین هنرمندان موسیقی فارسی با سبکی منحصربه‌فرد. آثار این هنرمند ترکیبی از موسیقی سنتی و مدرن است که مخاطبان بسیاری در سراسر جهان دارد.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-white/5 backdrop-blur-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold">عوامل</div>
                <button className="text-xs text-text-secondary hover:underline">نمایش همه</button>
              </div>
              <div className="space-y-4">
                <CreditRow name={track.artist} role="هنرمند اصلی" />
              </div>
            </div>

            <div className="rounded-xl bg-white/5 backdrop-blur-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold">بعدی در صف پخش</div>
                <button className="text-xs text-text-secondary hover:underline">باز کردن صف</button>
              </div>
              <div className="flex items-center gap-3">
                <img src={albumCards[0].cover} alt="" className="w-12 h-12 rounded-md object-cover" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{albumCards[0].title}</div>
                  <div className="text-xs text-text-secondary truncate">{albumCards[0].subtitle}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
