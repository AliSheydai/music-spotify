"use client";

import type { Card } from "@/lib/mock-data";
import { LibraryItem } from "./LibraryItem";

interface LibraryListProps {
  items: Card[];
}

interface LibraryGridProps {
  items: Card[];
}

export function LibraryList({ items }: LibraryListProps) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <LibraryItem key={item.id} item={item} isGridView={false} />
      ))}
    </div>
  );
}

export function LibraryGrid({ items }: LibraryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-5 px-4 pt-2 pb-4">
      {items.map((item) => (
        <LibraryItem key={item.id} item={item} isGridView={true} />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  query?: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  if (query) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <p className="text-lg font-bold text-text-primary mb-2">نتیجه‌ای پیدا نشد</p>
        <p className="text-sm text-text-secondary">
          جستجوی «{query}» نتیجه‌ای نداشت
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <p className="text-2xl font-bold text-text-primary mb-3">
        موارد دلخواهتان را پیدا کنید
      </p>
      <p className="text-sm text-text-secondary leading-relaxed">
        همه چیزهایی را که ذخیره، دنبال، یا ایجاد کرده‌اید جستجو کنید.
      </p>
    </div>
  );
}
