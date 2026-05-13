"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Plus } from "lucide-react";
import { useLibraryStore } from "@/store/library-store";
import { toast } from "sonner";

const AlbumSaveButton = React.forwardRef<HTMLButtonElement, { card: any } & React.ButtonHTMLAttributes<HTMLButtonElement>>(function AlbumSaveButton({ card, className: cls, onClick: onClickProp, ...rest }, ref) {
  const isSaved = useLibraryStore((s) => s.isAlbumSaved(card?.id));
  const toggleSave = useLibraryStore((s) => s.toggleSaveAlbum);

  if (!card || card.id === "liked") return null;

  const handle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const willBeSaved = !isSaved;
    toggleSave({
      id: card.id,
      title: card.title ?? card?.name ?? "",
      subtitle: card.subtitle ?? "",
      cover: card.cover ?? "",
      type: card.type ?? "album",
    });

    if (willBeSaved) {
      toast.success("به کتابخانه اضافه شد.");
    } else {
      toast("از کتابخانه حذف شد.");
    }
    if (onClickProp) onClickProp(e as any);
  };

  const baseClass = `w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSaved ? "text-accent-emerald" : "text-white/70 hover:text-accent-rose"}`;

  return (
    <motion.button
      ref={ref}
      onClick={handle}
      whileTap={{ scale: 0.92 }}
      className={`${baseClass} ${cls ?? ""}`}
      {...(rest as any)}>
      <AnimatePresence mode="wait">
        {isSaved ? (
          <motion.span
            key="check"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 20 }}>
            <BadgeCheck className="w-5 h-5" />
          </motion.span>
        ) : (
          <motion.span
            key="plus"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 20 }}>
            <Plus className="w-5 h-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
});

export default AlbumSaveButton;
