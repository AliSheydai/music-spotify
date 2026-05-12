"use client";

import { X, Search } from "lucide-react";

export default function AddSongsPanel({
  custom,
  showSearch,
  setShowSearch,
  query,
  setQuery,
  filteredSuggest,
  addTrackToPlaylist,
}: {
  custom: any;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  query: string;
  setQuery: (v: string) => void;
  filteredSuggest: any[];
  addTrackToPlaylist: (id: string, t: any) => void;
}) {
  if (!custom || !showSearch) return null;

  return (
    <div className="mt-6 border-t border-border-default pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">بگذار چیزی برای پلی‌لیستت پیدا کنیم</h2>
        <button onClick={() => setShowSearch(false)} className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center text-text-secondary">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="relative max-w-md mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی آهنگ یا قسمت پادکست" className="w-full bg-bg-elevated rounded-md pr-9 pl-3 py-2.5 text-sm outline-none border border-transparent focus:border-border-strong" />
      </div>

      <div className="space-y-1">
        {filteredSuggest.map((t) => {
          const added = custom.tracks.some((x: any) => x.id === t.id);
          return (
            <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-bg-elevated group">
              <div className="min-w-0">
                <div className="font-medium text-text-primary truncate">{t.title}</div>
                <div className="text-xs text-text-secondary truncate">{t.artist} • {t.album}</div>
              </div>
              <button disabled={added} onClick={() => addTrackToPlaylist(custom.id, t)} className={`px-4 py-1.5 rounded-full text-xs font-bold border border-border-strong transition-colors ${added ? "text-text-secondary cursor-default" : "text-text-primary hover:scale-105"}`}>
                {added ? "افزوده شد" : "افزودن"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
