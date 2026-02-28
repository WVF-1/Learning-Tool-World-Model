import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Blocks, BookOpen } from 'lucide-react'
import { useStudent } from '@/context/StudentContext'
import {
  getLessons, getProblems, getBlocks,
  getProgress, saveProgress, logAttempt, logMisconception
} from '@/api/localStore'
import {
  updateBelief, getDominantState, recommendDifficulty,
  shouldAdvanceDifficulty, shouldRegressDifficulty,
  getStateMessage, initializeProgress, HMM_MODEL
} from '@/components/game/HMM'
import BlockEngine from '@/components/game/BlockEngine'
import LessonComplete from '@/components/game/LessonComplete'
import MasteryGauge from '@/components/game/MasteryGauge'

export default function Play() {
  const { currentEmail, currentStudent } = useStudent()
  const [searchParams] = useSearchParams()

  const lessons   = getLessons()
  const allProblems = getProblems()
  const blocks    = getBlocks()

  const lessonIdParam = searchParams.get('lesson')
  const currentLesson = lessons.find(l => l.lesson_id === lessonIdParam) || lessons[0]

  const [progress, setProgress]         = useState(null)
  const [problemIndex, setProblemIndex] = useState(0)
  const [lessonComplete, setLessonComplete] = useState(false)
  const [stateMessage, setStateMessage] = useState(null)
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, totalTime: 0, hintsUsed: 0 })

  // Load or initialize progress
  useEffect(() => {
    if (!currentEmail || !currentLesson) return
    const saved = getProgress(currentEmail, currentLesson.lesson_id)
    if (saved) {
      setProgress(saved)
    } else {
      const fresh = initializeProgress(currentEmail, currentLesson.lesson_id)
      setProgress(fresh)
      saveProgress(currentEmail, currentLesson.lesson_id, fresh)
    }
    setProblemIndex(0)
    setLessonComplete(false)
    setStateMessage(null)
    setSessionStats({ correct: 0, total: 0, totalTime: 0, hintsUsed: 0 })
  }, [currentEmail, currentLesson?.lesson_id])

  // Get active problem pool from HMM state
  function getLessonProblems() {
    if (!currentLesson || !progress) return []
    const diff = progress.current_difficulty || 'easy'
    const ids  = currentLesson.problems?.[diff] || []
    return allProblems.filter(p => ids.includes(p.problem_id))
  }

  const lessonProblems = getLessonProblems()
  const currentProblem = lessonProblems[problemIndex] || null

  const handleSubmit = (result) => {
    if (!progress || !currentProblem) return

    const model = HMM_MODEL
    const slip  = model.inference_params.slip
    const guess = model.inference_params.guess
    const diff  = progress.current_difficulty || 'easy'
    const obs   = result.is_correct ? 'correct' : 'incorrect'

    // Update HMM belief
    const newBelief = updateBelief(progress.hmm_belief, obs, diff, slip, guess, model)
    const newState  = getDominantState(newBelief, model.inference_params.transition_ambiguity_cap)
    const oldState  = progress.dominant_state
    const confidence = Math.max(...newBelief)

    // Determine new difficulty
    let newDifficulty = progress.current_difficulty
    const newConsecutive = oldState === newState ? (progress.consecutive_at_state || 0) + 1 : 1
    const recommended = recommendDifficulty(newState)

    if (recommended && recommended !== newDifficulty) {
      if (shouldAdvanceDifficulty(confidence, newConsecutive) ||
          shouldRegressDifficulty(confidence, newConsecutive)) {
        newDifficulty = recommended
      }
    }

    // Show motivational message on state transition
    const msg = getStateMessage(oldState, newState)
    if (msg) {
      setStateMessage(msg)
      setTimeout(() => setStateMessage(null), 4000)
    }

    // Build updated recent_observations (keep last 5)
    const newObs = {
      correct: result.is_correct,
      difficulty: diff,
      timestamp: new Date().toISOString()
    }
    const recent = [...(progress.recent_observations || []), newObs].slice(-5)

    // Log misconceptions from incorrect distractor blocks
    if (!result.is_correct && result.incorrect_blocks?.length) {
      for (const bId of result.incorrect_blocks) {
        const b = blocks.find(x => x.block_id === bId)
        if (b?.distractor_reason) {
          logMisconception(currentEmail, {
            problem_id: currentProblem.problem_id,
            lesson_id: currentLesson.lesson_id,
            misconception_type: b.distractor_reason,
            description: `Selected "${b.content}" which is wrong because: ${b.distractor_reason.replace(/_/g, ' ')}`
          })
        }
      }
    }

    // Log attempt
    logAttempt(currentEmail, {
      problem_id: currentProblem.problem_id,
      lesson_id: currentLesson.lesson_id,
      is_correct: result.is_correct,
      difficulty: diff,
      selected_blocks: result.selected_blocks || [],
      incorrect_blocks: result.incorrect_blocks || [],
      time_to_first_block_ms: result.time_to_first_block_ms || 0,
      time_to_completion_ms:  result.time_to_completion_ms  || 0,
      belief_before: progress.hmm_belief,
      belief_after: newBelief,
      state_before: oldState,
      state_after: newState
    })

    // Build and save new progress
    const newProgress = {
      ...progress,
      hmm_belief: newBelief,
      dominant_state: newState,
      current_difficulty: newDifficulty,
      mastery_confidence: confidence,
      consecutive_at_state: newConsecutive,
      problems_attempted: (progress.problems_attempted || 0) + 1,
      current_streak: result.is_correct ? (progress.current_streak || 0) + 1 : 0,
      recent_observations: recent
    }
    setProgress(newProgress)
    saveProgress(currentEmail, currentLesson.lesson_id, newProgress)

    // Update session stats
    setSessionStats(prev => ({
      correct:   prev.correct + (result.is_correct ? 1 : 0),
      total:     prev.total + 1,
      totalTime: prev.totalTime + (result.time_to_completion_ms || 0),
      hintsUsed: prev.hintsUsed + (result.hints_used || 0)
    }))
  }

  const handleNext = () => {
    const nextIndex = problemIndex + 1
    if (nextIndex >= lessonProblems.length) {
      setLessonComplete(true)
    } else {
      setProblemIndex(nextIndex)
    }
  }

  const handleReplay = () => {
    setProblemIndex(0)
    setLessonComplete(false)
    setSessionStats({ correct: 0, total: 0, totalTime: 0, hintsUsed: 0 })
  }

  const handleContinue = () => {
    const nextLesson = lessons.find(l => l.lesson_id === currentLesson.next_lesson_id)
    if (nextLesson) {
      window.location.href = `/play?lesson=${nextLesson.lesson_id}`
    } else {
      handleReplay()
    }
  }

  // ─── Render States ────────────────────────────────────────────────────────

  if (!currentEmail) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-[#718F94]">No student selected. Go to Progress to set up a student.</p>
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-[#718F94]">No lessons found.</p>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-8 h-8 rounded-full border-2 border-[#90B494] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (lessonComplete) {
    return (
      <div className="p-4 md:p-8">
        <LessonComplete
          stats={sessionStats}
          lessonTitle={currentLesson.topic}
          masteryState={progress.dominant_state}
          masteryConfidence={progress.mastery_confidence}
          onReplay={handleReplay}
          onContinue={handleContinue}
        />
      </div>
    )
  }

  if (lessonProblems.length === 0) {
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-4">
        <div className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-8 text-center">
          <Blocks className="w-10 h-10 mx-auto text-[#718F94] mb-3" />
          <p className="text-[#BFC8AD]/70 text-sm">No problems found for this difficulty level.</p>
          <Link to="/lessons" className="mt-4 inline-flex items-center gap-2 text-[#90B494] text-sm hover:underline">
            <BookOpen className="w-4 h-4" />
            Browse Lessons
          </Link>
        </div>
      </div>
    )
  }

  const difficultyColors = {
    easy:     'text-emerald-300',
    moderate: 'text-amber-300',
    hard:     'text-rose-300'
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs text-[#718F94] font-semibold uppercase tracking-wider">{currentLesson.topic}</p>
          <h1 className="text-lg font-black text-white mt-0.5">{currentLesson.topic}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-[#718F94]">Problem {problemIndex + 1} of {lessonProblems.length}</p>
            <p className={`text-xs font-bold capitalize ${difficultyColors[progress.current_difficulty]}`}>
              {progress.current_difficulty}
            </p>
          </div>
          {/* Mini mastery indicator */}
          <div className="w-9 h-9 rounded-xl bg-[#718F94]/10 border border-[#718F94]/20
            flex items-center justify-center" title={`${Math.round((progress.mastery_confidence || 0) * 100)}% mastery`}>
            <Brain className="w-4 h-4 text-[#90B494]" />
          </div>
        </div>
      </div>

      {/* Progress bar across all problems */}
      <div className="h-1 rounded-full bg-[#718F94]/15 mb-6 overflow-hidden">
        <motion.div
          animate={{ width: `${((problemIndex) / lessonProblems.length) * 100}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-[#90B494]"
        />
      </div>

      {/* HMM mastery gauge */}
      <div className="mb-5 rounded-xl border border-[#718F94]/15 bg-[#3C3E53]/40 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[#718F94] shrink-0">Mastery</p>
          <div className="flex-1">
            <MasteryGauge
              state={progress.dominant_state}
              confidence={progress.mastery_confidence || 0}
            />
          </div>
        </div>
      </div>

      {/* State transition message */}
      <AnimatePresence>
        {stateMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 rounded-xl border border-[#90B494]/30 bg-[#90B494]/10 px-4 py-3
              flex items-center gap-2"
          >
            <Brain className="w-4 h-4 text-[#90B494] shrink-0" />
            <p className="text-sm text-[#BFC8AD]/80">{stateMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block engine */}
      <BlockEngine
        problem={currentProblem}
        blocks={blocks}
        onSubmit={handleSubmit}
        onNext={handleNext}
        isLast={problemIndex === lessonProblems.length - 1}
        currentDifficulty={progress.current_difficulty}
      />
    </div>
  )
}
