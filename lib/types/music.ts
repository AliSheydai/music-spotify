import type { Card, Track } from "@/lib/mock-data";
import type { CustomPlaylist, CustomTrack } from "@/store/library-store";

export type MusicCard = Card;
export type MusicTrack = {
  id?: string;
  title?: string;
  artist?: string;
  cover?: string;
  duration?: number | string;
  src?: string;
  album?: string;
};
export type PlaylistCard = Card & { tracks?: Track[] };

export type ArtistSummary = Pick<Card, "id" | "title" | "subtitle" | "cover" | "type">;

export type SaveableAlbumCard = Pick<Card, "id" | "title" | "subtitle" | "cover" | "type">;

export type AddSongsPanelProps = {
  custom?: CustomPlaylist;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  query: string;
  setQuery: (v: string) => void;
  filteredSuggest: CustomTrack[];
  addTrackToPlaylist: (id: string, t: CustomTrack) => void;
};
