import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { SPEED_DELAYS } from '@/constants/algorithms'

// Build KMP failure function
const buildFailure = (pattern) => {
  const m = pattern.length
  const lps = Array(m).fill(0)
  let len = 0, i = 1
  while (i < m) {
    if (pattern[i] === pattern[len]) { lps[i++] = ++len }
    else if (len) { len = lps[len - 1] }
    else { lps[i++] = 0 }
  }
  return lps
}

// Generate KMP steps
const kmpSteps = (text, pattern) => {
  const steps = []
  const lps = buildFailure(pattern)
  const n = text.length, m = pattern.length
  let i = 0, j = 0
  const matches = []

  steps.push({ i, j, lps, matches: [], textHL: [], patHL: [], desc: `Starting KMP. LPS table built for pattern "${pattern}"` })

  while (i < n) {
    steps.push({ i, j, lps, matches: [...matches], textHL: [i], patHL: [j], desc: `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'` })
    if (text[i] === pattern[j]) {
      i++; j++
      if (j === m) {
        const start = i - j
        matches.push(start)
        steps.push({ i, j, lps, matches: [...matches], textHL: Array.from({length: m}, (_, k) => start + k), patHL: [], desc: `✓ Pattern found at index ${start}!` })
        j = lps[j - 1]
      }
    } else {
      if (j) {
        steps.push({ i, j, lps, matches: [...matches], textHL: [i], patHL: [j], desc: `Mismatch! Using LPS: j = lps[${j-1}] = ${lps[j-1]}` })
        j = lps[j - 1]
      } else {
        steps.push({ i, j, lps, matches: [...matches], textHL: [i], patHL: [], desc: `Mismatch at text[${i}]. Move i forward` })
        i++
      }
    }
  }
  steps.push({ i, j, lps, matches: [...matches], textHL: [], patHL: [], desc: `Done! Found ${matches.length} match(es) at: [${matches.join(', ')}]` })
  return steps
}

