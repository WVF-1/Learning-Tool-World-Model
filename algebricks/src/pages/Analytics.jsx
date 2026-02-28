import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import { Users, Target, AlertTriangle, TrendingUp } from 'lucide-react'
import { getAllAttemptsAllStudents, getAllMisconceptionsAllStudents, getAllStudents, getAllProgressAllStudents } from '@/api/localStore'
import { motion } from 'framer-motion'

const PALETTE = ['#90B494', '#718F94', '#BFC8AD', '#DBCFB0', '#5a8f7a', '#4e7a7e']

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-4 space-y-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs text-[#718F94]">{label}</p>
    </div>
  )
}

export default function Analytics() {
  const allAttempts = getAllAttemptsAllStudents()
  const allMisc     = getAllMisconceptionsAllStudents()
  const students    = getAllStudents()
  const allProgress = getAllProgressAllStudents()

  const totalAttempts = allAttempts.length
  const correctAll    = allAttempts.filter(a => a.is_correct).length
  const overallAccuracy = totalAttempts > 0
    ? Math.round((correctAll / totalAttempts) * 100)
    : 0

  // Difficulty performance
  const diffs = ['easy', 'moderate', 'hard']
  const diffData = diffs.map(d => {
    const da = allAttempts.filter(a => a.difficulty === d)
    const dc = da.filter(a => a.is_correct).length
    return {
      name: d.charAt(0).toUpperCase() + d.slice(1),
      Correct:   dc,
      Incorrect: da.length - dc,
      accuracy:  da.length > 0 ? Math.round((dc / da.length) * 100) : 0
    }
  })

  // Mastery distribution
  const stateCount = { learning: 0, transition: 0, practicing: 0, mastered: 0 }
  for (const email of Object.keys(allProgress)) {
    for (const lessonId of Object.keys(allProgress[email])) {
      const p = allProgress[email][lessonId]
      if (p?.dominant_state && !p.locked) {
        stateCount[p.dominant_state] = (stateCount[p.dominant_state] || 0) + 1
      }
    }
  }
  const masteryData = Object.entries(stateCount)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: v }))

  // Top misconceptions
  const miscCount = {}
  for (const m of allMisc) {
    const t = m.misconception_type.replace(/_/g, ' ')
    miscCount[t] = (miscCount[t] || 0) + 1
  }
  const miscData = Object.entries(miscCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([k, v]) => ({ name: k, count: v }))

  // Error distribution by state transition
  const stateTransitions = {}
  for (const a of allAttempts) {
    if (!a.is_correct && a.state_before) {
      stateTransitions[a.state_before] = (stateTransitions[a.state_before] || 0) + 1
    }
  }
  const errorDist = Object.entries(stateTransitions)
    .map(([k, v]) => ({ state: k, errors: v }))

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-sm text-[#BFC8AD]/50 mt-1">System-wide learning data across all students</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users}         label="Students"          value={students.length}    color="bg-[#90B494]" />
        <StatCard icon={Target}        label="Total Attempts"    value={totalAttempts}      color="bg-[#718F94]" />
        <StatCard icon={TrendingUp}    label="Overall Accuracy"  value={`${overallAccuracy}%`} color="bg-sky-500/70" />
        <StatCard icon={AlertTriangle} label="Misconceptions"    value={allMisc.length}     color="bg-amber-500/70" />
      </div>

      {/* Difficulty performance */}
      {totalAttempts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-5"
        >
          <h2 className="text-sm font-bold text-[#BFC8AD] mb-4">Performance by Difficulty</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={diffData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#718F94" strokeOpacity={0.1} />
              <XAxis dataKey="name" tick={{ fill: '#718F94', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#718F94', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#353748', border: '1px solid rgba(113,143,148,0.2)', borderRadius: 10 }}
                labelStyle={{ color: '#BFC8AD' }}
                itemStyle={{ color: '#BFC8AD' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#718F94' }} />
              <Bar dataKey="Correct"   fill="#90B494" radius={[4,4,0,0]} />
              <Bar dataKey="Incorrect" fill="#718F94" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {/* Mastery distribution pie */}
        {masteryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-5"
          >
            <h2 className="text-sm font-bold text-[#BFC8AD] mb-4">Mastery Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={masteryData}
                  cx="50%" cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                  style={{ fontSize: 10, fill: '#BFC8AD' }}
                >
                  {masteryData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#353748', border: '1px solid rgba(113,143,148,0.2)', borderRadius: 10 }}
                  itemStyle={{ color: '#BFC8AD' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Top misconceptions */}
        {miscData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-5"
          >
            <h2 className="text-sm font-bold text-[#BFC8AD] mb-4">Top Misconceptions</h2>
            <div className="space-y-2">
              {miscData.map((m, i) => {
                const max = miscData[0].count
                const pct = Math.round((m.count / max) * 100)
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#BFC8AD]/70 truncate flex-1 mr-2">{m.name}</span>
                      <span className="text-[#718F94] shrink-0">{m.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#718F94]/15 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="h-full rounded-full bg-amber-500/70"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Error distribution by state */}
      {errorDist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-5"
        >
          <h2 className="text-sm font-bold text-[#BFC8AD] mb-4">Errors by HMM State</h2>
          <div className="space-y-3">
            {errorDist.map((d, i) => {
              const maxErr = Math.max(...errorDist.map(x => x.errors))
              const pct = Math.round((d.errors / maxErr) * 100)
              const stateColors = {
                learning:   'bg-rose-500/50',
                practicing: 'bg-amber-500/50',
                mastered:   'bg-[#90B494]/60',
                transition: 'bg-sky-500/50'
              }
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#BFC8AD]/70 capitalize">{d.state}</span>
                    <span className="text-[#718F94]">{d.errors} errors</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#718F94]/15 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className={`h-full rounded-full ${stateColors[d.state] || 'bg-[#718F94]/50'}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {totalAttempts === 0 && (
        <div className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 p-10 text-center">
          <TrendingUp className="w-10 h-10 mx-auto text-[#718F94] mb-3" />
          <p className="text-[#BFC8AD]/60 text-sm">No attempt data yet. Start playing to see analytics.</p>
        </div>
      )}
    </div>
  )
}
