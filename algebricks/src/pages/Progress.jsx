import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Target, Flame, Clock, Layers, UserCircle, ChevronDown, AlertTriangle, Play } from 'lucide-react'
import { useStudent } from '@/context/StudentContext'
import { getLessons, getAttempts, getAllProgress, getMisconceptions } from '@/api/localStore'
import MasteryGauge from '@/components/game/MasteryGauge'
import GateProgress from '@/components/game/GateProgress'

const CHART_COLORS = { correct: '#90B494', incorrect: '#718F94' }

function KPICard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="rounded-xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-4 space-y-1">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs text-[#718F94]">{label}</p>
      {sub && <p className="text-[10px] text-[#718F94]/50">{sub}</p>}
    </div>
  )
}

export default function Progress() {
  const { students, currentEmail, setStudent } = useStudent()
  const lessons = getLessons()

  if (!currentEmail) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-[#718F94]">No student selected.</p>
      </div>
    )
  }

  const attempts   = getAttempts(currentEmail)
  const allProg    = getAllProgress(currentEmail)
  const misc       = getMisconceptions(currentEmail)

  const correct    = attempts.filter(a => a.is_correct).length
  const total      = attempts.length
  const accuracy   = total > 0 ? Math.round((correct / total) * 100) : 0
  const avgTime    = total > 0
    ? Math.round(attempts.reduce((s, a) => s + (a.time_to_completion_ms || 0), 0) / total / 1000)
    : 0
  const bestStreak = (() => {
    let max = 0, cur = 0
    for (const a of attempts) { cur = a.is_correct ? cur + 1 : 0; max = Math.max(max, cur) }
    return max
  })()

  // Chart data: correct vs attempted per lesson
  const chartData = lessons.map(l => {
    const la = attempts.filter(a => a.lesson_id === l.lesson_id)
    const lc = la.filter(a => a.is_correct).length
    return {
      name: l.lesson_id,
      Correct: lc,
      Incorrect: la.length - lc
    }
  })

  // Gate progress per lesson
  const gateForLesson = (lesson) => {
    const la = attempts.filter(a => a.lesson_id === lesson.lesson_id)
    return {
      moderate: la.filter(a => a.difficulty === 'moderate' && a.is_correct).length,
      hard:     la.filter(a => a.difficulty === 'hard'     && a.is_correct).length,
      moderateTarget: 3,
      hardTarget: 2
    }
  }

  const currentStudent = students.find(s => s.email === currentEmail)

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header + Student Selector */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">My Progress</h1>
          <p className="text-sm text-[#BFC8AD]/50 mt-0.5">Track your mastery and learning history</p>
        </div>

        {/* Student selector */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#718F94]/25
            bg-[#3C3E53]/60 text-sm text-[#BFC8AD]">
            <UserCircle className="w-4 h-4 text-[#718F94]" />
            <select
              value={currentEmail}
              onChange={e => setStudent(e.target.value)}
              className="bg-transparent text-[#BFC8AD] text-sm outline-none pr-6 cursor-pointer"
            >
              {students.map(s => (
                <option key={s.email} value={s.email} style={{ background: '#3C3E53' }}>
                  {s.display_name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#718F94]" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard icon={Target}  label="Accuracy"        value={`${accuracy}%`}   color="bg-[#90B494]"   />
        <KPICard icon={Flame}   label="Best Streak"     value={bestStreak}        color="bg-amber-500/70" />
        <KPICard icon={Clock}   label="Avg Time"        value={`${avgTime}s`}     color="bg-sky-500/70"  />
        <KPICard icon={Layers}  label="Problems Solved" value={correct}           color="bg-violet-500/70" sub={`of ${total} attempted`} />
      </div>

      {/* Attempts chart */}
      {total > 0 && (
        <div className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-5">
          <h2 className="text-sm font-bold text-[#BFC8AD] mb-4">Attempts by Lesson</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#718F94" strokeOpacity={0.1} />
              <XAxis dataKey="name" tick={{ fill: '#718F94', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#718F94', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#353748', border: '1px solid rgba(113,143,148,0.2)', borderRadius: 10 }}
                labelStyle={{ color: '#BFC8AD' }}
                itemStyle={{ color: '#BFC8AD' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#718F94' }} />
              <Bar dataKey="Correct"   fill={CHART_COLORS.correct}   radius={[4,4,0,0]} />
              <Bar dataKey="Incorrect" fill={CHART_COLORS.incorrect}  radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Per-lesson mastery */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#BFC8AD]">Lesson Mastery</h2>
        {lessons.map(lesson => {
          const prog = allProg[lesson.lesson_id]
          if (!prog) return null
          return (
            <motion.div
              key={lesson.lesson_id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{lesson.topic}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#718F94]">{prog.problems_attempted || 0} attempts</span>
                  <Link
                    to={`/play?lesson=${lesson.lesson_id}`}
                    className="flex items-center gap-1 text-xs text-[#90B494] hover:underline"
                  >
                    <Play className="w-3 h-3" />
                    Practice
                  </Link>
                </div>
              </div>
              <MasteryGauge state={prog.dominant_state} confidence={prog.mastery_confidence || 0} />
              <GateProgress progress={gateForLesson(lesson)} />
            </motion.div>
          )
        })}
      </div>

      {/* Misconceptions */}
      {misc.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#BFC8AD] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Active Misconceptions
          </h2>
          {misc.filter(m => !m.resolved).map((m, i) => (
            <div key={i} className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 space-y-1">
              <p className="text-xs font-bold text-amber-400">
                {m.misconception_type.replace(/_/g, ' ')}
              </p>
              <p className="text-xs text-[#BFC8AD]/60">{m.description}</p>
              <p className="text-[10px] text-[#718F94]">{m.problem_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
