import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAllStudents, addStudent } from '@/api/localStore'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([])
  const [currentEmail, setCurrentEmail] = useState(null)

  useEffect(() => {
    const all = getAllStudents()
    setStudents(all)
    const saved = localStorage.getItem('algebricks_current_student')
    if (saved && all.find(s => s.email === saved)) {
      setCurrentEmail(saved)
    } else if (all.length > 0) {
      setCurrentEmail(all[0].email)
    }
  }, [])

  const setStudent = (email) => {
    setCurrentEmail(email)
    localStorage.setItem('algebricks_current_student', email)
  }

  const createStudent = (name) => {
    const s = addStudent(name)
    setStudents(getAllStudents())
    setStudent(s.email)
    return s
  }

  const currentStudent = students.find(s => s.email === currentEmail) || null

  return (
    <StudentContext.Provider value={{ students, currentStudent, currentEmail, setStudent, createStudent }}>
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  return useContext(StudentContext)
}
