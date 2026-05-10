export type Track = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number;
};

export type Card = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  type: "playlist" | "album" | "artist" | "radio";
  gradient?: string;
  tracks?: Track[];
};

// لیست کارت‌های ویژه
export const featuredCards: Card[] = [
  { id: "f1", title: "میکس روزانه ۱", subtitle: "همایون شجریان، محسن چاوشی و بیشتر", cover: "/images/maziar.jpg", type: "playlist", gradient: "from-violet-600 to-fuchsia-700" },
  { id: "f2", title: "آهنگ‌های لایک شده", subtitle: "۱۲۴ آهنگ", cover: "/images/hiydeh.jpg", type: "playlist", gradient: "from-rose-500 to-orange-600" },
  { id: "f3", title: "کشف هفتگی", subtitle: "پیشنهاد ویژه برای شما", cover: "/images/moein.jpg", type: "playlist", gradient: "from-emerald-500 to-teal-700" },
  { id: "f4", title: "آرامش شبانه", subtitle: "موسیقی بی‌کلام برای تمرکز", cover: "/images/shervin.jpg", type: "playlist", gradient: "from-blue-600 to-indigo-800" },
  { id: "f5", title: "پاپ فارسی ۲۰۲۶", subtitle: "داغ‌ترین‌های هفته", cover: "/images/mahasti.jpg", type: "playlist", gradient: "from-amber-500 to-red-600" },
  { id: "f6", title: "کلاسیک‌های جاودان", subtitle: "گلچین بهترین‌ها", cover: "/images/hiydeh.jpg", type: "playlist", gradient: "from-stone-600 to-zinc-800" },
];

// لیست رادیوها
export const radioCards: Card[] = [
  { id: "r1", title: "همایون شجریان", subtitle: "با محسن چاوشی، علیرضا قربانی و بیشتر", cover: "/images/shervin.jpg", type: "radio" },
  { id: "r2", title: "محسن یگانه", subtitle: "با بنیامین، رضا صادقی و بیشتر", cover: "/images/shervin.jpg", type: "radio" },
  { id: "r3", title: "ساسی", subtitle: "با تتلو، آرمین ۲AFM و بیشتر", cover: "/images/mahasti.jpg", type: "radio" },
  { id: "r4", title: "گوگوش", subtitle: "با داریوش، ابی و بیشتر", cover: "/images/maziar.jpg", type: "radio" },
  { id: "r5", title: "زدبازی", subtitle: "با هیچکس، بهزاد لیتو و بیشتر", cover: "/images/moein.jpg", type: "radio" },
  { id: "r6", title: "ابی", subtitle: "با داریوش، معین و بیشتر", cover: "/images/hiydeh.jpg", type: "radio" },
  { id: "r7", title: "محسن چاوشی", subtitle: "با سینا حجازی و بیشتر", cover: "/images/maziar.jpg", type: "radio" },
];

