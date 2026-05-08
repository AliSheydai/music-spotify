'use client'
/* ============================================================
   src/components/home/HeroSearch.tsx
   Hero تمام‌صفحه با نوار جستجوی مرکزی + جستجوی صوتی
   ============================================================ */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Mic, Search, X, Sparkles, Music2, TrendingUp, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------
   پیشنهادهای جستجو برای placeholder چرخشی
------------------------------------------------------- */
const ROTATING_PLACEHOLDERS = [
  'دنبال آهنگ می‌گردید؟',
  'بخشی از متن آهنگ را بنویسید...',
  'نام هنرمند یا آلبوم...',
  'اسم آهنگ را تایپ کنید...',
  'جستجو در میلیون‌ها آهنگ...',
]

const TRENDING_SEARCHES = [
  'محسن چاوشی',
  'شادمهر عقیلی',
  'دلتنگی',
  'پاپ ایرانی',
  'سیروان خسروی',
  'ماکان بند',
]

const RECENT_SEARCHES = [
  { query: 'آتش شادمهر', time: '۲ ساعت پیش' },
  { query: 'صبح صادق',   time: 'دیروز'       },
  { query: 'باران سیروان', time: '۳ روز پیش' },
]

/* -------------------------------------------------------
   VoiceSearch Bottom Sheet
------------------------------------------------------- */
interface VoiceSheetProps {
  isOpen:  boolean
  onClose: () => void
  status:  'requesting' | 'listening' | 'processing' | 'denied'
}

