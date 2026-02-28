import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function BrickSlot({ block, stepNumber, isActive }) {
  const filled = !!block

  return (
    <motion.div
      animate={isActive && !filled ? { scale: [1, 1.01, 1] } : {}}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      className={`
        rounded-xl border px-4 py-3 text-sm min-h-[52px] flex items-start gap-2 transition-all duration-200
        ${filled
          ? 'border-[#90B494]/50 bg-[#90B494]/10 text-[#90B494]'
          : isActive
          ? 'border-sky-400/40 bg-sky-500/5 text-[#718F94] pulse-border'
          : 'border-[#718F94]/20 bg-transparent text-[#718F94]/40'
        }
      `}
    >
      <span className={`text-xs font-bold mt-0.5 shrink-0 w-4
        ${filled ? 'text-[#90B494]' : 'text-[#718F94]/50'}`}>
        {stepNumber}
      </span>
      {filled ? (
        <>
          <span className="flex-1 text-[#BFC8AD]/90 leading-relaxed">{block.content}</span>
          <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#90B494]" />
        </>
      ) : (
        <span className="italic text-[#718F94]/40">
          {isActive ? 'Select the next step...' : `Step ${stepNumber}`}
        </span>
      )}
    </motion.div>
  )
}
