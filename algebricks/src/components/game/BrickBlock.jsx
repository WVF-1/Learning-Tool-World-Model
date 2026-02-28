import React from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const DEFAULT_COLOR = 'bg-[#3C3E53]/80 border-[#718F94]/25 text-[#BFC8AD] hover:bg-[#718F94]/15 hover:border-[#718F94]/40'
const SELECTED_COLOR = 'bg-[#90B494]/20 border-[#90B494]/60 text-[#90B494]'
const INCORRECT_COLOR = 'bg-rose-500/20 border-rose-500/50 text-rose-300'

export default function BrickBlock({ block, onClick, disabled, selected, isIncorrect, stepNumber }) {
  const baseColor = selected
    ? SELECTED_COLOR
    : isIncorrect
    ? INCORRECT_COLOR
    : DEFAULT_COLOR

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={() => !disabled && onClick && onClick(block)}
      disabled={disabled}
      className={`
        relative w-full text-left px-4 py-3 rounded-xl border
        text-sm leading-relaxed font-medium transition-colors
        ${baseColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isIncorrect ? 'brick-shake' : ''}
        ${selected ? 'brick-snap' : ''}
      `}
    >
      <div className="flex items-start gap-2">
        {selected && (
          <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#90B494]" />
        )}
        {isIncorrect && (
          <X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-rose-400" />
        )}
        <span>{block.content}</span>
      </div>
    </motion.button>
  )
}
