"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/music/AppShell";
import { MusicCard } from "@/components/music/MusicCard";
import { useHomeData } from "@/lib/hooks";
import type { Card } from "@/lib/mock-data";

const COLLECTION_TITLES: Record<string, string> = {
  featured: "پیشنهاد ویژه برای شما",
  radio: "رادیوهای محبوب",
  albums: "آلبوم‌ها و تک‌آهنگ‌ها",
  artists: "هنرمندان محبوب",
  playlists: "پلی‌لیست‌های پیشنهادی 🔥",
  "related-artists": "طرفداران همچنین گوش می‌دهند",
  "artist-playlists": "بر اساس این هنرمند",
};

export default function CollectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "featured";
  const artistId = searchParams.get("artist");
  const { data } = useHomeData();

  const collections: Record<string, Card[]> = {
    featured: data?.featured ?? [],
    radio: data?.radio ?? [],
    albums: data?.albums ?? [],
    artists: data?.artists ?? [],
    playlists: data?.playlists ?? [],
    "related-artists": (data?.artists ?? []).filter((artist) => artist.id !== artistId),
    "artist-playlists": data?.playlists ?? [],
  };

  const cards = collections[slug] ?? collections.featured;
  const title = COLLECTION_TITLES[slug] ?? COLLECTION_TITLES.featured;

  const handleBack = async () => {
    const viewTransitionDocument = document as Document & {
      startViewTransition?: (callback: () => Promise<void>) => { finished: Promise<void> };
    };

    if (viewTransitionDocument.startViewTransition) {
      try {
        await viewTransitionDocument.startViewTransition(() => {
          router.back();
          return Promise.resolve();
        });
      } catch {
        router.back();
      }
    } else {
      router.back();
    }
  };

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-full px-1 py-8"
      >
        {/* <button
          type="button"
          onClick={handleBack}
          className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated text-text-secondary transition-colors hover:text-white"
          aria-label="بازگشت"
        >
          <ArrowLeft className="h-4 w-4" />
        </button> */}

        <div className="mb-8 mt-14 flex items-end justify-between gap-4">
          <div>
            {/* <p className="mb-2 text-xs font-bold text-text-secondary">مشاهده همه</p> */}
            <h1 className="text-xl font-black text-white md:text-3xl">{title}</h1>
          </div>
          <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-text-secondary md:inline-flex">
            {cards.length} مورد
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-4 2xl:grid-cols-8">
          {cards.map((card) => (
            <div key={card.id} className="min-w-0">
              <MusicCard card={card} />
            </div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}
