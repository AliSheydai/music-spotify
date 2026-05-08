import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Player } from "./Player";
import { NowPlayingPanel } from "./NowPlayingPanel";
import { motion } from "framer-motion";
import { usePlayerStore } from "../../store/player-store";
import { useLibraryStore } from "../../store/library-store";
import { useMemo } from "react";
import { featuredCards, radioCards, albumCards, artistCards, playlistCards } from "../../lib/mock-data";

const allCards = [...featuredCards, ...radioCards, ...albumCards, ...artistCards, ...playlistCards];

export function AppShell({ 
  children, 
  withPadding = true,
  transparentBg = false,
}: { 
  children: React.ReactNode;
  withPadding?: boolean;
  transparentBg?: boolean;
}) {
  const hoveredId = usePlayerStore((s) => s.hoveredCardId);
  const expanded = useLibraryStore((s) => s.sidebarMode === "expanded");

  const bgGradient = useMemo(() => {
    const card = allCards.find((c) => c.id === hoveredId);
    if (!card) return "linear-gradient(180deg, rgba(139,92,246,0.12), transparent 40%)";
    const seed = card.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const hues = [
      "rgba(139,92,246,0.18)",
      "rgba(244,114,182,0.18)",
      "rgba(16,185,129,0.18)",
      "rgba(201,168,76,0.20)",
      "rgba(59,130,246,0.18)",
      "rgba(239,68,68,0.18)",
    ];
    const hue = hues[seed % hues.length];
    return `linear-gradient(180deg, ${hue}, transparent 45%)`;
  }, [hoveredId]);

  return (
    <div className="h-screen flex flex-col bg-bg-base text-text-primary overflow-hidden">
      <div className="shrink-0 px-2">
        <div className="rounded-xl bg-bg-surface overflow-hidden">
          <Topbar />
        </div>
      </div>
      <div className="flex-1 flex gap-2 p-0 md:p-2 pt-0 md:pt-1 min-h-0 relative">
        <Sidebar />

        {!expanded && (
          <main className={`flex-1 min-w-0 rounded-xl overflow-hidden flex flex-col relative ${transparentBg ? 'bg-transparent' : 'bg-bg-surface'}`}>
            <motion.div
              animate={{ background: transparentBg ? 'none' : bgGradient }}
              transition={{ duration: 0.6 }}
              className="flex-1 overflow-y-auto"
            >
              {/* اعمال شرطی کلاس‌ها بر اساس پراپ withPadding */}
              <div className={withPadding ? "px-4 pt-2 pb-4 md:px-6 md:pt-4 md:px-8" : ""}>
                {children}
              </div>
            </motion.div>
          </main>
        )}

        <NowPlayingPanel />
      </div>

      <Player />
    </div>
  );
}
