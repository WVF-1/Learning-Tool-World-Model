import lessonsData from '../data/lessons.json'
import problemsData from '../data/problems.json'
import blocksData from '../data/blocks.json'
import hmmModel from '../data/hmm_model_export.json'

// ─── Curriculum (read-only) ────────────────────────────────────────────────

export function getLessons() {
  return lessonsData.lessons
}

export function getProblems() {
  return problemsData.problems
}

export function getBlocks() {
  return blocksData.blocks
}

export function getHmmModel() {
  return hmmModel
}

// ─── Seed Data ────────────────────────────────────────────────────────────

const DEMO_STUDENTS = [
  {
    user_id: 'U001',
    display_name: 'Alex',
    email: 'alex@algebricks.demo',
    created_at: '2026-02-01T09:00:00Z',
    current_lesson_id: 'L101',
    lessons_completed: [],
    lessons_unlocked: ['L101']
  },
  {
    user_id: 'U002',
    display_name: 'Jordan',
    email: 'jordan@algebricks.demo',
    created_at: '2026-01-20T14:00:00Z',
    current_lesson_id: 'L102',
    lessons_completed: ['L101'],
    lessons_unlocked: ['L101', 'L102']
  },
  {
    user_id: 'U003',
    display_name: 'Morgan',
    email: 'morgan@algebricks.demo',
    created_at: '2026-01-10T08:00:00Z',
    current_lesson_id: 'L102',
    lessons_completed: ['L101'],
    lessons_unlocked: ['L101', 'L102']
  }
]

const DEMO_PROGRESS = {
  'alex@algebricks.demo': {
    L101: {
      hmm_belief: [0.55, 0.38, 0.07],
      dominant_state: 'learning',
      current_difficulty: 'moderate',
      mastery_confidence: 0.55,
      consecutive_at_state: 2,
      problems_attempted: 7,
      current_streak: 0,
      recent_observations: [
        { correct: true, difficulty: 'easy', timestamp: '2026-02-01T09:05:00Z' },
        { correct: true, difficulty: 'easy', timestamp: '2026-02-01T09:12:00Z' },
        { correct: true, difficulty: 'easy', timestamp: '2026-02-01T09:19:00Z' },
        { correct: false, difficulty: 'moderate', timestamp: '2026-02-01T09:28:00Z' },
        { correct: false, difficulty: 'moderate', timestamp: '2026-02-01T09:51:00Z' }
      ]
    },
    L102: {
      hmm_belief: [0.2, 0.6, 0.2],
      dominant_state: 'learning',
      current_difficulty: 'easy',
      mastery_confidence: 0.6,
      consecutive_at_state: 0,
      problems_attempted: 0,
      current_streak: 0,
      recent_observations: [],
      locked: true
    }
  },
  'jordan@algebricks.demo': {
    L101: {
      hmm_belief: [0.0, 0.08, 0.92],
      dominant_state: 'mastered',
      current_difficulty: 'hard',
      mastery_confidence: 0.92,
      consecutive_at_state: 5,
      problems_attempted: 12,
      current_streak: 4,
      recent_observations: [
        { correct: true, difficulty: 'hard', timestamp: '2026-01-27T10:45:00Z' },
        { correct: true, difficulty: 'hard', timestamp: '2026-01-28T16:00:00Z' }
      ],
      completed: true
    },
    L102: {
      hmm_belief: [0.10, 0.61, 0.29],
      dominant_state: 'practicing',
      current_difficulty: 'moderate',
      mastery_confidence: 0.61,
      consecutive_at_state: 1,
      problems_attempted: 6,
      current_streak: 1,
      recent_observations: [
        { correct: true, difficulty: 'moderate', timestamp: '2026-01-30T10:05:00Z' },
        { correct: false, difficulty: 'moderate', timestamp: '2026-02-01T11:00:00Z' },
        { correct: false, difficulty: 'moderate', timestamp: '2026-02-01T11:12:00Z' }
      ]
    }
  },
  'morgan@algebricks.demo': {
    L101: {
      hmm_belief: [0.0, 0.03, 0.97],
      dominant_state: 'mastered',
      current_difficulty: 'hard',
      mastery_confidence: 0.97,
      consecutive_at_state: 8,
      problems_attempted: 10,
      current_streak: 10,
      recent_observations: [
        { correct: true, difficulty: 'hard', timestamp: '2026-01-18T15:00:00Z' }
      ],
      completed: true
    },
    L102: {
      hmm_belief: [0.03, 0.18, 0.79],
      dominant_state: 'mastered',
      current_difficulty: 'hard',
      mastery_confidence: 0.79,
      consecutive_at_state: 3,
      problems_attempted: 10,
      current_streak: 4,
      recent_observations: [
        { correct: true, difficulty: 'hard', timestamp: '2026-01-28T14:00:00Z' },
        { correct: false, difficulty: 'hard', timestamp: '2026-02-03T10:00:00Z' },
        { correct: true, difficulty: 'hard', timestamp: '2026-02-03T10:10:00Z' }
      ]
    }
  }
}

