import modelData from '../../data/hmm_model_export.json'

export const HMM_MODEL = modelData

// ─── Core Bayesian Update ─────────────────────────────────────────────────

export function updateBelief(belief, observation, difficulty, slip, guess, model) {
  const newBelief = []
  for (let i = 0; i < model.states.length; i++) {
    const mastery = model.base_mastery[model.states[i]]
    let pCorrect = mastery * (1 - slip) + (1 - mastery) * guess
    pCorrect *= model.difficulty_multiplier[difficulty]
    const emission = observation === 'correct' ? pCorrect : (1 - pCorrect)
    let prior = 0
    for (let j = 0; j < model.states.length; j++) {
      prior += belief[j] * model.transition_matrix[j][i]
    }
    newBelief[i] = emission * prior
  }
  const norm = newBelief.reduce((a, b) => a + b, 0)
  if (norm === 0) return belief
  return newBelief.map(x => x / norm)
}

// ─── State Inference ──────────────────────────────────────────────────────

export function getDominantState(belief, ambiguityCap = 0.5) {
  const max = Math.max(...belief)
  if (max < ambiguityCap) return 'transition'
  return HMM_MODEL.states[belief.indexOf(max)]
}

export function recommendDifficulty(state) {
  switch (state) {
    case 'learning':   return 'easy'
    case 'practicing': return 'moderate'
    case 'mastered':   return 'hard'
    default:           return null  // transition — hold current
  }
}

// ─── Advance/Regress Guards ───────────────────────────────────────────────

export function shouldAdvanceDifficulty(masteryConfidence, consecutiveAtState) {
  return masteryConfidence >= HMM_MODEL.inference_params.mastery_threshold * 0.76 &&
    consecutiveAtState >= HMM_MODEL.inference_params.consecutive_required
}

export function shouldRegressDifficulty(masteryConfidence, consecutiveAtState) {
  return masteryConfidence < 0.4 &&
    consecutiveAtState >= HMM_MODEL.inference_params.consecutive_required
}

// ─── State Messages ───────────────────────────────────────────────────────

export function getStateMessage(oldState, newState) {
  if (oldState === newState) return null
  const transitions = {
    'learning→practicing':   "You're getting the hang of this — let's try something a little more challenging!",
    'practicing→mastered':   "Excellent work — you've really got this down!",
    'learning→mastered':     "Amazing progress — you jumped straight to mastery!",
    'mastered→practicing':   "Let's keep practicing to stay sharp.",
    'practicing→learning':   "Let's slow down a bit and reinforce the fundamentals.",
    'transition→learning':   "Let's work on building a stronger foundation.",
    'transition→practicing': "Good effort — let's keep working on this one a bit more.",
    'transition→mastered':   "You've shown consistent mastery — well done!"
  }
  return transitions[`${oldState}→${newState}`] || null
}

// ─── Initialize Progress ──────────────────────────────────────────────────

export function initializeProgress(email, lessonId) {
  return {
    hmm_belief: [...HMM_MODEL.initial_distribution],
    dominant_state: 'practicing',
    current_difficulty: 'easy',
    mastery_confidence: HMM_MODEL.initial_distribution[1],
    consecutive_at_state: 0,
    problems_attempted: 0,
    current_streak: 0,
    recent_observations: []
  }
}
