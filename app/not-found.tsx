'use client'
/* ============================================================
   src/app/not-found.tsx — صفحه ۴۰۴
   ============================================================ */

import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import Link       from 'next/link'
import { Home, Music2 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm"
      >
        {/* آیکون */}
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 1.5, delay: 0.4, ease: 'easeInOut' }}
          className={cn(
            'w-20 h-20 rounded-2xl bg-accent-gold/10 border border-accent-gold/20',
            'flex items-center justify-center mx-auto mb-6'
          )}
        >
          <Music2 size={36} color="var(--color-accent-gold)" />
        </motion.div>

        <h1 className="text-6xl font-black text-content-primary mb-3">۴۰۴</h1>
        <p className="text-lg font-semibold text-content-secondary mb-2">
          صفحه پیدا نشد
        </p>
        <p className="text-sm text-content-muted mb-8">
          آهنگی که دنبالش می‌گردید در این آدرس نیست!
        </p>

        <Link href="/">
          <motion.button
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-full',
              'bg-accent-gold text-content-on-accent font-semibold text-sm mx-auto'
            )}
            style={{ boxShadow: 'var(--shadow-glow-gold)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Home size={16} />
            بازگشت به خانه
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}
