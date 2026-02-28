import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight, RotateCcw, Zap } from 'lucide-react'
import BrickBlock from './BrickBlock'
import BrickSlot from './BrickSlot'
import HintPanel from './HintPanel'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DIFFICULTY_COLORS = {
  easy:     'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  moderate: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  hard:     'bg-rose-500/15 text-rose-300 border-rose-500/25'
}

export default function BlockEngine({ problem, blocks, onSubmit, onNext, isLast, currentDifficulty }) {
  const [availableBlocks, setAvailableBlocks] = useState([])
  const [selectedBlocks, setSelectedBlocks]   = useState([])
  const [incorrectBlockId, setIncorrectBlockId] = useState(null)
  const [solved, setSolved]   = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)

  const startTimeRef     = useRef(null)
  const firstClickRef    = useRef(null)
  const incorrectTimeout = useRef(null)

  // Re-initialize when problem changes
  useEffect(() => {
    if (!problem || !blocks) return
    const relevantIds = new Set([
      ...(problem.correct_block_ids || []),
      ...(problem.distractor_pool_ids || [])
    ])
    const relevant = blocks.filter(b => relevantIds.has(b.block_id))
    setAvailableBlocks(shuffle(relevant))
    setSelectedBlocks([])
    setIncorrectBlockId(null)
    setSolved(false)
    setHintsUsed(0)
    startTimeRef.current  = Date.now()
    firstClickRef.current = null
    clearTimeout(incorrectTimeout.current)
  }, [problem?.problem_id])

  if (!problem) return null

  const correctSequence = problem.correct_block_ids || []
  const totalSteps = correctSequence.length
  const progress   = (selectedBlocks.length / totalSteps) * 100

  const handleBlockClick = (block) => {
    if (solved || incorrectBlockId) return

    if (!firstClickRef.current) {
      firstClickRef.current = Date.now()
    }

    const nextExpectedId = correctSequence[selectedBlocks.length]

    if (block.block_id === nextExpectedId) {
      const newSelected = [...selectedBlocks, block]
      setAvailableBlocks(prev => prev.filter(b => b.block_id !== block.block_id))
      setSelectedBlocks(newSelected)

      if (newSelected.length === totalSteps) {
        checkSolution(newSelected)
      }
    } else {
      setIncorrectBlockId(block.block_id)
      clearTimeout(incorrectTimeout.current)
      incorrectTimeout.current = setTimeout(() => setIncorrectBlockId(null), 800)
    }
  }

  const checkSolution = (finalBlocks) => {
    const now = Date.now()
    setSolved(true)
    onSubmit?.({
      is_correct: true,
      selected_blocks: finalBlocks.map(b => b.block_id),
      incorrect_blocks: [],
      time_to_first_block_ms: firstClickRef.current
        ? firstClickRef.current - startTimeRef.current
        : 0,
      time_to_completion_ms: now - startTimeRef.current,
      hints_used: hintsUsed
    })
  }

  const handleReset = () => {
    const relevantIds = new Set([
      ...(problem.correct_block_ids || []),
      ...(problem.distractor_pool_ids || [])
    ])
    const relevant = blocks.filter(b => relevantIds.has(b.block_id))
    setAvailableBlocks(shuffle(relevant))
    setSelectedBlocks([])
    setIncorrectBlockId(null)
    setSolved(false)
    startTimeRef.current  = Date.now()
    firstClickRef.current = null
  }

  return (
    <div className="space-y-5">
      {/* Problem header */}
      <div className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-5 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs text-[#718F94] uppercase tracking-wider font-semibold mb-1">
              {problem.subtopic || problem.factoring_type || 'Algebra'}
            </p>
            <h2 className="math-font text-2xl text-white font-bold leading-tight">
              {problem.problem_expression}
            </h2>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0
            ${DIFFICULTY_COLORS[currentDifficulty] || DIFFICULTY_COLORS.moderate}`}>
            {currentDifficulty}
          </span>
        </div>

        {/* Step progress bar */}
        <div>
          <div className="flex justify-between text-xs text-[#718F94] mb-1">
            <span>Steps completed</span>
            <span>{selectedBlocks.length}/{totalSteps}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#718F94]/15 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-[#90B494]"
            />
          </div>
        </div>
      </div>

      {/* BUILD YOUR SOLUTION — single area where blocks appear in sequence */}
      <div className="space-y-2">
        <p className="text-sm text-[#718F94] uppercase tracking-wider font-semibold px-1">
          Build Your Solution
        </p>
        <p className="text-xs text-[#718F94]/80 px-1">
          Select blocks below to build your solution
        </p>
        <div className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/40 min-h-[120px] p-4">
          {totalSteps > 0 ? (
            <div className="space-y-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <BrickSlot
                  key={i}
                  block={selectedBlocks[i] || null}
                  stepNumber={i + 1}
                  isActive={i === selectedBlocks.length && !solved}
                />
              ))}
            </div>
          ) : (
            <div className="min-h-[80px] flex items-center justify-center text-[#718F94]/40 text-sm italic">
              Select blocks below to build your solution
            </div>
          )}
        </div>
      </div>

      {/* Solved celebration */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="rounded-xl border border-[#90B494]/40 bg-[#90B494]/12 p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-[#90B494] shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#90B494]">Correct!</p>
              <p className="text-xs text-[#BFC8AD]/60 font-mono mt-0.5">
                Answer: {problem.correct_answer}
              </p>
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#90B494] text-white
                text-sm font-bold hover:bg-[#7ea882] transition-colors shrink-0"
            >
              {isLast ? 'Finish' : 'Next'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SELECT THE NEXT STEP — block grid */}
      {!solved && availableBlocks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-[#718F94] uppercase tracking-wider font-semibold">
              Select the Next Step
            </p>
            <button
              onClick={handleReset}
              className="text-xs text-[#718F94] hover:text-[#BFC8AD] flex items-center gap-1
                transition-colors px-2 py-1 rounded-lg hover:bg-[#718F94]/10"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {availableBlocks.map((block, idx) => (
              <BrickBlock
                key={block.block_id}
                block={block}
                onClick={handleBlockClick}
                isIncorrect={block.block_id === incorrectBlockId}
                disabled={solved}
                stepNumber={(idx % 5) + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hint panel */}
      {!solved && problem.solution_steps?.length > 0 && (
        <HintPanel
          hints={problem.solution_steps}
          onHintUsed={() => setHintsUsed(h => h + 1)}
        />
      )}
    </div>
  )
}
