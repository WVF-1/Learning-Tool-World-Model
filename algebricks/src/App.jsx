import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Play from './pages/Play'
import Lessons from './pages/Lessons'
import Progress from './pages/Progress'
import Analytics from './pages/Analytics'
import Readme from './pages/Readme'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/play" replace />} />
        <Route path="play" element={<Play />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="progress" element={<Progress />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="readme" element={<Readme />} />
      </Route>
    </Routes>
  )
}
