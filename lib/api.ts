import {
  featuredCards,
  radioCards,
  albumCards,
  artistCards,
  playlistCards,
  currentTrack,
  type Card,
  type Track,
} from "./mock-data";

// This file provides an API-like adapter around the existing mock-data.
// When backend is ready, replace implementations with real fetch calls.

export async function fetchHomeData(): Promise<{ featured: Card[]; radio: Card[]; albums: Card[]; artists: Card[]; playlists: Card[] }> {
  // simulate async API
  await new Promise((r) => setTimeout(r, 50));
  return {
    featured: featuredCards,
    radio: radioCards,
    albums: albumCards,
    artists: artistCards,
    playlists: playlistCards,
  };
}

export async function fetchPlaylistById(id: string): Promise<{ card: Card | null; tracks: Track[] } | null> {
  await new Promise((r) => setTimeout(r, 50));
  const all = [...featuredCards, ...playlistCards, ...albumCards];
  const card = all.find((c) => c.id === id) ?? null;
  // simple synthetic tracks for demo
  const tracks: Track[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `${id}-t${i}`,
    title: `قطعه ${i + 1}`,
    artist: artistCards[i % artistCards.length].title,
    cover: card?.cover ?? "/images/moein.jpg",
    duration: 180 + i * 10,
  }));

  return { card, tracks };
}

export async function fetchArtistById(id: string) {
  await new Promise((r) => setTimeout(r, 50));
  const artist = artistCards.find((a) => a.id === id) ?? artistCards[0];
  return { artist, albums: albumCards.slice(0, 4), playlists: playlistCards.slice(0, 4) };
}

export async function fetchSidebarItems() {
  await new Promise((r) => setTimeout(r, 20));
  return [...featuredCards.slice(0, 2), ...artistCards.slice(0, 6), ...albumCards.slice(0, 4)];
}

export async function fetchCurrentTrack(): Promise<Track> {
  await new Promise((r) => setTimeout(r, 10));
  return currentTrack;
}
