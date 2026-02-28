import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, ArrowRight, Clock, Target, Lightbulb, Flame } from 'lucide-react'
import MasteryGauge from './MasteryGauge'

export default function LessonComplete({ stats = {}, lessonTitle, masteryState, masteryConfidence, onReplay, onContinue }) {
  const { correct = 0, total = 0, totalTime = 0, hintsUsed = 0 } = stats
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const avgTime  = total > 0 ? Math.round(totalTime / total / 1000) : 0

  const kpis = [
    { icon: Target,   label: 'Accuracy',    value: `${accuracy}%`, color: 'text-[#90B494]' },
    { icon: Flame,    label: 'Correct',     value: `${correct}/${total}`, color: 'text-amber-400' },
    { icon: Clock,    label: 'Avg Time',    value: `${avgTime}s`, color: 'text-sky-400' },
    { icon: Lightbulb, label: 'Hints Used', value: hintsUsed, color: 'text-violet-400' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto p-6"
    >
      <div className="rounded-2xl border border-[#90B494]/25 bg-gradient-to-br
        from-[#90B494]/15 via-[#3C3E53]/80 to-[#3C3E53] p-7 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#90B494] to-[#718F94]
            flex items-center justify-center">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">Lesson Complete!</h2>
          {lessonTitle && (
            <p className="text-sm text-[#BFC8AD]/60">{lessonTitle}</p>
          )}
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3">
          {kpis.map(k => (
            <div key={k.label} className="rounded-xl bg-[#718F94]/10 border border-[#718F94]/15 p-3 text-center">
              <k.icon className={`w-4 h-4 mx-auto mb-1 ${k.color}`} />
              <div className={`text-xl font-black ${k.color}`}>{k.value}</div>
              <div className="text-xs text-[#718F94] mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Mastery */}
        {masteryState && (
          <div className="rounded-xl bg-[#718F94]/10 border border-[#718F94]/15 p-4">
            <p className="text-xs text-[#718F94] mb-2">Lesson Mastery</p>
            <MasteryGauge state={masteryState} confidence={masteryConfidence} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
              border border-[#718F94]/25 text-[#BFC8AD]/70 hover:text-[#BFC8AD]
              hover:bg-[#718F94]/10 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Replay
          </button>
          <button
            onClick={onContinue}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-[#90B494] text-white hover:bg-[#7ea882] transition-colors text-sm font-bold"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
