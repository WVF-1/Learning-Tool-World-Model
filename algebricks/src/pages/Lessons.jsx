import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, CheckCircle, PlayCircle, BookOpen, ChevronRight } from 'lucide-react'
import { useStudent } from '@/context/StudentContext'
import { getLessons, getProblems, getProgress } from '@/api/localStore'
import MasteryGauge from '@/components/game/MasteryGauge'

export default function Lessons() {
  const { currentEmail } = useStudent()
  const lessons   = getLessons()
  const allProblems = getProblems()

  const subtopics = [...new Set(lessons.map(l => l.topic))]

  const getLessonState = (lesson) => {
    const prog = currentEmail ? getProgress(currentEmail, lesson.lesson_id) : null
    const meetsPrereqs = lesson.prerequisites.every(preId => {
      const p = currentEmail ? getProgress(currentEmail, preId) : null
      return p?.completed
    })
    return { prog, meetsPrereqs: lesson.prerequisites.length === 0 || meetsPrereqs }
  }

  const totalProblems = (lesson) => {
    const ids = [
      ...(lesson.problems?.easy || []),
      ...(lesson.problems?.moderate || []),
      ...(lesson.problems?.hard || [])
    ]
    return ids.length
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Lessons</h1>
        <p className="text-sm text-[#BFC8AD]/50 mt-1">Complete lessons in order to unlock advanced content.</p>
      </div>

      {subtopics.map(topic => {
        const topicLessons = lessons.filter(l => l.topic === topic)

        return (
          <div key={topic} className="space-y-3">
            <h2 className="text-xs font-bold text-[#90B494] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              {topic}
            </h2>

            {topicLessons.map((lesson, i) => {
              const { prog, meetsPrereqs } = getLessonState(lesson)
              const locked = !meetsPrereqs
              const completed = prog?.completed
              const state = prog?.dominant_state || 'learning'
              const confidence = prog?.mastery_confidence || 0
              const count = totalProblems(lesson)

              return (
                <motion.div
                  key={lesson.lesson_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border transition-colors overflow-hidden
                    ${locked
                      ? 'border-[#718F94]/10 bg-[#3C3E53]/30 opacity-60'
                      : 'border-[#718F94]/20 bg-[#3C3E53]/60 hover:border-[#718F94]/35'
                    }`}
                >
                  <div className="p-5 flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${locked ? 'bg-[#718F94]/10'
                        : completed ? 'bg-[#90B494]/20'
                        : 'bg-[#718F94]/15'
                      }`}>
                      {locked ? (
                        <Lock className="w-5 h-5 text-[#718F94]" />
                      ) : completed ? (
                        <CheckCircle className="w-5 h-5 text-[#90B494]" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-[#718F94]" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{lesson.topic}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase
                          ${lesson.lesson_difficulty === 'hard'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : lesson.lesson_difficulty === 'moderate'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                          {lesson.lesson_difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-[#BFC8AD]/50 mt-0.5 line-clamp-2">{lesson.description}</p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-[#718F94]">
                        <span>{count} problems</span>
                        {lesson.prerequisites.length > 0 && (
                          <span>Requires: {lesson.prerequisites.join(', ')}</span>
                        )}
                      </div>

                      {/* Mastery gauge */}
                      {!locked && prog && (
                        <div className="mt-3 max-w-xs">
                          <MasteryGauge state={state} confidence={confidence} />
                        </div>
                      )}

                      {/* Learning objectives */}
                      {!locked && (
                        <ul className="mt-2 space-y-0.5">
                          {(lesson.learning_objectives || []).slice(0, 2).map((obj, j) => (
                            <li key={j} className="text-xs text-[#BFC8AD]/40 flex items-start gap-1">
                              <span className="text-[#718F94] mt-0.5">·</span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* CTA */}
                    {!locked && (
                      <Link
                        to={`/play?lesson=${lesson.lesson_id}`}
                        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl
                          bg-[#90B494] text-white text-sm font-bold hover:bg-[#7ea882] transition-colors"
                      >
                        {completed ? 'Replay' : 'Start'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
