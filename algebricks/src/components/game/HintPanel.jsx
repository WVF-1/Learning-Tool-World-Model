import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ChevronDown, ChevronRight } from 'lucide-react'

export default function HintPanel({ hints = [], onHintUsed }) {
  const [open, setOpen] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)

  if (!hints || hints.length === 0) return null

  const revealNext = () => {
    if (revealedCount < hints.length) {
      setRevealedCount(c => c + 1)
      onHintUsed?.()
    }
  }

  return (
    <div className="rounded-xl border border-[#718F94]/20 bg-[#3C3E53]/40 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-[#718F94]/10 transition-colors"
      >
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-sm font-medium text-[#BFC8AD]/70 flex-1">Hints</span>
        {revealedCount > 0 && (
          <span className="text-xs text-amber-400 font-mono">{revealedCount}/{hints.length}</span>
        )}
        {open ? (
          <ChevronDown className="w-4 h-4 text-[#718F94]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[#718F94]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-[#718F94]/10 pt-3">
              {hints.slice(0, revealedCount).map((hint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-start gap-2 text-sm text-[#BFC8AD]/75"
                >
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{hint}</span>
                </motion.div>
              ))}

              {revealedCount < hints.length && (
                <button
                  onClick={revealNext}
                  className="mt-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors
                    flex items-center gap-1 border border-amber-400/20 rounded-lg px-3 py-1.5
                    hover:bg-amber-400/10"
                >
                  <Lightbulb className="w-3 h-3" />
                  {revealedCount === 0 ? 'Show first hint' : 'Next hint'}
                </button>
              )}
              {revealedCount === hints.length && (
                <p className="text-xs text-[#718F94] italic">All hints revealed.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