const DEMO_ATTEMPTS = {
  'alex@algebricks.demo': [
    { problem_id: 'P001', lesson_id: 'L101', is_correct: true,  difficulty: 'easy',     time_to_completion_ms: 42000, selected_blocks: ['B001','B002','B003','B004'], incorrect_blocks: [], timestamp: '2026-02-01T09:05:00Z', state_before: 'practicing', state_after: 'practicing' },
    { problem_id: 'P002', lesson_id: 'L101', is_correct: true,  difficulty: 'easy',     time_to_completion_ms: 38000, selected_blocks: ['B005','B006','B007'], incorrect_blocks: [], timestamp: '2026-02-01T09:12:00Z', state_before: 'practicing', state_after: 'practicing' },
    { problem_id: 'P003', lesson_id: 'L101', is_correct: true,  difficulty: 'easy',     time_to_completion_ms: 35000, selected_blocks: ['B008','B009','B010'], incorrect_blocks: [], timestamp: '2026-02-01T09:19:00Z', state_before: 'practicing', state_after: 'learning' },
    { problem_id: 'P004', lesson_id: 'L101', is_correct: false, difficulty: 'moderate', time_to_completion_ms: 72000, selected_blocks: ['B011','B110','B013'], incorrect_blocks: ['B110'], timestamp: '2026-02-01T09:28:00Z', state_before: 'learning', state_after: 'learning' },
    { problem_id: 'P004', lesson_id: 'L101', is_correct: true,  difficulty: 'moderate', time_to_completion_ms: 55000, selected_blocks: ['B011','B012','B013'], incorrect_blocks: [], timestamp: '2026-02-01T09:35:00Z', state_before: 'learning', state_after: 'learning' },
    { problem_id: 'P005', lesson_id: 'L101', is_correct: false, difficulty: 'moderate', time_to_completion_ms: 80000, selected_blocks: ['B014','B114','B016'], incorrect_blocks: ['B114'], timestamp: '2026-02-01T09:44:00Z', state_before: 'learning', state_after: 'learning' },
    { problem_id: 'P005', lesson_id: 'L101', is_correct: false, difficulty: 'moderate', time_to_completion_ms: 65000, selected_blocks: ['B014','B113','B016'], incorrect_blocks: ['B113'], timestamp: '2026-02-01T09:51:00Z', state_before: 'learning', state_after: 'learning' }
  ],
  'jordan@algebricks.demo': [
    { problem_id: 'P001', lesson_id: 'L101', is_correct: true, difficulty: 'easy',     time_to_completion_ms: 30000, selected_blocks: ['B001','B002','B003','B004'], incorrect_blocks: [], timestamp: '2026-01-20T14:10:00Z', state_before: 'practicing', state_after: 'practicing' },
    { problem_id: 'P002', lesson_id: 'L101', is_correct: true, difficulty: 'easy',     time_to_completion_ms: 28000, selected_blocks: ['B005','B006','B007'], incorrect_blocks: [], timestamp: '2026-01-20T14:17:00Z', state_before: 'practicing', state_after: 'practicing' },
    { problem_id: 'P003', lesson_id: 'L101', is_correct: true, difficulty: 'easy',     time_to_completion_ms: 25000, selected_blocks: ['B008','B009','B010'], incorrect_blocks: [], timestamp: '2026-01-20T14:22:00Z', state_before: 'practicing', state_after: 'practicing' },
    { problem_id: 'P004', lesson_id: 'L101', is_correct: true, difficulty: 'moderate', time_to_completion_ms: 40000, selected_blocks: ['B011','B012','B013'], incorrect_blocks: [], timestamp: '2026-01-21T10:05:00Z', state_before: 'practicing', state_after: 'mastered' },
    { problem_id: 'P008', lesson_id: 'L101', is_correct: false, difficulty: 'hard',    time_to_completion_ms: 90000, selected_blocks: ['B024','B122','B026','B027'], incorrect_blocks: ['B122'], timestamp: '2026-01-25T13:10:00Z', state_before: 'mastered', state_after: 'mastered' },
    { problem_id: 'P008', lesson_id: 'L101', is_correct: true, difficulty: 'hard',     time_to_completion_ms: 60000, selected_blocks: ['B024','B025','B026','B027'], incorrect_blocks: [], timestamp: '2026-01-25T13:20:00Z', state_before: 'mastered', state_after: 'mastered' },
    { problem_id: 'P011', lesson_id: 'L102', is_correct: true, difficulty: 'easy',     time_to_completion_ms: 35000, selected_blocks: ['B036','B037','B038'], incorrect_blocks: [], timestamp: '2026-01-29T09:00:00Z', state_before: 'practicing', state_after: 'practicing' },
    { problem_id: 'P015', lesson_id: 'L102', is_correct: false, difficulty: 'moderate', time_to_completion_ms: 110000, selected_blocks: ['B051','B143','B053','B054','B055'], incorrect_blocks: ['B143'], timestamp: '2026-02-01T11:00:00Z', state_before: 'practicing', state_after: 'practicing' },
    { problem_id: 'P015', lesson_id: 'L102', is_correct: false, difficulty: 'moderate', time_to_completion_ms: 95000, selected_blocks: ['B051','B144','B053','B054','B055'], incorrect_blocks: ['B144'], timestamp: '2026-02-01T11:12:00Z', state_before: 'practicing', state_after: 'practicing' }
  ],
  'morgan@algebricks.demo': [
    { problem_id: 'P001', lesson_id: 'L101', is_correct: true, difficulty: 'easy',     time_to_completion_ms: 18000, selected_blocks: ['B001','B002','B003','B004'], incorrect_blocks: [], timestamp: '2026-01-10T08:10:00Z', state_before: 'practicing', state_after: 'mastered' },
    { problem_id: 'P008', lesson_id: 'L101', is_correct: true, difficulty: 'hard',     time_to_completion_ms: 45000, selected_blocks: ['B024','B025','B026','B027'], incorrect_blocks: [], timestamp: '2026-01-15T13:00:00Z', state_before: 'mastered', state_after: 'mastered' },
    { problem_id: 'P010', lesson_id: 'L101', is_correct: true, difficulty: 'hard',     time_to_completion_ms: 50000, selected_blocks: ['B032','B033','B034','B035'], incorrect_blocks: [], timestamp: '2026-01-18T15:00:00Z', state_before: 'mastered', state_after: 'mastered' },
    { problem_id: 'P018', lesson_id: 'L102', is_correct: true, difficulty: 'hard',     time_to_completion_ms: 70000, selected_blocks: ['B065','B066','B067','B068','B069'], incorrect_blocks: [], timestamp: '2026-01-28T14:00:00Z', state_before: 'mastered', state_after: 'mastered' },
    { problem_id: 'P019', lesson_id: 'L102', is_correct: false, difficulty: 'hard',    time_to_completion_ms: 85000, selected_blocks: ['B070','B071','B156','B073','B074'], incorrect_blocks: ['B156'], timestamp: '2026-02-03T10:00:00Z', state_before: 'mastered', state_after: 'mastered' },
    { problem_id: 'P019', lesson_id: 'L102', is_correct: true, difficulty: 'hard',     time_to_completion_ms: 62000, selected_blocks: ['B070','B071','B072','B073','B074'], incorrect_blocks: [], timestamp: '2026-02-03T10:10:00Z', state_before: 'mastered', state_after: 'mastered' }
  ]
}

