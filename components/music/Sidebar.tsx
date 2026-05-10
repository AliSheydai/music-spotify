import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search as SearchIcon,
  Library,
  Plus,
  Heart,
  Maximize2,
  Minimize2,
  X,
  AlignJustify,
  List as ListIcon,
  LayoutGrid,
  Grid3x3,
  Check,
} from "lucide-react";
import { useMemo, useRef, useEffect, useState, type ReactNode } from "react";
import { useSidebarItems } from "@/lib/hooks";
import type { Card } from "@/lib/mock-data";
import {
  useLibraryStore,
  type LibraryView,
  type LibrarySort,
} from "../../store/library-store";
import Image from "next/image";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

function resolveTo(to: string, params?: Record<string, string> | undefined) {
  return to.replace(/\$(\w+)/g, (_, k) =>
    params && params[k] ? params[k] : "",
  );
}

function Link({
  to,
  params,
  ...props
}: { to: string; params?: Record<string, string> } & Omit<
  React.ComponentProps<typeof NextLink>,
  "href"
>) {
  const href = resolveTo(to, params);
  // @ts-ignore allow passing className/title/etc to NextLink
  return <NextLink href={href} {...props} />;
}

const navItems = [
  { label: "خانه", icon: Home, to: "/" as const },
  { label: "جستجو", icon: SearchIcon, to: "/search" as const },
];

