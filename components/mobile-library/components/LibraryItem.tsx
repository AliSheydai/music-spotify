"use client";

import Image from "next/image";
import NextLink from "next/link";
import { Heart } from "lucide-react";
import type { Card } from "@/lib/mock-data";
import { Bookmark } from 'lucide-react';

interface LibraryItemProps {
  item: Card;
  isGridView: boolean;
}

function resolveTo(to: string, params?: Record<string, string>) {
  return to.replace(/\$(\w+)/g, (_, k) =>
    params && params[k] ? params[k] : ""
  );
}

function ItemCover({
  item,
  className,
}: {
  item: Card;
  className?: string;
}) {
  const isLiked = item.id === "liked";
  const isEpisode = item.id === "episodes";
  const isArtist = item.type === "artist";

  if (isLiked) {
    return (
      <div
        className={`bg-gradient-to-br from-violet-500 to-fuchsia-700 flex items-center justify-center ${className}`}
      >
        <Heart className="text-white fill-white" size={24}/>
      </div>
    );
  }

  if (isEpisode) {
    return (
      <div
        className={`bg-accent-emerald flex items-center justify-center ${className}`}
      >
        <Bookmark className="fill-yellow-400 text-yellow-400" size={28} />
      </div>
    );
  }

  if (item.cover) {
    return (
      <Image
        src={item.cover}
        alt={item.title}
        width={200}
        height={200}
        className={`object-cover ${isArtist ? "rounded-full" : ""} ${className}`}
      />
    );
  }

  return (
    <div
      className={`bg-bg-elevated flex items-center justify-center ${isArtist ? "rounded-full" : ""} ${className}`}
    >
      <span className="text-text-muted text-2xl">♪</span>
    </div>
  );
}

function ListItem({ item }: { item: Card }) {
  const isArtist = item.type === "artist";
  const isLiked = item.id === "liked";
  const to = resolveTo(isArtist ? "/artist/$id" : "/playlist/$id", {
    id: item.id,
  });

  return (
    <NextLink href={to} className="flex items-center gap-3 px-4 py-2.5 active:bg-bg-elevated transition-colors">
      <ItemCover
        item={item}
        className={`w-14 h-14 shrink-0 ${isArtist ? "rounded-full" : "rounded-lg"}`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary truncate leading-tight mb-2">
          {item.title}
        </p>
        <p
          className={`text-xs truncate leading-tight ${
            isLiked ? "text-accent-gold" : "text-gray-400"
          }`}
        >
          {isArtist ? "هنرمند" : item.subtitle}
        </p>
      </div>
    </NextLink>
  );
}

function GridItem({ item }: { item: Card }) {
  const isArtist = item.type === "artist";
  const isLiked = item.id === "liked";
  const to = resolveTo(isArtist ? "/artist/$id" : "/playlist/$id", {
    id: item.id,
  });

  return (
    <NextLink href={to} className="flex flex-col gap-2 active:opacity-70 transition-opacity">
      <ItemCover
        item={item}
        className={`w-full aspect-square ${isArtist ? "rounded-full" : "rounded-xl"}`}
      />
      <div className="px-0.5">
        <p className="text-xs font-semibold text-text-primary truncate leading-snug">
          {item.title}
        </p>
        <p
          className={`text-[11px] truncate leading-snug ${
            isLiked ? "text-accent-emerald" : "text-text-secondary"
          }`}
        >
          {isArtist ? "هنرمند" : item.subtitle}
        </p>
      </div>
    </NextLink>
  );
}

export function LibraryItem({ item, isGridView }: LibraryItemProps) {
  return isGridView ? <GridItem item={item} /> : <ListItem item={item} />;
}