function VoiceSearchSheet({ isOpen, onClose, status }: VoiceSheetProps) {
  const messages = {
    requesting:  { title: 'دسترسی به میکروفون',    sub: 'برای جستجوی صوتی نیاز به اجازه دارید',     icon: '🎙️' },
    listening:   { title: 'گوش می‌دهم...',           sub: 'آهنگ یا متن آهنگ را پخش کنید',           icon: '🎵' },
    processing:  { title: 'در حال تشخیص...',         sub: 'صبر کنید، نتایج را پیدا می‌کنیم',         icon: '✨' },
    denied:      { title: 'دسترسی رد شد',            sub: 'لطفاً از تنظیمات مرورگر دسترسی را فعال کنید', icon: '🔒' },
  }
  const info = messages[status]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="voice-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="voice-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0        }}
            exit={{   y: '100%'    }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-[100] rounded-t-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%)',
              border:     '1px solid var(--color-border-default)',
              borderBottom: 'none',
            }}
          >
            {/* Drag handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-content-muted/30" />
            </div>

            <div className="px-6 py-6 pb-12 flex flex-col items-center gap-6">

              {/* ===== آیکون و متن ===== */}
              <div className="text-center space-y-2">
                <motion.div
                  animate={status === 'listening'
                    ? { scale: [1, 1.08, 1] }
                    : { scale: 1 }
                  }
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl mb-3"
                >
                  {info.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-content-primary">{info.title}</h3>
                <p className="text-sm text-content-secondary">{info.sub}</p>
              </div>

              {/* ===== Visualizer موج صدا ===== */}
              {status === 'listening' && (
                <div className="flex items-center justify-center gap-1.5 h-16">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 rounded-full"
                      style={{ background: 'var(--color-accent-gold)' }}
                      animate={{
                        height: ['6px', `${12 + Math.random() * 36}px`, '6px'],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration:  0.5 + Math.random() * 0.6,
                        repeat:    Infinity,
                        delay:     i * 0.04,
                        ease:      'easeInOut',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* ===== Spinner برای processing ===== */}
              {status === 'processing' && (
                <div className="relative w-16 h-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-gold"
                  />
                  <div className="absolute inset-3 rounded-full bg-accent-gold/10 flex items-center justify-center">
                    <Music2 size={16} color="var(--color-accent-gold)" />
                  </div>
                </div>
              )}

              {/* ===== حلقه نبض برای requesting ===== */}
              {status === 'requesting' && (
                <div className="relative flex items-center justify-center w-20 h-20">
                  {[0, 0.3, 0.6].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-accent-gold/30"
                      animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                      transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'easeOut' }}
                    />
                  ))}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-accent-gold)', boxShadow: 'var(--shadow-glow-gold)' }}
                  >
                    <Mic size={24} color="var(--color-text-on-accent)" />
                  </div>
                </div>
              )}

              {/* ===== دکمه بستن ===== */}
              <div className="flex gap-3 w-full max-w-xs">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border border-line-default
                             text-sm font-medium text-content-secondary
                             hover:bg-bg-elevated transition-colors duration-200"
                >
                  {status === 'denied' ? 'باشه' : 'لغو'}
                </button>
                {status === 'listening' && (
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold
                               text-content-on-accent transition-colors duration-200"
                    style={{ background: 'var(--color-accent-gold)', boxShadow: 'var(--shadow-glow-gold)' }}
                  >
                    جستجو
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------
   Main HeroSearch Component
------------------------------------------------------- */
export function SearchHero() {
  const router = useRouter()

  const [query,         setQuery]         = useState('')
  const [isFocused,     setIsFocused]     = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [voiceOpen,     setVoiceOpen]     = useState(false)
  const [voiceStatus,   setVoiceStatus]   = useState<VoiceSheetProps['status']>('requesting')
  const [showDropdown,  setShowDropdown]  = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  /* چرخش placeholder */
  useEffect(() => {
    const id = setInterval(() => {
      if (!isFocused && !query) {
        setPlaceholderIdx(i => (i + 1) % ROTATING_PLACEHOLDERS.length)
      }
    }, 3000)
    return () => clearInterval(id)
  }, [isFocused, query])

  /* dropdown */
  useEffect(() => {
    setShowDropdown(isFocused)
  }, [isFocused])

  /* جستجو */
  const handleSearch = (q: string) => {
    if (!q.trim()) return
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  /* میکروفون */
  const handleMicClick = useCallback(async () => {
    setVoiceStatus('requesting')
    setVoiceOpen(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setVoiceStatus('listening')

      /* شبیه‌سازی پردازش بعد از ۵ ثانیه — بک‌اند این را انجام می‌دهد */
      setTimeout(() => {
        setVoiceStatus('processing')
        stream.getTracks().forEach(t => t.stop())
        setTimeout(() => setVoiceOpen(false), 2000)
      }, 5000)

    } catch {
      setVoiceStatus('denied')
    }
  }, [])

  /* پس‌زمینه ذرات متحرک */
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x:  Math.random() * 100,
    y:  Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 5,
  }))

  return (
    <>
      {/* ================================================================
          Hero Section — h-screen
      ================================================================ */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: '100svh' }}
      >

        {/* --- پس‌زمینه گرادیان --- */}
        <div className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -10%,
                rgba(201,168,76,0.12) 0%,
                transparent 70%),
              radial-gradient(ellipse 60% 40% at 80% 80%,
                rgba(139,92,246,0.08) 0%,
                transparent 70%),
              var(--color-bg-base)
            `,
          }}
        />

        {/* --- ذرات شناور --- */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left:   `${p.x}%`,
                top:    `${p.y}%`,
                width:  `${p.size}px`,
                height: `${p.size}px`,
                background: p.id % 3 === 0
                  ? 'rgba(201,168,76,0.5)'
                  : p.id % 3 === 1
                    ? 'rgba(139,92,246,0.4)'
                    : 'rgba(255,255,255,0.2)',
              }}
              animate={{
                y:       [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: p.duration,
                delay:    p.delay,
                repeat:   Infinity,
                ease:     'easeInOut',
              }}
            />
          ))}
        </div>

        {/* --- خطوط grid محو --- */}
        <div className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* ===== محتوا ===== */}
        <div className="w-full max-w-3xl px-5 sm:px-8 flex flex-col items-center gap-8 relative z-10">

          {/* --- Badge بالا --- */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0   }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
            style={{
              background: 'rgba(201,168,76,0.08)',
              borderColor: 'rgba(201,168,76,0.2)',
            }}
          >
            <Music2 size={13} color="var(--color-accent-gold)" />
            <span className="text-xs font-medium" style={{ color: 'var(--color-accent-gold)' }}>
              موزیک‌لند — پلتفرم موسیقی فارسی
            </span>
          </motion.div>

          {/* --- عنوان اصلی --- */}
          <div className="text-center space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="font-black text-content-primary leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              هر آهنگی که{' '}
              <span
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-gold), var(--color-accent-rose))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                فکرش را بکنید
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-base sm:text-lg text-content-secondary"
            >
              نام آهنگ، هنرمند، یا حتی بخشی از متن را بنویسید
            </motion.p>
          </div>

          {/* --- نوار جستجو --- */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            transition={{ duration: 0.55, delay: 0.26, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full relative"
          >
            {/* glow effect هنگام focus */}
            <div
              className="absolute -inset-px rounded-2xl transition-all duration-500 pointer-events-none"
              style={{
                background: isFocused
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.4), rgba(139,92,246,0.3))'
                  : 'transparent',
                filter: 'blur(8px)',
                opacity: isFocused ? 1 : 0,
              }}
            />

            {/* کادر اصلی */}
            <div
              className="relative flex items-center rounded-2xl transition-all duration-300"
              style={{
                background: isFocused
                  ? 'var(--color-bg-elevated)'
                  : 'rgba(26,26,37,0.9)',
                border: `1.5px solid ${isFocused
                  ? 'rgba(201,168,76,0.5)'
                  : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isFocused
                  ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
                  : '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              {/* آیکون جستجو */}
              <div className="pr-5 pl-2 flex-shrink-0">
                <Search
                  size={20}
                  color={isFocused ? 'var(--color-accent-gold)' : 'var(--color-text-muted)'}
                  style={{ transition: 'color 0.2s' }}
                />
              </div>

              {/* Input */}
              <div className="flex-1 relative py-4 sm:py-5">
                {/* Animated placeholder */}
                {!query && !isFocused && (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIdx}
                      initial={{ opacity: 0, y: 8  }}
                      animate={{ opacity: 1, y: 0  }}
                      exit={{   opacity: 0, y: -8  }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-y-0 right-0 flex items-center text-sm sm:text-base
                                 pointer-events-none select-none"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {ROTATING_PLACEHOLDERS[placeholderIdx]}
                    </motion.span>
                  </AnimatePresence>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
                  placeholder=""
                  className="w-full bg-transparent text-sm sm:text-base text-content-primary
                             placeholder:text-transparent focus:outline-none caret-accent-gold"
                  dir="rtl"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="جستجوی موسیقی"
                />
              </div>

              {/* دکمه X */}
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1   }}
                    exit={{   opacity: 0, scale: 0.7  }}
                    onClick={() => { setQuery(''); inputRef.current?.focus() }}
                    className="p-2 mx-1 rounded-xl transition-colors duration-150"
                    style={{ color: 'var(--color-text-muted)' }}
                    whileHover={{ color: 'var(--color-text-secondary)' }}
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* جداکننده */}
              <div
                className="w-px h-6 flex-shrink-0 mx-1"
                style={{ background: 'var(--color-border-default)' }}
              />

              {/* دکمه میکروفون */}
              <motion.button
                onClick={handleMicClick}
                className="mx-3 flex-shrink-0 relative group cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92  }}
                aria-label="جستجوی صوتی"
              >
                {/* حلقه pulse */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--color-accent-gold)' }}
                  animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
                <div
                  className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent-gold), rgba(201,168,76,0.7))',
                    boxShadow: 'var(--shadow-glow-gold)',
                  }}
                >
                  <Mic size={16} color="var(--color-text-on-accent)" strokeWidth={2.5} />
                </div>
              </motion.button>
            </div>

            {/* ===== Dropdown پیشنهادات ===== */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 4,  scale: 1    }}
                  exit={{   opacity: 0, y: -8, scale: 0.98  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 z-50 rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--color-bg-elevated)',
                    border:     '1px solid var(--color-border-default)',
                    boxShadow:  'var(--shadow-card)',
                  }}
                >
                  {/* جستجوهای اخیر */}
                  {!query && RECENT_SEARCHES.length > 0 && (
                    <div className="p-3 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2"
                        style={{ color: 'var(--color-text-muted)' }}>
                        اخیر
                      </p>
                      {RECENT_SEARCHES.map(item => (
                        <button
                          key={item.query}
                          onClick={() => handleSearch(item.query)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                                     transition-colors duration-150 group"
                          style={{ color: 'var(--color-text-secondary)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-overlay)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Clock size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                          <span className="flex-1 text-sm text-right">{item.query}</span>
                          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                            {item.time}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ترندها */}
                  {!query && (
                    <div className="p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2"
                        style={{ color: 'var(--color-text-muted)' }}>
                        جستجوهای پرطرفدار
                      </p>
                      {TRENDING_SEARCHES.map((term, i) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                                     transition-colors duration-300"
                          style={{ color: 'var(--color-text-secondary)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-overlay)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <TrendingUp size={14} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
                          <span className="flex-1 text-sm text-right">{term}</span>
                          <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-disabled)' }}>
                            #{i + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* نتایج inline هنگام تایپ */}
                  {query && (
                    <div className="p-3">
                      <button
                        onClick={() => handleSearch(query)}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl
                                   transition-colors duration-150"
                        style={{ color: 'var(--color-text-primary)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-overlay)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Search size={15} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
                        <span className="text-sm">
                          جستجو برای{' '}
                          <strong style={{ color: 'var(--color-accent-gold)' }}>«{query}»</strong>
                        </span>
                      </button>
                      <button
                        onClick={() => handleSearch(`lyrics: ${query}`)}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl
                                   transition-colors duration-150"
                        style={{ color: 'var(--color-text-secondary)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-overlay)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Sparkles size={15} style={{ color: 'var(--color-accent-violet)', flexShrink: 0 }} />
                        <span className="text-sm">
                          جستجو در{' '}
                          <span style={{ color: 'var(--color-accent-violet)' }}>متن آهنگ‌ها</span>
                          {' '}برای «{query}»
                        </span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* --- پیشنهادهای سریع --- */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>پیشنهاد:</span>
            {['محسن چاوشی', 'دلتنگی', 'پاپ ایرانی', 'سینگل جدید'].map((tag, i) => (
              <motion.button
                key={tag}
                onClick={() => { setQuery(tag); inputRef.current?.focus() }}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer"
                style={{
                  background:   'rgba(255,255,255,0.05)',
                  border:       '1px solid rgba(255,255,255,0.08)',
                  color:        'var(--color-text-secondary)',
                }}
                whileHover={{
                  background:   'rgba(201,168,76,0.1)',
                  borderColor:  'rgba(201,168,76,0.3)',
                  color:        'var(--color-accent-gold)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 8  }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.45 + i * 0.06 } }}
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>

          {/* --- آمار --- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="flex items-center gap-6 sm:gap-10"
          >
            {[
              { value: '+۵ میلیون',  label: 'آهنگ'      },
              { value: '+۱۰۰ هزار', label: 'هنرمند'    },
              { value: '۲۴/۷',       label: 'پشتیبانی'  },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-base sm:text-lg font-black" style={{ color: 'var(--color-accent-gold)' }}>
                  {value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            اسکرول کنید
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
            style={{ borderColor: 'var(--color-border-default)' }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{ background: 'var(--color-accent-gold)' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Voice Search Sheet */}
      <VoiceSearchSheet
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        status={voiceStatus}
      />
    </>
  )
}