export function Sidebar() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const {
    sidebarMode,
    toggleCollapsed,
    toggleExpanded,
    filter,
    setFilter,
    view,
    setView,
    sort,
    setSort,
    searchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    baseItems,
    customPlaylists,
    createPlaylist,
  } = useLibraryStore();
  const [sortOpen, setSortOpen] = useState(false);

  const collapsed = sidebarMode === "collapsed";
  const expanded = sidebarMode === "expanded";
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Liked songs as a virtual playlist card
  const likedCard: Card = {
    id: "liked",
    title: "آهنگ‌های لایک شده",
    subtitle: "پلی‌لیست • ۱۲۴ آهنگ",
    cover: "",
    type: "playlist",
  };

  const customAsCards: Card[] = customPlaylists.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: "پلی‌لیست • شما",
    cover: p.cover ?? "",
    type: "playlist",
  }));

  const allItems: Card[] = useMemo(() => {
    return [likedCard, ...customAsCards, ...baseItems];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseItems, customPlaylists]);

  const { data: sidebarQueryItems } = useSidebarItems();

  const filtered = useMemo(() => {
    let list = allItems;
    if (filter === "playlists") list = list.filter((i) => i.type === "playlist" || i.type === "album");
    if (filter === "artists") list = sidebarQueryItems ? sidebarQueryItems.filter((i) => i.type === "artist") : list.filter((i) => i.type === "artist");
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sort === "alphabetical")
      sorted.sort((a, b) => a.title.localeCompare(b.title, "fa"));
    else if (sort === "creator")
      sorted.sort((a, b) => a.subtitle.localeCompare(b.subtitle, "fa"));
    else if (sort === "recentlyAdded") sorted.reverse();
    return sorted;
  }, [allItems, filter, searchQuery, sort]);

  const sortLabels: Record<LibrarySort, string> = {
    recents: "اخیر",
    recentlyAdded: "اخیراً افزوده‌شده",
    alphabetical: "الفبایی",
    creator: "سازنده",
  };
  const viewIcon: Record<LibraryView, typeof AlignJustify> = {
    compact: AlignJustify,
    list: ListIcon,
    grid: LayoutGrid,
    largeGrid: Grid3x3,
  };
  const CurrentViewIcon = viewIcon[view];

  const handleCreate = () => {
    const pl = createPlaylist();
    router.push(resolveTo("/playlist/$id", { id: pl.id }));
  };

  const width = collapsed ? "w-[72px]" : expanded ? "w-full" : "w-[300px]";

  return (
    <aside
      className={`hidden md:flex shrink-0 flex-col gap-2 transition-[width] duration-300 ${width}`}>
      {/* Top nav box */}
      <div className="bg-bg-surface rounded-xl p-2">
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-4 px-3 py-3 rounded-lg text-text-secondary hover:text-text-primary transition-colors group ${collapsed ? "justify-center" : ""}`}>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-bg-elevated rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <item.icon
                className={`relative w-6 h-6 ${active ? "text-accent-gold" : ""}`}
              />
              {!collapsed && (
                <span
                  className={`relative font-medium ${active ? "text-text-primary" : ""}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Library */}
      <div className="bg-bg-surface rounded-xl flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div
          className={`flex ${collapsed ? "flex-col items-center gap-3 px-0" : "flex-row items-center justify-between px-4"} pt-4 pb-2`}>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleCollapsed}
                  className={`flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer ${collapsed ? "" : ""}`}>
                  <Library className="w-6 h-6" />
                  {!collapsed && (
                    <span className="font-semibold">کتابخانه شما</span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="!p-2 bg-bg-surface">
                <div className="text-sm font-medium text-white truncate max-w-[180px] pb-1.5">
                  {collapsed ? "باز کردن کتابخانه" : "بستن کتابخانه"}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {collapsed && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCreate}
                    className="w-9 h-9 rounded-full bg-bg-elevated hover:bg-overlay flex items-center justify-center text-text-primary transition-colors cursor-pointer"
                    title="ایجاد">
                    <Plus className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                  className="!p-2 bg-bg-surface">
                  <div className="text-sm font-medium text-white truncate max-w-[180px] pr-1.5">
                    ساختن پلی لیست یا فولدر
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {!collapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleCreate}
                className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-bg-elevated hover:bg-bg-overlay text-text-primary text-sm font-medium transition-colors duration-300 cursor-pointer">
                <Plus className="w-4 h-4" />
                ایجاد
              </button>
              <button
                onClick={toggleExpanded}
                className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                title={expanded ? "کوچک کردن" : "بزرگ کردن"}>
                {expanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Filter chips */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-4 pb-3">
            <AnimatePresence initial={false}>
              {(filter !== "all" || searchOpen) && (
                <motion.button
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 32 }}
                  exit={{ opacity: 0, width: 0 }}
                  onClick={() => {
                    setFilter("all");
                    setSearchOpen(false);
                  }}
                  className="w-8 h-8 shrink-0 rounded-full bg-bg-elevated hover:bg-bg-overlay flex items-center justify-center text-text-secondary"
                  title="پاک کردن فیلتر">
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            <FilterChip
              active={filter === "playlists"}
              onClick={() =>
                setFilter(filter === "playlists" ? "all" : "playlists")
              }>
              پلی‌لیست‌ها
            </FilterChip>
            <FilterChip
              active={filter === "artists"}
              onClick={() =>
                setFilter(filter === "artists" ? "all" : "artists")
              }>
              هنرمندان
            </FilterChip>
          </div>
        )}

        {/* Search row */}
        {!collapsed && (
          <div className="flex items-center justify-between px-4 pb-2 gap-2">
            <div className="flex-1 flex items-center">
              <AnimatePresence initial={false} mode="wait">
                {searchOpen ? (
                  <motion.div
                    key="input"
                    initial={{ width: 32, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: 32, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full">
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        if (!searchQuery) setSearchOpen(false);
                      }}
                      placeholder="جستجو در کتابخانه"
                      className="w-full bg-bg-elevated rounded-md pr-9 pl-8 py-1.5 text-sm text-text-primary placeholder:text-text-secondary outline-none border border-transparent focus:border-border-strong"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-text-secondary hover:text-text-primary">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchOpen(true)}
                    className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                    title="جستجو در کتابخانه">
                    <SearchIcon className="w-4 h-4 cursor-pointer" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                title="مرتب‌سازی و نمایش">
                <span>{sortLabels[sort]}</span>
                <CurrentViewIcon className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setSortOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 z-50 w-56 rounded-md bg-bg-elevated shadow-[var(--shadow-card)] border border-border-default p-1 text-right">
                      <div className="px-3 pt-2 pb-1 text-xs text-text-secondary">
                        مرتب‌سازی
                      </div>
                      {(Object.keys(sortLabels) as LibrarySort[]).map((k) => (
                        <button
                          key={k}
                          onClick={() => {
                            setSort(k);
                            setSortOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded hover:bg-bg-overlay ${sort === k ? "text-accent-emerald" : "text-text-primary"}`}>
                          <span>{sortLabels[k]}</span>
                          {sort === k && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                      <div className="my-1 h-px bg-border-default" />
                      <div className="px-3 pt-1 pb-1 text-xs text-text-secondary">
                        نمایش به صورت
                      </div>
                      <div className="grid grid-cols-4 gap-1 p-1">
                        {(Object.keys(viewIcon) as LibraryView[]).map((v) => {
                          const Icon = viewIcon[v];
                          return (
                            <button
                              key={v}
                              onClick={() => {
                                setView(v);
                                setSortOpen(false);
                              }}
                              className={`h-9 rounded flex items-center justify-center transition-colors ${view === v ? "bg-bg-overlay text-accent-emerald" : "text-text-secondary hover:text-text-primary hover:bg-bg-overlay cursor-pointer"}`}
                              title={v}>
                              <Icon className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Items list */}
        <div
          className={`flex-1 overflow-y-auto no-scrollbar ${collapsed ? "px-0 flex flex-col items-center gap-3 pt-2" : "px-2"} pb-2`}>
          {view === "grid" || view === "largeGrid" ? (
            <ExpandedGrid items={filtered} large={view === "largeGrid"} />
          ) : (
            filtered.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                active={pathname.includes(item.id)}
                compact={view === "compact"}
              />
            ))
          )}

          {!collapsed && filtered.length === 0 && (
            <div className="text-center text-sm text-text-secondary p-6">
              چیزی پیدا نشد
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full cursor-pointer ${
        active
          ? "bg-text-primary text-bg-base"
          : "bg-bg-elevated text-text-primary hover:bg-bg-overlay"
      }`}>
      {children}
    </button>
  );
}

function SidebarItem({
  item,
  collapsed,
  active,
  compact,
}: {
  item: Card;
  collapsed: boolean;
  active: boolean;
  compact?: boolean;
}) {
  const isLiked = item.id === "liked";
  const isArtist = item.type === "artist";
  const to = isArtist ? "/artist/$id" : "/playlist/$id";

  const cover = isLiked ? null : item.cover;

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={to}
              params={{ id: item.id }}
              title={item.title}
              className={`relative block ${active ? "ring-2 ring-accent-gold rounded-md" : ""}`}>
              {isLiked ? (
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-700 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
              ) : cover ? (
                <img
                  src={cover}
                  alt={item.title}
                  className={`w-12 h-12 object-cover ${isArtist ? "rounded-full" : "rounded-md"}`}
                />
              ) : (
                <div
                  className={`w-12 h-12 bg-bg-elevated flex items-center justify-center ${isArtist ? "rounded-full" : "rounded-md"}`}>
                  <span className="text-text-secondary text-xs">
                    {item.title.slice(0, 2)}
                  </span>
                </div>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={8}
            className="!p-2 bg-bg-surface">
            <div className="flex flex-col items-start">
              <div className="text-sm font-medium text-white truncate max-w-[180px] pr-1.5">
                {item.title}
              </div>
              <div className="text-xs text-gray-400 truncate max-w-[180px] pr-1.5">
                {isArtist ? "هنرمند" : "پلی‌لیست"}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (compact) {
    return (
      <Link
        to={to}
        params={{ id: item.id }}
        className={`flex items-baseline gap-2 px-3 py-1.5 rounded hover:bg-bg-elevated transition-colors ${active ? "bg-bg-elevated" : ""}`}>
        <span
          className={`text-sm font-bold truncate ${isLiked ? "text-accent-emerald" : "text-text-primary"}`}>
          {item.title}
        </span>
        <span className="text-xs text-text-secondary truncate">
          • {isArtist ? "هنرمند" : isLiked ? "پلی‌لیست" : item.subtitle}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      params={{ id: item.id }}
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-bg-elevated ${active ? "bg-bg-elevated" : ""}`}>
      {isLiked ? (
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-700 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
      ) : cover ? (
        <img
          src={cover}
          alt={item.title}
          className={`w-12 h-12 object-cover shrink-0 ${isArtist ? "rounded-full" : "rounded-md"}`}
        />
      ) : (
        <div
          className={`w-12 h-12 bg-bg-elevated flex items-center justify-center shrink-0 ${isArtist ? "rounded-full" : "rounded-md"}`}>
          <span className="text-text-secondary text-xs">♪</span>
        </div>
      )}
      <div className="min-w-0">
        <div className="text-sm font-medium text-text-primary truncate">
          {item.title}
        </div>
        <div
          className={`text-xs truncate ${isLiked ? "text-accent-emerald" : "text-text-secondary"}`}>
          {isArtist ? "هنرمند" : item.subtitle}
        </div>
      </div>
    </Link>
  );
}

function ExpandedGrid({ items, large }: { items: Card[]; large?: boolean }) {
  const min = large ? 170 : 110;
  return (
    <div
      className="grid gap-3 p-2"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
      }}>
      {items.map((item) => {
        const isLiked = item.id === "liked";
        const isArtist = item.type === "artist";
        const to = isArtist ? "/artist/$id" : "/playlist/$id";
        return (
          <Link
            key={item.id}
            to={to}
            params={{ id: item.id }}
            className="group flex flex-col gap-2">
            {isLiked ? (
              <div className="w-full aspect-square rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-700 flex items-center justify-center shadow-[var(--shadow-card)]">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
            ) : item.cover ? (
              <img
                src={item.cover}
                alt={item.title}
                className={`w-full aspect-square object-cover shadow-[var(--shadow-card)] ${isArtist ? "rounded-full" : "rounded-md"}`}
              />
            ) : (
              <div
                className={`w-full aspect-square bg-bg-elevated flex items-center justify-center ${isArtist ? "rounded-full" : "rounded-md"}`}>
                <span className="text-text-secondary text-3xl">♪</span>
              </div>
            )}
            <div className="text-sm font-semibold truncate">{item.title}</div>
            <div className="text-xs text-text-secondary truncate">
              {isArtist ? "هنرمند" : item.subtitle}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
