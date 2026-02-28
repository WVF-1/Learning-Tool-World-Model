import React from 'react'
import { motion } from 'framer-motion'

const STATE_CONFIG = {
  low:    { label: 'Learning',   bar: 'bg-rose-500',    dot: 'bg-rose-400',    text: 'text-rose-300' },
  medium: { label: 'Practicing', bar: 'bg-amber-500',   dot: 'bg-amber-400',   text: 'text-amber-300' },
  high:   { label: 'Mastered',   bar: 'bg-emerald-500', dot: 'bg-emerald-400', text: 'text-emerald-300' }
}

function stateToLevel(state) {
  if (!state) return 'medium'
  if (state === 'learning' || state === 'transition') return 'low'
  if (state === 'mastered' || state === 'near_mastery') return 'high'
  return 'medium'
}

export default function MasteryGauge({ state, confidence, compact = false }) {
  const level = typeof state === 'string' && ['low', 'medium', 'high'].includes(state)
    ? state
    : stateToLevel(state)
  const cfg = STATE_CONFIG[level]
  const pct = Math.round((confidence || 0) * 100)

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
        <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
        <span className="text-xs text-[#718F94]">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#718F94]/15 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${cfg.bar}`}
        />
      </div>
    </div>
  )
}
