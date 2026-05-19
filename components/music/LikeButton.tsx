"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { useLibraryStore, type CustomTrack } from "@/store/library-store";
import TrackPlaylistToast from "@/components/music/TrackPlaylistToast";

export default function LikeButton({
  track,
  artistTitle,
  className,
}: {
  track: any;
  artistTitle?: string;
  className?: string;
}) {
  const liked = useLibraryStore((s) => s.likedTracks.some((x: any) => x.id === track.id));
  const toggleLikedTrack = useLibraryStore((s) => s.toggleLikedTrack);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeLiked = !liked;
    const savedTrack: CustomTrack = {
      id: track.id,
      title: track.title,
      artist: artistTitle ?? track.artist ?? "",
      album: track.album ?? "",
      duration: String(track.duration ?? ""),
      cover: track.cover,
      src: track.src,
    };

    toggleLikedTrack(savedTrack);

    if (willBeLiked) {
      toast.custom((toastId) => <TrackPlaylistToast toastId={toastId} track={savedTrack} />, { duration: 7000 });
    } else {
      toast("از لیست اهنگ های لایک شده حذف شد.");
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.92 }}
      className={`w-8 h-8 flex items-center justify-center transition-colors ${className ?? ""} ${liked ? "text-accent-emerald" : "text-text-secondary hover:text-text-primary"}`}>
      <AnimatePresence mode="wait">
        {liked ? (
          <motion.span
            key="check"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 20 }}>
            <BadgeCheck className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="plus"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 20 }}>
            <Plus className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}