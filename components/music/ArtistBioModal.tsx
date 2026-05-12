"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function ArtistBioModal({
  open,
  onClose,
  artist,
  bio,
}: {
  open: boolean;
  onClose: () => void;
  artist: any;
  bio: string;
}) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[80] bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-3xl max-h-[86vh] overflow-y-auto rounded-lg bg-bg-surface shadow-[var(--shadow-card)] text-right"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute left-4 top-4 z-10 w-9 h-9 rounded-full bg-bg-overlay/90 hover:bg-bg-elevated flex items-center justify-center text-text-primary"
          title="بستن">
          <X className="w-5 h-5" />
        </button>
        <img src={artist.cover} alt={artist.title} className="w-full h-[360px] object-cover object-center" />
        <div className="grid md:grid-cols-[160px_1fr] gap-8 md:gap-16 p-4 bg-bg-card">
          <div className="space-y-6">
            <div className="flex flex-row md:flex-col items-center gap-2">
              <div className="text-3xl font-black tabular-nums">۳۶۴٬۳۹۸</div>
              <div className="text-sm text-text-secondary">دنبال‌کننده</div>
            </div>
            <div className="flex flex-row md:flex-col items-center gap-2">
              <div className="text-3xl font-black tabular-nums">۲٬۴۵۸٬۹۲۱</div>
              <div className="text-sm text-text-secondary">شنونده ماهانه</div>
            </div>
            <div className="text-sm font-bold">تهران، ایران</div>
          </div>
          <div>
            <h2 className="text-2xl font-black mb-4">{artist.title}</h2>
            <p className="text-text-secondary leading-8">{bio}</p>
            <p className="mt-4 text-text-secondary leading-8">
              این صفحه نمایی نزدیک‌تر از هویت هنری، آثار محبوب و مسیر
              موسیقایی خواننده را نمایش می‌دهد؛ درست مانند تجربه پروفایل
              هنرمندان در وب‌اپ‌های موسیقی.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
