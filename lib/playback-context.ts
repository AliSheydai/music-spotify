import type { Card, Track } from "./mock-data";
import { artistCards, albumCards } from "./mock-data";
import { normalizePlayableQueue } from "./music-catalog";

const ARTIST_TRACK_TITLES = ["بی‌قرار", "شاید", "باران", "دل دیوانه", "خاطره‌ها"];
const ARTIST_TRACK_DURATIONS = [314, 345, 238, 379, 165];

export function isTrackInQueue(trackId: string | undefined, queue: Track[]) {
  return Boolean(trackId && queue.some((track) => track.id === trackId));
}

export function buildArtistPlaybackQueue(artist: Pick<Card, "id" | "title" | "cover">) {
  const fallbackCovers = albumCards.length ? albumCards : [{ cover: artist.cover }];
  const tracks = ARTIST_TRACK_TITLES.map((title, index) => ({
    id: `${artist.id}-t${index + 1}`,
    title,
    duration: ARTIST_TRACK_DURATIONS[index] ?? 200,
    artist: artist.title,
    cover: fallbackCovers[index % fallbackCovers.length]?.cover ?? artist.cover,
  }));

  return normalizePlayableQueue(tracks, {
    artist: artist.title,
    cover: artist.cover,
  });
}

export function buildPlaylistPlaybackQueue(card: Pick<Card, "id" | "title" | "cover" | "tracks">) {
  if (card.tracks?.length) {
    return normalizePlayableQueue(card.tracks, {
      artist: card.title,
      cover: card.cover,
    });
  }

  const tracks = Array.from({ length: 8 }).map((_, index) => ({
    id: `${card.id}-t${index}`,
    title: `قطعه ${index + 1}`,
    artist: artistCards[index % artistCards.length]?.title ?? card.title,
    cover: card.cover,
    duration: 180 + index * 10,
  }));

  return normalizePlayableQueue(tracks, {
    artist: card.title,
    cover: card.cover,
  });
}

export function buildCardPlaybackQueue(card: Card) {
  if (card.type === "artist") return buildArtistPlaybackQueue(card);
  return buildPlaylistPlaybackQueue(card);
}