import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Blocks, BookOpen, BarChart3, TrendingUp, FileText, Menu, X } from 'lucide-react'

const NAV = [
  { to: '/play',      icon: Blocks,    label: 'Play' },
  { to: '/lessons',   icon: BookOpen,  label: 'Lessons' },
  { to: '/progress',  icon: TrendingUp, label: 'Progress' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/readme',    icon: FileText,  label: 'Readme' }
]

function NavItem({ item, mobile = false, onClick }) {
  const location = useLocation()
  const active = location.pathname === item.to

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group
        ${mobile ? 'w-full' : ''}
        ${active
          ? 'text-white'
          : 'text-[#718F94] hover:text-[#BFC8AD] hover:bg-[#718F94]/10'
        }`}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-[#90B494]/20 rounded-xl border border-[#90B494]/30"
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
      <item.icon className="w-5 h-5 relative z-10 shrink-0" />
      {mobile && <span className="relative z-10 text-sm font-medium">{item.label}</span>}
      {!mobile && (
        <span className="absolute left-full ml-3 px-2 py-1 bg-[#2a2c3d] text-[#BFC8AD] text-xs rounded-lg
          opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-[#718F94]/20
          transition-opacity duration-150">
          {item.label}
        </span>
      )}
    </NavLink>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-full min-h-screen" style={{ background: '#3C3E53' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col items-center gap-2 w-16 py-5 shrink-0
        border-r border-[#718F94]/15 bg-[#353748]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#90B494] to-[#718F94]
          flex items-center justify-center mb-4 shrink-0">
          <Blocks className="w-5 h-5 text-white" />
        </div>
        {NAV.map(item => (
          <NavItem key={item.to} item={item} />
        ))}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between
        px-4 h-14 border-b border-[#718F94]/15 bg-[#353748]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#90B494] to-[#718F94]
            flex items-center justify-center">
            <Blocks className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">AlgeBricks</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[#718F94] hover:text-[#BFC8AD] rounded-lg hover:bg-[#718F94]/10 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/50" />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col
                py-5 px-3 border-r border-[#718F94]/15 bg-[#353748]">
              <div className="flex items-center justify-between px-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#90B494] to-[#718F94]
                    flex items-center justify-center">
                    <Blocks className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white">AlgeBricks</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-[#718F94] hover:text-[#BFC8AD] rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {NAV.map(item => (
                <NavItem key={item.to} item={item} mobile onClick={() => setMobileOpen(false)} />
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
