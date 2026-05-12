"use client";

import { toast } from "sonner";
import { useLibraryStore } from "@/store/library-store";

export default function FollowButton({ artist }: { artist: any }) {
  const isFollowed = useLibraryStore((s) => s.isArtistFollowed(artist.id));
  const toggle = useLibraryStore((s) => s.toggleFollowArtist);

  const card = {
    id: artist.id,
    title: artist.title,
    subtitle: artist.subtitle ?? "هنرمند",
    cover: artist.cover ?? "",
    type: "artist",
  } as const;

  const handle = () => {
    toggle(card as any);
    if (!isFollowed) {
      toast.success("به کتابخانه اضافه شد.");
    } else {
      toast("از کتابخانه حذف شد.");
    }
  };

  return (
    <button
      onClick={handle}
      className={`px-6 py-2 rounded-full border transition-transform text-sm font-bold cursor-pointer`}>
      {isFollowed ? "دنبال شده" : "دنبال کردن"}
    </button>
  );
}