// لیست آلبوم‌ها
export const albumCards: Card[] = [
  {
    id: "a1",
    title: "ابراهیم",
    subtitle: "همایون شجریان",
    cover: "/images/maziar.jpg",
    type: "album",
    tracks: [
      { id: "a1-t1", title: "قطعه ۱", artist: "همایون شجریان", cover: "/images/maziar.jpg", duration: 215 },
      { id: "a1-t2", title: "قطعه ۲", artist: "همایون شجریان", cover: "/images/maziar.jpg", duration: 198 },
      { id: "a1-t3", title: "قطعه ۳", artist: "همایون شجریان", cover: "/images/maziar.jpg", duration: 202 },
    ],
  },
  {
    id: "a2",
    title: "خودکشی ممنوع",
    subtitle: "محسن چاوشی",
    cover: "/images/shadmehr.jpg",
    type: "album",
    tracks: Array.from({ length: 9 }).map((_, i) => ({ id: `a2-t${i + 1}`, title: `قطعه ${i + 1}`, artist: "محسن چاوشی", cover: "/images/shadmehr.jpg", duration: 180 + i * 5 })),
  },
  {
    id: "a3",
    title: "خداحافظی تلخ",
    subtitle: "محسن یگانه",
    cover: "/images/mahasti.jpg",
    type: "album",
    tracks: Array.from({ length: 11 }).map((_, i) => ({ id: `a3-t${i + 1}`, title: `قطعه ${i + 1}`, artist: "محسن یگانه", cover: "/images/mahasti.jpg", duration: 200 + i * 4 })),
  },
  {
    id: "a4",
    title: "بهت قول میدم",
    subtitle: "بنیامین",
    cover: "/images/maziar.jpg",
    type: "album",
    tracks: Array.from({ length: 8 }).map((_, i) => ({ id: `a4-t${i + 1}`, title: `قطعه ${i + 1}`, artist: "بنیامین", cover: "/images/maziar.jpg", duration: 190 + i * 6 })),
  },
  {
    id: "a5",
    title: "نبض",
    subtitle: "سیروان خسروی",
    cover: "/images/maziar.jpg",
    type: "album",
    tracks: Array.from({ length: 12 }).map((_, i) => ({ id: `a5-t${i + 1}`, title: `قطعه ${i + 1}`, artist: "سیروان خسروی", cover: "/images/maziar.jpg", duration: 210 + i * 3 })),
  },
  {
    id: "a6",
    title: "بهرام",
    subtitle: "بهرام نوراللهی",
    cover: "/images/shervin.jpg",
    type: "album",
    tracks: Array.from({ length: 7 }).map((_, i) => ({ id: `a6-t${i + 1}`, title: `قطعه ${i + 1}`, artist: "بهرام نوراللهی", cover: "/images/shervin.jpg", duration: 205 + i * 2 })),
  },
  {
    id: "a7",
    title: "کلاف",
    subtitle: "علیرضا قربانی",
    cover: "/images/mahasti.jpg",
    type: "album",
    tracks: Array.from({ length: 6 }).map((_, i) => ({ id: `a7-t${i + 1}`, title: `قطعه ${i + 1}`, artist: "علیرضا قربانی", cover: "/images/mahasti.jpg", duration: 195 + i * 7 })),
  },
];

// لیست هنرمندان (مثال مورد نظر شما در ردیف اول)
export const artistCards: Card[] = [
  { id: "ar1", title: "معین", subtitle: "هنرمند", cover: "/images/moein.jpg", type: "artist" },
  { id: "ar2", title: "همایون شجریان", subtitle: "هنرمند", cover: "/images/mahasti.jpg", type: "artist" },
  { id: "ar3", title: "محسن چاوشی", subtitle: "هنرمند", cover: "/images/maziar.jpg", type: "artist" },
  { id: "ar4", title: "محسن یگانه", subtitle: "هنرمند", cover: "/images/shadmehr.jpg", type: "artist" },
  { id: "ar5", title: "گوگوش", subtitle: "هنرمند", cover: "/images/hiydeh.jpg", type: "artist" },
  { id: "ar6", title: "ابی", subtitle: "هنرمند", cover: "/images/shadmehr.jpg", type: "artist" },
  { id: "ar7", title: "سیروان خسروی", subtitle: "هنرمند", cover: "/images/shervin.jpg", type: "artist" },
];

// لیست پلی‌لیست‌ها
export const playlistCards: Card[] = [
  { id: "p1", title: "هیت‌های لحظه", subtitle: "داغ‌ترین آهنگ‌های امروز", cover: "/images/moein.jpg", type: "playlist" },
  { id: "p2", title: "گاردِ هلو", subtitle: "پلی‌لیست پر مخاطب!", cover: "/images/hiydeh.jpg", type: "playlist" },
  { id: "p3", title: "گرند هیت", subtitle: "بهترین‌های ماه", cover: "/images/mahasti.jpg", type: "playlist" },
  { id: "p4", title: "انتخاب سردبیر", subtitle: "اردیبهشت ۱۴۰۵", cover: "/images/shervin.jpg", type: "playlist" },
  { id: "p5", title: "تمرکز کامل", subtitle: "موسیقی بی‌کلام پیانو", cover: "/images/shadmehr.jpg", type: "playlist" },
  { id: "p6", title: "زندگی زیباست", subtitle: "بهترین موسیقی دیروز و امروز", cover: "/images/hiydeh.jpg", type: "playlist" },
  { id: "p7", title: "سال‌های ۲۰۲۰", subtitle: "بهترین آهنگ‌های دهه", cover: "/images/moein.jpg", type: "playlist" },
];

export const sidebarItems: Card[] = [
  ...featuredCards.slice(0, 2),
  ...artistCards.slice(0, 6),
  ...albumCards.slice(0, 4),
];

// آهنگ در حال پخش
export const currentTrack: Track = {
  id: "t1",
  title: "چتر خیس",
  artist: "محسن چاوشی",
  cover: "/images/moein.jpg",
  duration: 245,
};