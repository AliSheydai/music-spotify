'use client'
/* ============================================================
   src/components/layout/MobileNav.tsx
   نوار ناوبری موبایل — Glassmorphism + Framer Motion
   فقط روی صفحات کوچک‌تر از lg نمایش داده می‌شود
   پلیر مینی روی این قرار می‌گیرد (bottom-16)
   ============================================================ */

import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, LayoutGrid, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransitionLink } from '../view-transition'

/* -------------------------------------------------------
   تب‌های ناوبری
------------------------------------------------------- */
const TABS = [
  { href: '/',         label: 'خانه',     icon: Home       },
  { href: '/library',  label: 'گالری',    icon: LayoutGrid },
  { href: '/charts',   label: 'اعلان‌ها',  icon: Bell       },
  { href: '/profile',  label: 'پروفایل',  icon: User       },
] as const

/* -------------------------------------------------------
   انیمیشن‌ها
------------------------------------------------------- */
const tabVariants = {
  active:   { scale: 1,    y: 0    },
  inactive: { scale: 0.92, y: 0    },
  tap:      { scale: 0.82, y: 1    },
}

const dotVariants = {
  initial:  { scale: 0, opacity: 0 },
  animate:  { scale: 1, opacity: 1 },
  exit:     { scale: 0, opacity: 0 },
}

const iconVariants = {
  active:   { y: -2, transition: { type: 'spring', stiffness: 500, damping: 28 } },
  inactive: { y:  0, transition: { type: 'spring', stiffness: 500, damping: 28 } },
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
export function MobileNav() {
  const pathname = usePathname()

  /* تشخیص آیتم فعال */
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden backdrop-blur-lg"
      style={{
        height:              '72px',
        paddingBottom:       'env(safe-area-inset-bottom)',
        /* Glassmorphism */
        background:          'rgba(0, 0, 0, 0.65)',
        backdropFilter:      'blur(24px)',
        WebkitBackdropFilter:'blur(24px)',
        borderTop:           '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* خط گرادیان بالای نوار */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)',
        }}
      />

      <div className="flex items-stretch h-full">
        {TABS.map(tab => {
          const active = isActive(tab.href)
          const Icon   = tab.icon

          return (
            <TransitionLink
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1
                         cursor-pointer select-none outline-none
                         focus-visible:ring-1 focus-visible:ring-accent-gold/50"
              aria-current={active ? 'page' : undefined}
            >
              <motion.div
                className="flex flex-col items-center gap-1"
                variants={tabVariants}
                animate={active ? 'active' : 'inactive'}
                whileTap="tap"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {/* آیکون + dot */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    variants={iconVariants as any}
                    animate={active ? 'active' : 'inactive'}
                  >
                    <Icon
                      size={22}
                      strokeWidth={active ? 2.5 : 1.8}
                      color={active
                        ? 'var(--color-accent-gold)'
                        : 'rgba(255,255,255,0.45)'
                      }
                      style={{ transition: 'color 0.2s' }}
                    />
                  </motion.div>

                  {/* glow هنگام فعال */}
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        key="glow"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1   }}
                        exit={{   opacity: 0, scale: 0.5  }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 -z-10 rounded-full blur-md pointer-events-none"
                        style={{ background: 'rgba(201,168,76,0.25)' }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* label */}
                <motion.span
                  className="text-[10px] font-medium leading-none tracking-tight"
                  animate={{
                    color:   active ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.35)',
                    opacity: active ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.label}
                </motion.span>

                {/* نقطه فعال */}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      key={`dot-${tab.href}`}
                      variants={dotVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 600, damping: 32 }}
                      className="absolute -bottom-3.5 left-1/2 -translate-x-1/2
                                 w-1 h-1 rounded-full"
                      style={{ background: 'var(--color-accent-gold)' }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </TransitionLink>
          )
        })}
      </div>
    </nav>
  )
}
