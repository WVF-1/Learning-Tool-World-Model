import React from 'react'

// Drag-based alternative engine — stub for future implementation
export default function FactoringEngine({ problem }) {
  return (
    <div className="rounded-xl border border-[#718F94]/20 bg-[#3C3E53]/40 p-6 text-center">
      <p className="text-sm text-[#718F94]">Drag-based factoring engine — coming soon.</p>
      {problem && (
        <p className="text-xs text-[#718F94]/50 mt-1">Problem: {problem.problem_expression}</p>
      )}
    </div>
  )
}
