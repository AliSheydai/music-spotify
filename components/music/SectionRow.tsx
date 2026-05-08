import { useRef } from "react";
import { motion } from "framer-motion";
import { MusicCard } from "./MusicCard";
import type { Card } from "@/lib/mock-data";

export function SectionRow({ title, cards }: { title: string; cards: Card[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary hover:underline cursor-pointer">
          {title}
        </h2>
        <button className="text-xs font-bold text-text-secondary hover:text-text-primary hover:underline">
          نمایش همه
        </button>
      </div>

      <motion.div
        ref={scrollRef}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.05 },
          },
        }}
        className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
        style={{ scrollBehavior: "smooth" }}
        onWheel={(e) => {
          if (e.deltaY !== 0 && scrollRef.current) {
            // RTL: invert direction so wheel-down scrolls into the row naturally
            scrollRef.current.scrollLeft -= e.deltaY;
          }
        }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="snap-start"
          >
            <MusicCard card={card} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