// ─── Initialization ────────────────────────────────────────────────────────

function ensureSeeded() {
  if (localStorage.getItem('algebricks_initialized')) return
  localStorage.setItem('algebricks_students', JSON.stringify(DEMO_STUDENTS))
  for (const [email, progMap] of Object.entries(DEMO_PROGRESS)) {
    for (const [lessonId, prog] of Object.entries(progMap)) {
      localStorage.setItem(`algebricks_progress_${email}_${lessonId}`, JSON.stringify(prog))
    }
  }
  for (const [email, attempts] of Object.entries(DEMO_ATTEMPTS)) {
    localStorage.setItem(`algebricks_attempts_${email}`, JSON.stringify(attempts))
  }
  localStorage.setItem('algebricks_initialized', '1')
}

ensureSeeded()

// ─── Students ─────────────────────────────────────────────────────────────

export function getAllStudents() {
  return JSON.parse(localStorage.getItem('algebricks_students') || '[]')
}

export function addStudent(name) {
  const slug = name.toLowerCase().replace(/\s+/g, '.')
  const email = `${slug}@algebricks.local`
  const student = {
    user_id: `U${Date.now()}`,
    display_name: name,
    email,
    created_at: new Date().toISOString(),
    current_lesson_id: 'L101',
    lessons_completed: [],
    lessons_unlocked: ['L101']
  }
  const all = getAllStudents()
  all.push(student)
  localStorage.setItem('algebricks_students', JSON.stringify(all))
  return student
}

