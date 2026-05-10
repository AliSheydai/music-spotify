import { motion } from "framer-motion";
import { Play, Pause, Plus, Check } from "lucide-react";
import NextLink from "next/link";
import { usePlayerStore } from "../../store/player-store";
import type { Card } from "../../lib/mock-data";
import Image from "next/image";
import { useLibraryStore } from "../../store/library-store";

export function MusicCard({ card }: { card: Card }) {
  const { hoveredCardId, setHoveredCard, isPlaying, togglePlay, track, setTrack } = usePlayerStore();
  const isHovered = hoveredCardId === card.id;
  const isCurrent = track.id === card.id;
  const isCircle = card.type === "artist";

  const linkTo = card.type === "artist" ? "/artist/$id" : "/playlist/$id";

  function resolveTo(to: string, params?: Record<string, string>) {
    return to.replace(/\$(\w+)/g, (_, k) => (params && params[k] ? params[k] : ""));
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      setTrack({
        id: card.id,
        title: card.title,
        artist: card.subtitle,
        cover: card.cover,
        duration: 240,
      });
    }
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
      <NextLink
        href={resolveTo(linkTo, { id: card.id })}
        className="block p-1.5 md:p-2 lg:p-3 rounded-lg bg-transparent hover:bg-bg-elevated group"
      >
        <div className="relative mb-4">
          <img
            src={card.cover}
            alt={card.title}
            className={`w-full aspect-square object-cover shadow-[var(--shadow-card)] ${isCircle ? "rounded-full" : "rounded-lg"}`}
          />
            {/* Save album / follow controls */}
            {/* {card.type === "album" && (
              <AlbumSaveButton card={card} />
            )} */}
          {/* gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isCircle ? "rounded-full" : "rounded-lg"}`} />

          {/* Play button */}
          <motion.button
            onClick={handlePlay}
            initial={false}
            animate={{
              opacity: isHovered || (isCurrent && isPlaying) ? 1 : 0,
              y: isHovered || (isCurrent && isPlaying) ? 0 : 12,
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-2 left-2 w-12 h-12 rounded-full bg-accent-gold text-bg-base shadow-[var(--shadow-glow-gold)] flex items-center justify-center hover:scale-110 hover:bg-accent-gold/90 "
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
      </NextLink>
    </motion.div>
  );
}

function AlbumSaveButton({ card }: { card: Card }) {
  const isSaved = useLibraryStore((s) => s.isAlbumSaved(card.id));
  const toggleSave = useLibraryStore((s) => s.toggleSaveAlbum);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(card);
  };

  return (
    <button
      onClick={handle}
      title={isSaved ? "ذخیره‌شده" : "ذخیره"}
      className="absolute top-2 left-2 w-9 h-9 rounded-full bg-bg-elevated/80 backdrop-blur flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
      {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
    </button>
  );
}

// hide save control for virtual liked playlist if it ever appears as a card
function AlbumSaveButtonGuarded({ card }: { card: Card }) {
  if (!card || card.id === "liked") return null;
  return <AlbumSaveButton card={card} />;
}
