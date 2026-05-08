'use client'; // الزامی برای استفاده از انیمیشن و کامپوننت‌های اینتراکتیو

import { motion } from "framer-motion";
import { AppShell } from "../components/music/AppShell";
import { SectionRow } from "../components/music/SectionRow";
import { SearchHero } from "../components/music/SearchHero";
import { featuredCards, radioCards, albumCards, artistCards, playlistCards } from "../lib/mock-data";

const filters = ["همه", "موسیقی", "پادکست", "کتاب صوتی"];

export default function HomePage() {
  return (
    <AppShell withPadding={false} transparentBg={true}>
      <SearchHero />

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 mt-8 md:px-8 md:pt-6 md:pb-10 px-4 pt-2 pb-4">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              i === 0
                ? "bg-text-primary text-bg-base"
                : "bg-bg-elevated text-text-primary hover:bg-bg-overlay"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="md:px-6 md:pt-4 md:pb-8 px-4 pt-2 pb-4"
      >
        <SectionRow title="پیشنهاد ویژه برای شما" cards={featuredCards} />
        <SectionRow title="رادیوهای محبوب" cards={radioCards} />
        <SectionRow title="آلبوم‌ها و تک‌آهنگ‌ها" cards={albumCards} />
        <SectionRow title="هنرمندان محبوب" cards={artistCards} />
        <SectionRow title="پلی‌لیست‌های پیشنهادی 🔥" cards={playlistCards} />
      </motion.div>
    </AppShell>
  );
}