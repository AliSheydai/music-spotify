'use client';

import { motion } from "framer-motion";
// import { AppShell } from "@/components/music/AppShell";
import { AppShell } from "../../components/music/AppShell";
const categories = [
  { label: "پاپ", color: "from-rose-500 to-pink-700" },
  { label: "سنتی", color: "from-amber-500 to-orange-700" },
  { label: "راک", color: "from-red-600 to-rose-800" },
  { label: "هیپ‌هاپ", color: "from-violet-600 to-fuchsia-800" },
  { label: "الکترونیک", color: "from-cyan-500 to-blue-700" },
  { label: "کلاسیک", color: "from-stone-600 to-zinc-800" },
  { label: "جاز", color: "from-emerald-500 to-teal-800" },
  { label: "بی‌کلام", color: "from-indigo-500 to-violet-800" },
  { label: "پادکست", color: "from-yellow-500 to-amber-700" },
  { label: "کتاب صوتی", color: "from-lime-500 to-green-800" },
];

export default function SearchPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6">دسته‌بندی‌های جستجو</h1>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {[...categories, ...categories].map((c, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.03 }}
            className={`relative aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br ${c.color} p-4 cursor-pointer shadow-[var(--shadow-card)]`}
          >
            <h3 className="text-xl font-bold text-white drop-shadow">{c.label}</h3>
          </motion.div>
        ))}
      </motion.div>
    </AppShell>
  );
}