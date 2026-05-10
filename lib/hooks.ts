import { useQuery } from "@tanstack/react-query";
import { fetchHomeData, fetchPlaylistById, fetchSidebarItems, fetchArtistById, fetchCurrentTrack } from "./api";

export function useHomeData() {
  return useQuery(["home-data"], fetchHomeData, { staleTime: 1000 * 60 * 5 });
}

export function usePlaylist(id: string | undefined) {
  return useQuery(["playlist", id], () => (id ? fetchPlaylistById(id) : Promise.resolve(null)), {
    enabled: Boolean(id),
  });
}

export function useArtist(id: string | undefined) {
  return useQuery(["artist", id], () => (id ? fetchArtistById(id) : Promise.resolve(null)), {
    enabled: Boolean(id),
  });
}

export function useSidebarItems() {
  return useQuery(["sidebar-items"], fetchSidebarItems, { staleTime: 1000 * 60 * 10 });
}

export function useCurrentTrack() {
  return useQuery(["current-track"], fetchCurrentTrack, { staleTime: 1000 * 30 });
}
