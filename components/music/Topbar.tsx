import NextLink from "next/link";
import { Home, Bell, Music2 } from "lucide-react";
import Link from "next/link";
import { TransitionLink } from "../view-transition";

export function Topbar() {
  return (
    <header className="hidden md:fixed md:block top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[900px]">
      <div className="flex items-center justify-between px-6 py-2 rounded-xl backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        
        {/* سمت چپ: لوگو */}
        <TransitionLink href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/80 to-pink-500/80 flex items-center justify-center">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold tracking-tight hidden sm:block">
            موزیک لند
          </span>
        </TransitionLink>

        {/* سمت راست: خانه، ارتقا، نوتیفیکیشن و پروفایل */}
        <div className="flex items-center gap-2">
          
          <button className="px-5 py-2 rounded-lg bg-white text-black font-bold text-xs hover:scale-105 transition-transform active:scale-95 cursor-pointer">
            ارتقا حساب
          </button>
          
          {/* آیکون خانه که درخواست کردید کنار دکمه باشد */}
          <NextLink
            href="/"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/5"
          >
            <Home className="w-5 h-5" />
          </NextLink>

          
          <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>

          {/* جداکننده ظریف */}
          <div className="w-[1px] h-6 bg-white/10 mx-1"></div>

          {/* پروفایل */}
          <div className="flex items-center gap-2 p-1 pr-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-all">
            <span className="text-xs font-medium text-gray-300 hidden sm:block">علی رضایی</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-black">
              ع
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}