export default function StringAlgoVisualizer() {
  const [text, setText] = useState('AABAACAADAABAABA')
  const [pattern, setPattern] = useState('AABA')
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(4)
  const timerRef = useRef(null)
  const isPlayRef = useRef(false)
  const stepRef = useRef(-1)
  const stepsRef = useRef([])

  const reset = () => {
    clearTimeout(timerRef.current); isPlayRef.current = false
    setSteps([]); setStepIdx(-1); setIsPlaying(false)
    stepsRef.current = []; stepRef.current = -1
  }

  const play = () => {
    let st = stepsRef.current
    if (!st.length) {
      st = kmpSteps(text.toUpperCase(), pattern.toUpperCase())
      stepsRef.current = st; setSteps(st)
    }
    let idx = stepRef.current >= st.length - 1 ? -1 : stepRef.current
    isPlayRef.current = true; setIsPlaying(true)
    const advance = () => {
      if (!isPlayRef.current) return
      idx++
      if (idx >= st.length) { isPlayRef.current = false; setIsPlaying(false); return }
      stepRef.current = idx; setStepIdx(idx)
      timerRef.current = setTimeout(advance, SPEED_DELAYS[speed] || 500)
    }
    advance()
  }

  const pause = () => { clearTimeout(timerRef.current); isPlayRef.current = false; setIsPlaying(false) }

  const stepFwd = () => {
    pause()
    let st = stepsRef.current
    if (!st.length) { st = kmpSteps(text.toUpperCase(), pattern.toUpperCase()); stepsRef.current = st; setSteps(st) }
    const next = Math.min(stepRef.current + 1, st.length - 1)
    stepRef.current = next; setStepIdx(next)
  }

  const current = steps[stepIdx]
  const lps = current?.lps || (pattern ? buildFailure(pattern.toUpperCase()) : [])

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Algorithm Visualizer</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">KMP String Matching</h1>
        <div className="flex gap-2 mt-2">
          <span className="complexity-best">Time: O(n+m)</span>
          <span className="complexity-space">Space: O(m)</span>
        </div>
      </div>

      {/* Inputs */}
      <div className="glass-card p-4 border border-white/5 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Text</label>
            <input value={text} onChange={e => { setText(e.target.value.toUpperCase()); reset() }}
              className="input-field font-mono uppercase" maxLength={30} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Pattern</label>
            <input value={pattern} onChange={e => { setPattern(e.target.value.toUpperCase()); reset() }}
              className="input-field font-mono uppercase" maxLength={10} />
          </div>
        </div>
      </div>

      {/* Text visualization */}
      <div className="viz-container p-6 space-y-6" style={{ minHeight: '220px' }}>
        {/* Text */}
        <div>
          <p className="text-xs text-slate-500 font-mono mb-2">TEXT</p>
          <div className="flex flex-wrap gap-1">
            {text.toUpperCase().split('').map((c, i) => {
              const isMatch = current?.matches?.some(m => i >= m && i < m + pattern.length)
              const isActive = current?.textHL?.includes(i)
              const isI = current?.i === i
              return (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className={`w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-sm border-2 transition-all duration-200
                    ${isMatch ? 'border-accent-green bg-accent-green/20 text-accent-green'
                              : isActive ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                              : 'border-surface-500 bg-surface-700 text-white'}`}
                    style={{ boxShadow: isActive ? '0 0 8px #00e5ff60' : isMatch ? '0 0 8px #00ff8860' : 'none' }}>
                    {c}
                  </div>
                  <span className="text-xs text-slate-600 font-mono">{i}</span>
                  {isI && <div className="w-2 h-2 rounded-full bg-primary-400" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Pattern with alignment */}
        {current && (
          <div>
            <p className="text-xs text-slate-500 font-mono mb-2">PATTERN (j={current.j})</p>
            <div className="flex gap-1" style={{ marginLeft: `${(current.i - current.j) * 40}px` }}>
              {pattern.toUpperCase().split('').map((c, j) => {
                const isActive = current?.patHL?.includes(j)
                const matched = j < current.j
                return (
                  <div key={j} className="flex flex-col items-center gap-0.5">
                    <div className={`w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-sm border-2 transition-all
                      ${isActive ? 'border-accent-yellow bg-accent-yellow/20 text-accent-yellow'
                                 : matched ? 'border-accent-green/50 bg-accent-green/10 text-accent-green'
                                           : 'border-surface-400 bg-surface-600 text-slate-400'}`}>
                      {c}
                    </div>
                    <span className="text-xs text-slate-600 font-mono">{j}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* LPS Failure Table */}
      <div className="glass-card p-4 border border-white/5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Failure Function (LPS Table)</p>
        <div className="flex flex-wrap gap-1">
          {pattern.toUpperCase().split('').map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-9 h-7 rounded text-xs font-mono font-bold flex items-center justify-center bg-surface-600 text-slate-300 border border-surface-400">{c}</div>
              <div className="w-9 h-7 rounded text-xs font-mono font-bold flex items-center justify-center bg-primary-500/10 text-primary-400 border border-primary-500/20">{lps[i] ?? 0}</div>
              <span className="text-xs text-slate-600">{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        {current?.desc && (
          <motion.div key={current.desc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`glass-card px-4 py-2.5 border ${current.desc.includes('✓') ? 'border-accent-green/30 bg-accent-green/5' : 'border-white/5'}`}>
            <p className="text-sm font-mono text-slate-300">{current.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="glass-card p-4 border border-white/5 flex flex-wrap items-center gap-3">
        <button onClick={reset} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={stepFwd} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all"><SkipForward className="w-4 h-4" /></button>
        <button onClick={isPlaying ? pause : play}
          className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${isPlaying ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30' : 'bg-sky-500 text-white hover:bg-sky-400'}`}>
          {isPlaying ? <><Pause className="w-4 h-4"/>Pause</> : <><Play className="w-4 h-4"/>Run KMP</>}
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-400 ml-auto">
          <span>Speed</span>
          <input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(+e.target.value)} className="slider w-24" />
        </div>
      </div>

      {current && steps.length > 0 && stepIdx === steps.length - 1 && (
        <div className="glass-card p-4 border border-accent-green/20 bg-accent-green/5">
          <p className="text-sm font-mono text-accent-green font-bold">
            Matches found: {current.matches?.length ?? 0} at positions: [{current.matches?.join(', ')}]
          </p>
        </div>
      )}
    </div>
  )
}
