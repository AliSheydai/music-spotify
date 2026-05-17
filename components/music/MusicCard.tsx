import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { TransitionLink } from "@/components/view-transition";
import { buildCardPlaybackQueue, isTrackInQueue } from "@/lib/playback-context";
import { usePlayerStore } from "@/store/player-store";
import type { Card } from "@/lib/mock-data";

export function MusicCard({ card }: { card: Card }) {
  const { hoveredCardId, setHoveredCard, isPlaying, togglePlay, track, playTrack } = usePlayerStore();
  const queue = buildCardPlaybackQueue(card);
  const firstTrack = queue[0];
  const isHovered = hoveredCardId === card.id;
  const isCurrent = isTrackInQueue(track.id, queue);
  const isCircle = card.type === "artist";

  const linkTo = card.type === "artist" ? "/artist/$id" : "/playlist/$id";

  function resolveTo(to: string, params?: Record<string, string>) {
    return to.replace(/\$(\w+)/g, (_, k) => (params && params[k] ? params[k] : ""));
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstTrack) return;

    if (isCurrent) {
      togglePlay();
      return;
    }
    playTrack(firstTrack, queue);
  };

  return (
    <motion.div
      // initial={{scale: 1}}
      onHoverStart={() => setHoveredCard(card.id)}
      onHoverEnd={() => setHoveredCard(null)}
      // whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="shrink-0 w-[180px]"
    >
      <TransitionLink
        href={resolveTo(linkTo, { id: card.id })}
      >
        <div className="block p-1.5 md:p-2 lg:p-3 rounded-lg bg-transparent hover:bg-bg-elevated group">
        <div className="relative mb-4">
          <img
            src={card.cover}
            alt={card.title}
            className={`w-full aspect-square object-cover shadow-[var(--shadow-card)] ${isCircle ? "rounded-full" : "rounded-lg"}`}
          />
          {/* gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isCircle ? "rounded-full" : "rounded-lg"}`} />

          {/* Play button */}
          <motion.button
            onClick={handlePlay}
            disabled={!firstTrack}
            aria-label={isCurrent && isPlaying ? `توقف پخش ${card.title}` : `پخش ${card.title}`}
            initial={false}
            animate={{
              opacity: isHovered || (isCurrent && isPlaying) ? 1 : 0,
              y: isHovered || (isCurrent && isPlaying) ? 0 : 12,
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-2 left-2 w-12 h-12 rounded-full bg-accent-gold text-bg-base shadow-[var(--shadow-glow-gold)] flex items-center justify-center hover:scale-110 hover:bg-accent-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current mr-0.5" />
            )}
          </motion.button>
        </div>

        <h3 className="font-semibold text-text-primary text-sm mb-1 truncate">
          {card.title}
        </h3>
        <p className="text-xs text-text-secondary text-truncate-2 leading-relaxed">
          {card.type === "album" && card.tracks && card.tracks.length > 0
            ? `${card.subtitle} • ${card.tracks.length} آهنگ`
            : card.subtitle}
        </p>
      </div>
      </TransitionLink>
    </motion.div>
  );
}