// ─── Student Progress ──────────────────────────────────────────────────────

export function getProgress(email, lessonId) {
  const raw = localStorage.getItem(`algebricks_progress_${email}_${lessonId}`)
  return raw ? JSON.parse(raw) : null
}

export function saveProgress(email, lessonId, data) {
  localStorage.setItem(`algebricks_progress_${email}_${lessonId}`, JSON.stringify(data))
}

export function getAllProgress(email) {
  const lessons = getLessons()
  const result = {}
  for (const l of lessons) {
    const p = getProgress(email, l.lesson_id)
    if (p) result[l.lesson_id] = p
  }
  return result
}

export function getAllProgressAllStudents() {
  const students = getAllStudents()
  const result = {}
  for (const s of students) {
    result[s.email] = getAllProgress(s.email)
  }
  return result
}

// ─── Attempt Log ──────────────────────────────────────────────────────────

export function logAttempt(email, attempt) {
  const key = `algebricks_attempts_${email}`
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  existing.push({ ...attempt, timestamp: new Date().toISOString() })
  localStorage.setItem(key, JSON.stringify(existing))
}

export function getAttempts(email) {
  return JSON.parse(localStorage.getItem(`algebricks_attempts_${email}`) || '[]')
}

export function getAllAttemptsAllStudents() {
  const students = getAllStudents()
  let all = []
  for (const s of students) {
    const attempts = getAttempts(s.email)
    all = all.concat(attempts.map(a => ({ ...a, student_email: s.email, student_name: s.display_name })))
  }
  return all
}

// ─── Misconceptions ────────────────────────────────────────────────────────

export function getMisconceptions(email) {
  return JSON.parse(localStorage.getItem(`algebricks_misconceptions_${email}`) || '[]')
}

export function logMisconception(email, misconception) {
  const key = `algebricks_misconceptions_${email}`
  const existing = getMisconceptions(email)
  const alreadyLogged = existing.find(m =>
    m.misconception_type === misconception.misconception_type &&
    m.problem_id === misconception.problem_id
  )
  if (!alreadyLogged) {
    existing.push({ ...misconception, resolved: false, flagged_at: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(existing))
  }
}

export function getAllMisconceptionsAllStudents() {
  const students = getAllStudents()
  let all = []
  for (const s of students) {
    const misc = getMisconceptions(s.email)
    all = all.concat(misc.map(m => ({ ...m, student_email: s.email, student_name: s.display_name })))
  }
  return all
}
