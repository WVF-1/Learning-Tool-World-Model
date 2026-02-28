import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Brain, Blocks, BarChart3, Database, Code2,
  Layers, Zap, ChevronDown, ChevronRight, Shield, GitBranch,
  Target, Cpu, FileJson, Package, Palette, Layout
} from "lucide-react";

const Section = ({ title, icon: Icon, color, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#718F94]/20 bg-[#3C3E53]/60 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-[#718F94]/10 transition-colors"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-bold text-[#BFC8AD] flex-1">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-[#718F94]" /> : <ChevronRight className="w-4 h-4 text-[#718F94]" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-[#718F94]/10 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Tag = ({ children, color = "bg-[#90B494]/10 text-[#90B494] border-[#90B494]/20" }) => (
  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border font-mono ${color}`}>{children}</span>
);

const Field = ({ name, type, desc, required }) => (
  <div className="flex items-start gap-3 py-2 border-b border-[#718F94]/10 last:border-0">
    <div className="flex items-center gap-2 min-w-[200px]">
      <code className="text-xs text-[#90B494] font-mono">{name}</code>
      {required && <span className="text-[10px] text-rose-400 border border-rose-400/30 rounded px-1">req</span>}
    </div>
    <Tag color="bg-[#718F94]/10 text-[#718F94] border-[#718F94]/20">{type}</Tag>
    <p className="text-xs text-[#BFC8AD]/50 flex-1">{desc}</p>
  </div>
);

const CodeBlock = ({ children, title }) => (
  <div className="rounded-xl overflow-hidden border border-[#718F94]/20">
    {title && <div className="px-4 py-2 bg-[#718F94]/10 text-xs text-[#BFC8AD]/50 font-mono border-b border-[#718F94]/20">{title}</div>}
    <pre className="p-4 text-xs text-[#BFC8AD]/80 font-mono overflow-x-auto bg-black/20 leading-relaxed whitespace-pre-wrap">
      {children}
    </pre>
  </div>
);

const SubHead = ({ children }) => (
  <h3 className="text-sm font-bold text-[#90B494] uppercase tracking-wider mt-4 mb-2">{children}</h3>
);

const P = ({ children }) => (
  <p className="text-sm text-[#BFC8AD]/70 leading-relaxed">{children}</p>
);

export default function Readme() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-[#90B494]/20 via-[#718F94]/10 to-[#3C3E53] border border-[#90B494]/20 p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#90B494] to-[#718F94] flex items-center justify-center">
            <Blocks className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">AlgeBricks</h1>
            <p className="text-[#BFC8AD]/60 text-sm">Adaptive Algebra Learning · HMM-Powered · Lego-Style Interface</p>
          </div>
        </div>
        <p className="text-[#BFC8AD]/80 text-base leading-relaxed max-w-3xl">
          AlgeBricks is a gamified, adaptive mathematics education application focused on teaching algebra — specifically polynomial factoring and quadratic equations — through a spatial, block-based interface. Students assemble solutions step-by-step like Lego bricks, while a Hidden Markov Model (HMM) silently tracks their knowledge state and adjusts problem difficulty in real time.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {["React 18", "TanStack Query", "Framer Motion", "Recharts", "Base44 SDK", "Tailwind CSS", "HMM Adaptive Engine"].map(t => (
            <Tag key={t} color="bg-white/5 text-[#BFC8AD]/60 border-white/10">{t}</Tag>
          ))}
        </div>
      </motion.div>

      {/* Architecture Overview */}
      <Section title="Architecture Overview" icon={Layout} color="bg-[#718F94]" defaultOpen={true}>
        <P>AlgeBricks is a single-page React application running on the Base44 platform, which provides a backend-as-a-service layer (database, auth, integrations). There is no custom backend code — all logic runs in the browser.</P>

        <SubHead>Layer Diagram</SubHead>
        <CodeBlock title="System Layers">
{`┌─────────────────────────────────────────────────────────┐
│                    BROWSER / REACT APP                  │
│                                                         │
│  Pages           Components            State            │
│  ──────          ──────────            ─────            │
│  Play            BlockEngine           TanStack Query   │
│  Lessons         HMM Engine            useState/Effect  │
│  Progress        BrickBlock            Framer Motion    │
│  Analytics       MasteryGauge          React Context    │
│  Readme          LessonComplete                         │
│                  GateProgress                           │
│                  HintPanel                              │
│                  BrickSlot                              │
│                  FactoringEngine                        │
│                                                         │
│  Layout.js (sidebar + mobile nav wraps all pages)       │
│  globals.css (dark theme + CSS vars + animations)       │
└──────────────────┬──────────────────────────────────────┘
                   │ Base44 SDK (@/api/base44Client)
┌──────────────────▼──────────────────────────────────────┐
│                 BASE44 BACKEND (BaaS)                   │
│                                                         │
│  Entities (MongoDB-style documents)                     │
│  ─────────────────────────────────                      │
│  Lesson · Problem · Block                               │
│  StudentProgress · AttemptLog · Misconception           │
│                                                         │
│  Auth  ·  File Upload  ·  LLM Integration               │
└─────────────────────────────────────────────────────────┘`}
        </CodeBlock>

        <SubHead>File Structure</SubHead>
        <CodeBlock>
{`algebricks/
├── pages/
│   ├── Play.jsx          # Main game loop
│   ├── Lessons.jsx       # Browse curriculum
│   ├── Progress.jsx      # Student personal dashboard
│   ├── Analytics.jsx     # Admin/system-wide metrics
│   └── Readme.jsx        # This document
├── components/
│   └── game/
│       ├── BlockEngine.jsx      # Core step-by-step puzzle UI
│       ├── HMM.js               # Hidden Markov Model logic
│       ├── BrickBlock.jsx       # Individual interactive block
│       ├── BrickSlot.jsx        # Drop zone for blocks
│       ├── MasteryGauge.jsx     # Visual mastery indicator
│       ├── LessonComplete.jsx   # End-of-lesson summary screen
│       ├── GateProgress.jsx     # Medium/hard gate tracker
│       ├── HintPanel.jsx        # Collapsible hint system
│       └── FactoringEngine.jsx  # Alternative drag-drop engine
├── entities/
│   ├── Lesson.json          # Curriculum unit schema
│   ├── Problem.json         # Math problem schema
│   ├── Block.json           # Answer block schema
│   ├── StudentProgress.json # Per-student per-lesson HMM state
│   ├── AttemptLog.json      # Every problem attempt
│   └── Misconception.json   # Detected error patterns
├── Layout.js                # App shell (sidebar, mobile nav)
└── globals.css              # Theme tokens + animations`}
        </CodeBlock>
      </Section>

      {/* Data Model */}
      <Section title="Data Model & Entities" icon={Database} color="bg-[#90B494]">
        <P>Six entities power the app. Three are curriculum data (Lesson, Problem, Block) and three are student data (StudentProgress, AttemptLog, Misconception). All records have built-in <code className="text-[#90B494] text-xs">id</code>, <code className="text-[#90B494] text-xs">created_date</code>, <code className="text-[#90B494] text-xs">updated_date</code>, and <code className="text-[#90B494] text-xs">created_by</code> fields.</P>

        <SubHead>Lesson</SubHead>
        <P>Represents one curriculum unit (e.g. "Factoring Monic Trinomials"). Lessons are sequenced by <code className="text-[#90B494] text-xs">lesson_path_id</code> and organized into subtopics. The critical field is <code className="text-[#90B494] text-xs">problems_by_difficulty</code> — a map of difficulty tiers to problem IDs, which the HMM uses to select appropriate problems.</P>
        <div className="space-y-0.5 mt-2">
          <Field name="lesson_id" type="string" desc="Unique slug identifier e.g. 'L1'" required />
          <Field name="lesson_path_id" type="number" desc="Sort order in curriculum sequence" />
          <Field name="topic" type="string" desc="Top-level topic e.g. 'Factoring Polynomials'" required />
          <Field name="subtopic" type="string" desc="e.g. 'Factoring Trinomials'" />
          <Field name="title" type="string" desc="Display title of the lesson" required />
          <Field name="problems_by_difficulty" type="object" desc="{ easy: [ids], moderate: [ids], hard: [ids] } — the HMM reads this to select problem pools" />
          <Field name="prerequisites" type="string[]" desc="Lesson IDs that must be completed first" />
          <Field name="hmm_mastery_threshold" type="number" desc="Belief probability to advance (default 0.85)" />
          <Field name="learning_objectives" type="string[]" desc="List of skill objectives" />
        </div>

        <SubHead>Problem</SubHead>
        <P>One algebra problem. The most important fields are <code className="text-[#90B494] text-xs">correct_block_ids</code> (ordered array defining the correct solution sequence) and <code className="text-[#90B494] text-xs">distractor_pool_ids</code> (wrong-answer blocks mixed into the UI to challenge the student).</P>
        <div className="space-y-0.5 mt-2">
          <Field name="problem_id" type="string" desc="Unique identifier e.g. 'P1-E1'" required />
          <Field name="lesson_id" type="string" desc="Foreign key to Lesson" />
          <Field name="problem_expression" type="string" desc="The expression shown: e.g. 'x² + 5x + 6'" required />
          <Field name="correct_answer" type="string" desc="Fully factored form: e.g. '(x + 2)(x + 3)'" required />
          <Field name="correct_block_ids" type="string[]" desc="ORDERED list of block IDs. BlockEngine validates selection against this sequence." />
          <Field name="distractor_pool_ids" type="string[]" desc="Wrong block IDs mixed into the available pool" />
          <Field name="difficulty" type="enum" desc="easy | moderate | hard" required />
          <Field name="difficulty_rank" type="number" desc="Numeric ordering within tier" />
          <Field name="structure" type="enum" desc="monic_trinomial | non_monic_trinomial | binomial | difference_of_squares | perfect_square" />
          <Field name="solution_steps" type="string[]" desc="Human-readable step explanations for hints" />
          <Field name="hints" type="string[]" desc="Progressive hints shown via HintPanel" />
        </div>

        <SubHead>Block</SubHead>
        <P>The atomic unit of the game. Each block is a card the student can click. Blocks are either <code className="text-[#90B494] text-xs">correct</code> (part of the solution) or <code className="text-[#90B494] text-xs">distractor</code> (intentional wrong answer). Blocks belong to a problem and optionally carry a step label for analytics tagging.</P>
        <div className="space-y-0.5 mt-2">
          <Field name="block_id" type="string" desc="Unique ID e.g. 'B-P1-E1-1'" required />
          <Field name="problem_id" type="string" desc="Parent problem" />
          <Field name="content" type="string" desc="Text shown on the block e.g. 'Find two numbers that multiply to 6 and add to 5'" required />
          <Field name="block_type" type="enum" desc="correct | distractor" required />
          <Field name="position" type="number" desc="Order in solution (null for distractors)" />
          <Field name="step_label" type="string" desc="e.g. 'identify_gcf' for analytics" />
          <Field name="distractor_reason" type="string" desc="Why this distractor is wrong — used for misconception tagging" />
        </div>

        <SubHead>StudentProgress</SubHead>
        <P>The live HMM state for one student × one lesson. This is the most critical student record — it stores the current <code className="text-[#90B494] text-xs">hmm_belief</code> vector, <code className="text-[#90B494] text-xs">dominant_state</code>, and <code className="text-[#90B494] text-xs">current_difficulty</code>. It is read at the start of each session to restore context and written after every problem submission.</P>
        <div className="space-y-0.5 mt-2">
          <Field name="student_email" type="string" desc="FK to authenticated user" required />
          <Field name="lesson_id" type="string" desc="FK to Lesson" required />
          <Field name="hmm_belief" type="number[]" desc="[learning, practicing, mastered] probability vector — the core HMM state" />
          <Field name="dominant_state" type="enum" desc="learning | practicing | mastered | transition" />
          <Field name="current_difficulty" type="enum" desc="easy | moderate | hard — drives which problem pool is used" />
          <Field name="consecutive_at_state" type="number" desc="Consecutive updates at same state — used for advance/regress logic" />
          <Field name="mastery_confidence" type="number" desc="Max value in hmm_belief — used as a percentage display" />
          <Field name="recent_observations" type="object[]" desc="Last 5 {correct, difficulty, belief, timestamp} — sliding window" />
          <Field name="problems_attempted" type="number" desc="Total problems attempted this lesson" />
          <Field name="current_streak" type="number" desc="Consecutive correct answers" />
        </div>

        <SubHead>AttemptLog</SubHead>
        <P>Immutable record of every problem attempt. Contains full forensic data including block selection sequence, timing, belief state before/after, and any misconception tags. This powers the Analytics dashboard.</P>
        <div className="space-y-0.5 mt-2">
          <Field name="student_email" type="string" desc="Who attempted it" required />
          <Field name="problem_id" type="string" desc="Which problem" required />
          <Field name="is_correct" type="boolean" desc="Did they complete the correct sequence" required />
          <Field name="selected_blocks" type="string[]" desc="Ordered block IDs the student selected" />
          <Field name="incorrect_blocks" type="string[]" desc="Blocks that triggered an error flash" />
          <Field name="time_to_first_block_ms" type="number" desc="Reaction time (problem shown → first block click)" />
          <Field name="time_to_completion_ms" type="number" desc="Total time to finish" />
          <Field name="belief_before" type="number[]" desc="HMM belief vector before this attempt" />
          <Field name="belief_after" type="number[]" desc="HMM belief vector after updating" />
          <Field name="state_before / state_after" type="string" desc="Dominant state label before and after" />
        </div>

        <SubHead>Misconception</SubHead>
        <P>Flagged learning errors. Currently populated when the system detects a pattern (e.g. selecting a distractor tagged with a specific error reason). Supports 9 typed misconceptions and includes remediation suggestions.</P>
        <div className="space-y-0.5 mt-2">
          <Field name="misconception_type" type="enum" desc="One of 9 types: sign_error_in_factors, incomplete_factoring, coefficient_only_factoring, etc." required />
          <Field name="description" type="string" desc="Human-readable description of what went wrong" />
          <Field name="remediation_suggested" type="string" desc="Suggested intervention" />
          <Field name="resolved" type="boolean" desc="Whether this misconception has been addressed (default false)" />
        </div>
      </Section>

      {/* HMM Engine */}
      <Section title="HMM Adaptive Engine (components/game/HMM.js)" icon={Brain} color="bg-rose-500/70">
        <P>The Hidden Markov Model is the intellectual core of AlgeBricks. It models student knowledge as a probability distribution over three hidden states, updated every time a student submits a problem.</P>

        <SubHead>Model Configuration</SubHead>
        <CodeBlock title="HMM_MODEL parameters">
{`states: ["learning", "practicing", "mastered"]

initial_distribution: [0.2, 0.6, 0.2]
  // New students start mostly in "practicing" state

transition_matrix:
  learning   → [0.75 stay, 0.25 → practicing, 0.0 → mastered]
  practicing → [0.0 ← learning, 0.80 stay, 0.20 → mastered]
  mastered   → [0.0, 0.0, 1.0]  ← absorbing state (no regression)

base_mastery: { learning: 0.35, practicing: 0.60, mastered: 0.90 }
  // Probability of correct answer given each state

difficulty_multiplier: { easy: 1.0, moderate: 0.9, hard: 0.75 }
  // Hard problems reduce expected P(correct) — more signal from errors

inference_params:
  slip:  0.10   // P(wrong | actually mastered)
  guess: 0.25   // P(correct | doesn't know)
  mastery_threshold:      0.65   // Belief needed to "advance"
  consecutive_required:   2      // Confirmations before state change
  transition_ambiguity_cap: 0.5  // Below this → "transition" state`}
        </CodeBlock>

        <SubHead>updateBelief(belief, observation, difficulty, slip, guess, model)</SubHead>
        <P>Core Bayesian update. For each state, computes the likelihood of the observation (correct/incorrect) given that state, then multiplies by the prior (previous belief × transition probability). Finally normalizes to sum to 1.</P>
        <CodeBlock title="Algorithm walkthrough">
{`For each state i:
  1. Compute P(correct | state_i) = base_mastery[i] × (1-slip) + (1-base_mastery[i]) × guess
  2. Scale by difficulty_multiplier
  3. emission = P(correct|state_i) if observation="correct", else 1 - P(correct|state_i)
  4. prior_i = Σ_j belief[j] × transition_matrix[j][i]
  5. new_belief[i] = emission × prior_i

Normalize: divide by sum so beliefs sum to 1.0`}
        </CodeBlock>

        <SubHead>getDominantState(belief, ambiguityCap)</SubHead>
        <P>Returns the state with the highest belief probability. If the maximum belief is below the <code className="text-[#90B494] text-xs">ambiguityCap</code> (0.5), returns <code className="text-[#90B494] text-xs">"transition"</code> — meaning the model isn't confident enough to commit to any state.</P>

        <SubHead>recommendDifficulty(state)</SubHead>
        <P>Maps dominant state to a difficulty tier: <code className="text-[#90B494] text-xs">learning → easy</code>, <code className="text-[#90B494] text-xs">practicing → moderate</code>, <code className="text-[#90B494] text-xs">mastered → hard</code>, <code className="text-[#90B494] text-xs">transition → null (no change)</code>.</P>

        <SubHead>shouldAdvanceDifficulty / shouldRegressDifficulty</SubHead>
        <P>Guards against premature difficulty changes. Advance requires <code className="text-[#90B494] text-xs">mastery_confidence ≥ 0.65</code> AND <code className="text-[#90B494] text-xs">consecutive_at_state ≥ 2</code>. Regress triggers when <code className="text-[#90B494] text-xs">mastery_confidence &lt; 0.4</code> AND student has been struggling for 2 consecutive updates.</P>

        <SubHead>getStateMessage(oldState, newState)</SubHead>
        <P>Generates motivational UI messages on state transitions (e.g., "You're getting the hang of this — let's try something more challenging!" when moving from learning → practicing).</P>

        <SubHead>initializeProgress(studentEmail, lessonId)</SubHead>
        <P>Creates a fresh StudentProgress record with the model's initial distribution, starting at "easy" difficulty, "practicing" state, with mastery_confidence of 0.6.</P>
      </Section>

      {/* Game Loop */}
      <Section title="Game Loop — pages/Play.jsx" icon={Zap} color="bg-amber-500/70">
        <P>The Play page orchestrates the entire game session. It connects data fetching, HMM logic, and UI rendering into a single coherent loop.</P>

        <SubHead>Data Loading (React Query)</SubHead>
        <CodeBlock>
{`useQuery["lessons"]      → Lesson.list("lesson_path_id", 50)
useQuery["all-problems"] → Problem.list("difficulty_rank", 200)
useQuery["blocks"]       → Block.list("position", 500)
useQuery["progress"]     → StudentProgress.filter({ student_email })`}
        </CodeBlock>

        <SubHead>Problem Selection Logic</SubHead>
        <P>After loading, the Play page derives the active problem pool dynamically. It reads the current lesson's <code className="text-[#90B494] text-xs">problems_by_difficulty[currentDifficulty]</code> array, then filters all loaded problems to match those IDs. This means difficulty changes take effect immediately on the next problem.</P>
        <CodeBlock>
{`getLessonProblems():
  difficulty = currentProgress?.current_difficulty || "easy"
  problemIds = currentLesson.problems_by_difficulty[difficulty] || []
  return allProblems.filter(p => problemIds.includes(p.problem_id))`}
        </CodeBlock>

        <SubHead>handleSubmit(result) — The Core Loop</SubHead>
        <P>Called by BlockEngine when a student completes a problem sequence. Executes synchronously in this order:</P>
        <CodeBlock>
{`1. Load or initialize StudentProgress for this lesson
2. Call updateBelief() → new HMM belief vector
3. Call getDominantState() → new dominant state label
4. Update session stats (correct count, total time)
5. Write AttemptLog record (forensic history)
6. Build new progress snapshot:
   - Update hmm_belief, dominant_state
   - Call recommendDifficulty() for new tier
   - Increment problems_attempted, streak
   - Append to recent_observations (keep last 5)
7. Write/update StudentProgress record
8. Generate and display state transition message`}
        </CodeBlock>

        <SubHead>handleNext()</SubHead>
        <P>Advances <code className="text-[#90B494] text-xs">currentProblemIndex</code>. If the student has completed all problems in the current difficulty pool, triggers the Lesson Complete screen.</P>

        <SubHead>Render States</SubHead>
        <CodeBlock>
{`Loading:          → Skeleton placeholders
No problems found: → Empty state with navigation hint
Lesson complete:   → LessonComplete component
Active game:       → Header + Progress Bar + BlockEngine`}
        </CodeBlock>
      </Section>

      {/* BlockEngine */}
      <Section title="BlockEngine Component" icon={Blocks} color="bg-[#90B494]/70">
        <P>The primary interaction surface. Renders the problem expression, tracks sequential block selection, and provides step-by-step validation feedback.</P>

        <SubHead>Initialization</SubHead>
        <P>On <code className="text-[#90B494] text-xs">problem</code> prop change, it filters all loaded blocks to only those listed in <code className="text-[#90B494] text-xs">correct_block_ids</code> or <code className="text-[#90B494] text-xs">distractor_pool_ids</code>, then shuffles them randomly before display.</P>

        <SubHead>handleBlockClick(block)</SubHead>
        <P>Implements sequential validation — the student must click blocks in the exact order defined by <code className="text-[#90B494] text-xs">correct_block_ids</code>. Clicking the correct next block adds it to the solution area and removes it from the pool. Clicking a wrong block triggers a shake + red flash for 800ms, but does NOT penalize progress — the student can retry freely.</P>
        <CodeBlock>
{`nextExpectedId = correctSequence[selectedBlocks.length]
if (block.block_id === nextExpectedId):
  → add to selectedBlocks, remove from availableBlocks
  → if all blocks selected: call checkSolution()
else:
  → set incorrectBlock (triggers animation)
  → clear after 800ms timeout`}
        </CodeBlock>

        <SubHead>checkSolution(finalBlocks)</SubHead>
        <P>Since validation is step-by-step, by the time this is called the answer is already guaranteed correct. It computes timing metrics and calls <code className="text-[#90B494] text-xs">onSubmit()</code> to trigger the HMM update in Play.jsx.</P>

        <SubHead>Visual Feedback System</SubHead>
        <CodeBlock>
{`Selected blocks:   Green card + checkmark + step number
Incorrect click:   Red flash + AlertCircle icon + shake animation
Correct result:    Full green celebration card + correct_answer text
Progress bar:      selectedBlocks.length / totalSteps × 100%`}
        </CodeBlock>

        <SubHead>Props</SubHead>
        <div className="space-y-0.5 mt-2">
          <Field name="problem" type="object" desc="Current Problem record from database" />
          <Field name="blocks" type="object[]" desc="ALL loaded Block records (engine filters internally)" />
          <Field name="onSubmit" type="function" desc="Callback with { is_correct, selected_blocks, timing data }" />
          <Field name="onNext" type="function" desc="Called when student clicks 'Next Problem'" />
          <Field name="isLast" type="boolean" desc="Controls button label: 'Complete Lesson' vs 'Next Problem'" />
          <Field name="currentDifficulty" type="string" desc="Shown as difficulty badge on the problem header" />
        </div>
      </Section>

      {/* Pages */}
      <Section title="Pages Breakdown" icon={GitBranch} color="bg-violet-500/70">
        <SubHead>Lessons (pages/Lessons.jsx)</SubHead>
        <P>Curriculum browser. Groups lessons by subtopic using <code className="text-[#90B494] text-xs">{"[...new Set(lessons.map(l => l.subtopic))]"}</code>. Shows student mastery per subtopic via MasteryGauge, problem counts, and lesson completion state. All lessons link to Play page.</P>

        <SubHead>Progress (pages/Progress.jsx)</SubHead>
        <P>Personal student dashboard. Fetches StudentProgress, AttemptLog, and Misconception filtered by authenticated user email. Shows 4 KPI cards (accuracy, best streak, avg time, problems solved), subtopic mastery gauges, a Recharts bar chart of correct vs attempted, active misconceptions list, and GateProgress for each subtopic.</P>

        <SubHead>Analytics (pages/Analytics.jsx)</SubHead>
        <P>Admin/system-wide view. Fetches ALL attempts, ALL misconceptions, ALL progress (not filtered by user). Shows total attempts, unique student count, misconception count, overall accuracy. Four charts: difficulty performance (grouped bar), mastery distribution (pie), top misconceptions (horizontal bar), error type distribution (animated progress bars).</P>

        <SubHead>Layout (Layout.js)</SubHead>
        <P>App shell that wraps every page. Desktop: fixed 64px sidebar with animated active indicator (Framer Motion <code className="text-[#90B494] text-xs">layoutId="activeTab"</code>). Mobile: top header bar + slide-in sidebar drawer with backdrop overlay. Color palette: #3C3E53 background, #90B494 accent, #BFC8AD text, #718F94 borders.</P>
      </Section>

      {/* Components */}
      <Section title="Supporting Components" icon={Package} color="bg-teal-500/70">
        <SubHead>MasteryGauge</SubHead>
        <P>Renders mastery state as an animated progress bar. Accepts <code className="text-[#90B494] text-xs">state: "low" | "medium" | "high"</code> and <code className="text-[#90B494] text-xs">compact: boolean</code>. Compact mode shows just a colored dot + label. Full mode shows animated fill bar with label. Colors: low=rose, medium=amber, high=emerald.</P>

        <SubHead>LessonComplete</SubHead>
        <P>End-of-lesson summary card. Receives session stats (correct, total, totalTime, hintsUsed). Computes accuracy and average time. Shows mastery gauge, action buttons to replay or continue. Accepts <code className="text-[#90B494] text-xs">onReplay</code> and <code className="text-[#90B494] text-xs">onContinue</code> callbacks.</P>

        <SubHead>GateProgress</SubHead>
        <P>Displays progress toward unlocking the "gate" — a game mechanic requiring a minimum number of medium and hard problems solved before advancing. Visual progress bars for each tier with animated lock/unlock icon.</P>

        <SubHead>HintPanel</SubHead>
        <P>Progressive hint disclosure. Starts collapsed. Each click reveals the next hint in sequence. Tracks <code className="text-[#90B494] text-xs">revealedCount</code> state and calls <code className="text-[#90B494] text-xs">onHintUsed()</code> callback for logging. Prevents revealing hints that haven't been unlocked yet.</P>

        <SubHead>BrickBlock</SubHead>
        <P>Visual Lego-brick styled button with 5 color types (x2, x, constant, negative, operator). Uses Framer Motion for hover/tap/snap animations. CSS classes <code className="text-[#90B494] text-xs">brick-snap</code> and <code className="text-[#90B494] text-xs">brick-shake</code> defined in globals.css.</P>

        <SubHead>BrickSlot</SubHead>
        <P>Drop zone component. Animated border changes based on <code className="text-[#90B494] text-xs">isCorrect</code> (green), <code className="text-[#90B494] text-xs">isActive</code> (blue), or empty (white/5 opacity). Pulsing animation when active and empty.</P>

        <SubHead>FactoringEngine</SubHead>
        <P>Alternative drag-based interaction engine (vs. BlockEngine's click-based approach). Parses factor strings into coefficient/constant pairs. Manages two factor "slots" the student builds independently. Currently available but BlockEngine is the primary interface.</P>
      </Section>

      {/* Styling */}
      <Section title="Styling & Theme System" icon={Palette} color="bg-pink-500/70">
        <SubHead>Color Palette</SubHead>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {[
            { hex: "#DBCFB0", name: "Warm Sand" },
            { hex: "#BFC8AD", name: "Sage" },
            { hex: "#90B494", name: "Mint Green" },
            { hex: "#718F94", name: "Slate Teal" },
            { hex: "#3C3E53", name: "Navy Slate" },
          ].map(c => (
            <div key={c.hex} className="text-center">
              <div className="w-full h-12 rounded-lg border border-white/10" style={{ background: c.hex }} />
              <p className="text-[10px] text-[#BFC8AD]/50 mt-1 font-mono">{c.hex}</p>
              <p className="text-[10px] text-[#BFC8AD]/40">{c.name}</p>
            </div>
          ))}
        </div>

        <SubHead>CSS Variables (globals.css dark mode)</SubHead>
        <CodeBlock>
{`--background:  235 16% 29%  → #3C3E53 navy slate
--card:        235 16% 34%  → slightly lighter card bg
--primary:     133 15% 63%  → #90B494 mint green
--secondary:   186 13% 52%  → #718F94 slate teal
--foreground:  60 20% 85%   → #BFC8AD/DBCFB0 range
--muted:       235 16% 39%  → subtle muted backgrounds
--border:      186 13% 52%  → #718F94 borders`}
        </CodeBlock>

        <SubHead>Custom Animations (globals.css)</SubHead>
        <CodeBlock>
{`.brick-snap   → scale bounce 0.3s (correct block placed)
.brick-shake  → horizontal shake 0.5s (wrong answer)
.brick-glow   → pulsing indigo box-shadow (active state)
.math-font    → KaTeX_Main serif for problem expressions`}
        </CodeBlock>
      </Section>

      {/* State Flow */}
      <Section title="Full State Flow Diagram" icon={Target} color="bg-indigo-500/70">
        <CodeBlock title="Student plays one problem — complete state flow">
{`Student opens Play page
│
├─ useQuery fetches: Lessons, Problems, Blocks, StudentProgress
│
├─ currentLesson = lessons[0] (first lesson, or URL-specified)
│
├─ getLessonProblems():
│    current_difficulty = StudentProgress.current_difficulty (or "easy")
│    problemIds = lesson.problems_by_difficulty[current_difficulty]
│    lessonProblems = allProblems.filter(id in problemIds)
│
├─ BlockEngine renders:
│    availableBlocks = shuffle(correct_block_ids + distractor_pool_ids)
│    Progress: 0 / totalSteps
│
Student clicks blocks...
│
├─ Correct click: block moves to solution area
├─ Wrong click: flash red, shake, stay in pool
│
├─ All correct blocks placed → checkSolution() called
│
handleSubmit(result) in Play.jsx:
│
├─ Load current StudentProgress (or initializeProgress)
├─ updateBelief(oldBelief, "correct", difficulty, slip, guess)
│    → Bayesian update → new 3D belief vector
├─ getDominantState(newBelief) → "learning" | "practicing" | "mastered" | "transition"
├─ recommendDifficulty(newState) → "easy" | "moderate" | "hard" | null
├─ Write AttemptLog (immutable record)
├─ Update StudentProgress:
│    hmm_belief, dominant_state, current_difficulty,
│    consecutive_at_state, mastery_confidence,
│    recent_observations (sliding window, last 5)
├─ getStateMessage() → motivational message if state changed
│
Student clicks "Next Problem"
│
├─ currentProblemIndex++
├─ If index >= lessonProblems.length → setLessonComplete(true)
│
LessonComplete renders with session stats
├─ onReplay → reset index, stats
└─ onContinue → reset (next lesson selection TBD)`}
        </CodeBlock>
      </Section>

      {/* SDK Usage */}
      <Section title="Base44 SDK Usage" icon={Code2} color="bg-cyan-500/70">
        <P>All backend communication uses the pre-initialized Base44 SDK from <code className="text-[#90B494] text-xs">@/api/base44Client</code>. No REST calls, no custom endpoints.</P>
        <CodeBlock title="SDK patterns used in the app">
{`import { base44 } from "@/api/base44Client";

// Auth
base44.auth.me()                          // get current user
base44.auth.updateMe(data)               // update user profile
base44.auth.logout(redirectUrl)          // logout

// Entity CRUD
base44.entities.Lesson.list("lesson_path_id", 50)
base44.entities.Problem.list("difficulty_rank", 200)
base44.entities.Block.list("position", 500)
base44.entities.StudentProgress.filter({ student_email: user.email })
base44.entities.AttemptLog.filter({ student_email }, "-created_date", 100)
base44.entities.Misconception.filter({ student_email })

// Mutations
base44.entities.AttemptLog.create(data)
base44.entities.StudentProgress.create(data)
base44.entities.StudentProgress.update(id, data)

// All queries wrapped in TanStack Query (useQuery / useMutation)
// for caching, deduplication, and invalidation`}
        </CodeBlock>
      </Section>

      {/* Known Limitations */}
      <Section title="Known Limitations & Future Work" icon={Shield} color="bg-orange-500/70">
        <SubHead>Current Limitations</SubHead>
        <P>• <strong>Lesson navigation is fixed</strong> — Play always loads the first lesson. Lesson switching from the Lessons page is not yet wired (all lesson links route to Play but don't pass a lesson ID via URL params).</P>
        <P>• <strong>GateProgress is not auto-populated</strong> — The gate_progress field on StudentProgress must be computed from AttemptLog data; this aggregation is not yet implemented.</P>
        <P>• <strong>Misconceptions not auto-detected</strong> — The Misconception entity schema exists and is displayed, but automatic detection logic (comparing selected distractors to their distractor_reason tags) is not yet written.</P>
        <P>• <strong>mastery_state vs dominant_state</strong> — Some components reference <code className="text-[#90B494] text-xs">p.mastery_state</code> (old field name) while the schema uses <code className="text-[#90B494] text-xs">dominant_state</code>. MasteryGauge may show "low" until this is reconciled.</P>
        <P>• <strong>FactoringEngine unused</strong> — The drag-based factoring engine component exists but is not integrated into any page flow.</P>

        <SubHead>Recommended Next Steps</SubHead>
        <P>1. Pass <code className="text-[#90B494] text-xs">lessonId</code> as URL param from Lessons → Play and use it to set <code className="text-[#90B494] text-xs">currentLesson</code> directly.</P>
        <P>2. Implement automatic misconception detection by cross-referencing selected distractors with their <code className="text-[#90B494] text-xs">distractor_reason</code> field.</P>
        <P>3. Build a lesson selector UI within the Play page header.</P>
        <P>4. Add a teacher/admin role gate on the Analytics page.</P>
        <P>5. Persist hint usage in AttemptLog (currently always logged as 0).</P>
      </Section>

      <div className="text-center py-6">
        <p className="text-xs text-[#BFC8AD]/30 font-mono">AlgeBricks · Built on Base44 · React + TanStack Query + Framer Motion</p>
      </div>

    </div>
  );
}
