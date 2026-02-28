import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'

export default function GateProgress({ progress = {} }) {
  const { moderate = 0, hard = 0, moderateTarget = 3, hardTarget = 2 } = progress
  const modPct  = Math.min((moderate / moderateTarget) * 100, 100)
  const hardPct = Math.min((hard / hardTarget) * 100, 100)
  const unlocked = moderate >= moderateTarget && hard >= hardTarget

  return (
    <div className={`rounded-xl border p-4 space-y-3
      ${unlocked
        ? 'border-[#90B494]/40 bg-[#90B494]/8'
        : 'border-[#718F94]/20 bg-[#3C3E53]/40'
      }`}>
      <div className="flex items-center gap-2 mb-1">
        {unlocked
          ? <Unlock className="w-4 h-4 text-[#90B494]" />
          : <Lock className="w-4 h-4 text-[#718F94]" />
        }
        <span className="text-sm font-semibold text-[#BFC8AD]">
          {unlocked ? 'Advanced Content Unlocked!' : 'Unlock Advanced Problems'}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-[#718F94] mb-1">
            <span>Moderate problems</span>
            <span>{moderate}/{moderateTarget}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#718F94]/15 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${modPct}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${modPct >= 100 ? 'bg-[#90B494]' : 'bg-amber-500'}`}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-[#718F94] mb-1">
            <span>Hard problems</span>
            <span>{hard}/{hardTarget}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#718F94]/15 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${hardPct}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`h-full rounded-full ${hardPct >= 100 ? 'bg-[#90B494]' : 'bg-orange-500'}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
