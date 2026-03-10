import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { generateRandom } from '@/utils/arrayGenerator'
import { SPEED_DELAYS } from '@/constants/algorithms'

const ALGOS = {
  'max-sum': {
    name: 'Max Sum Subarray (K)',
    desc: 'Find contiguous subarray of size K with maximum sum',
    generate: (arr, k) => {
      const steps = []
      let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0)
      let maxSum = windowSum, maxStart = 0
      steps.push({ arr, start: 0, end: k-1, windowSum, maxSum, maxStart, desc: `Initial window [0..${k-1}] sum=${windowSum}` })
      for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k]
        const start = i - k + 1
        if (windowSum > maxSum) { maxSum = windowSum; maxStart = start }
        steps.push({ arr, start, end: i, windowSum, maxSum, maxStart, desc: `Window [${start}..${i}] sum=${windowSum}${windowSum === maxSum ? ' ← NEW MAX' : ''}` })
      }
      return steps
    }
  },
  'no-repeat': {
    name: 'Longest No-Repeat Substring',
    desc: 'Find longest substring without repeating characters',
    generate: (arr) => {
      const steps = []
      const str = arr.map(v => String.fromCharCode(65 + v % 26)).join('')
      const charMap = new Map()
      let left = 0, maxLen = 0, maxStart = 0
      for (let right = 0; right < str.length; right++) {
        const c = str[right]
        if (charMap.has(c) && charMap.get(c) >= left) {
          left = charMap.get(c) + 1
        }
        charMap.set(c, right)
        if (right - left + 1 > maxLen) { maxLen = right - left + 1; maxStart = left }
        steps.push({ arr, str, start: left, end: right, windowSum: right - left + 1, maxSum: maxLen, maxStart, desc: `Window "${str.slice(left, right+1)}" len=${right-left+1}${right-left+1 === maxLen ? ' ← MAX' : ''}` })
      }
      return steps
    }
  }
}

export default function SlidingWindowVisualizer() {
  const [algo, setAlgo] = useState('max-sum')
  const [k, setK] = useState(4)
  const [arr, setArr] = useState(() => generateRandom(14, 1, 50))
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
    const a = generateRandom(14, 1, 50)
    setArr(a); setSteps([]); setStepIdx(-1); setIsPlaying(false)
    stepsRef.current = []; stepRef.current = -1
  }

  const play = () => {
    let st = stepsRef.current
    if (!st.length) {
      st = ALGOS[algo].generate(arr, k)
      stepsRef.current = st; setSteps(st)
    }
    let idx = stepRef.current >= st.length - 1 ? -1 : stepRef.current
    isPlayRef.current = true; setIsPlaying(true)
    const advance = () => {
      if (!isPlayRef.current) return
      idx++
      if (idx >= st.length) { isPlayRef.current = false; setIsPlaying(false); return }
      stepRef.current = idx; setStepIdx(idx)
      timerRef.current = setTimeout(advance, SPEED_DELAYS[speed] || 400)
    }
    advance()
  }

  const pause = () => { clearTimeout(timerRef.current); isPlayRef.current = false; setIsPlaying(false) }

  const stepFwd = () => {
    pause()
    let st = stepsRef.current
    if (!st.length) { st = ALGOS[algo].generate(arr, k); stepsRef.current = st; setSteps(st) }
    const next = Math.min(stepRef.current + 1, st.length - 1)
    stepRef.current = next; setStepIdx(next)
  }

  const current = steps[stepIdx] || null

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Algorithm Visualizer</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Sliding Window</h1>
        <div className="flex gap-2 mt-2">
          <span className="complexity-best">Time: O(n)</span>
          <span className="complexity-space">Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(ALGOS).map(([id, info]) => (
          <button key={id} onClick={() => { setAlgo(id); setSteps([]); setStepIdx(-1); stepsRef.current = []; stepRef.current = -1 }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${algo === id ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                           : 'bg-surface-700 text-slate-400 hover:text-white border border-white/5'}`}>
            {info.name}
          </button>
        ))}
      </div>

      <p className="text-slate-400 text-sm">{ALGOS[algo].desc}</p>

      {/* Visualization */}
      <div className="viz-container p-6" style={{ minHeight: '200px' }}>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-1 min-w-max mx-auto justify-center" style={{ height: 140 }}>
            {arr.map((v, i) => {
              const inWindow = current && i >= current.start && i <= current.end
              const inMax = current && i >= current.maxStart && i <= current.maxStart + (current.maxSum > 0 ? current.maxSum - 1 : k - 1)
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <motion.div layout
                    className="w-9 rounded-t-sm flex items-end justify-center pb-1 text-xs font-mono font-bold transition-all duration-200"
                    style={{
                      height: Math.max(20, (v / 50) * 100) + 'px',
                      backgroundColor: inWindow ? '#00e5ff' : '#1d2f47',
                      boxShadow: inWindow ? '0 0 8px #00e5ff60' : 'none',
                      color: inWindow ? '#020409' : '#94a3b8',
                    }}>
                    {v}
                  </motion.div>
                  {/* Max window indicator */}
                  {current && inMax && (
                    <div className="w-9 h-1 bg-accent-green rounded" />
                  )}
                  <span className="text-xs text-slate-600 font-mono">{i}</span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary-500" />Current Window</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1 rounded bg-accent-green" />Max Window</div>
          </div>
        </div>

        {current && algo === 'no-repeat' && (
          <div className="mt-4 text-center font-mono text-sm text-slate-300">
            Window: "<span className="text-primary-400">{current.str?.slice(current.start, current.end + 1)}</span>" | Max: "<span className="text-accent-green">{current.str?.slice(current.maxStart, current.maxStart + current.maxSum)}</span>"
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {current?.desc && (
          <motion.div key={current.desc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card px-4 py-2.5 border border-sky-500/20">
            <p className="text-sm font-mono text-slate-300">{current.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card p-4 border border-white/5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={reset} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all"><RotateCcw className="w-4 h-4" /></button>
          <button onClick={stepFwd} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all"><SkipForward className="w-4 h-4" /></button>
          <button onClick={isPlaying ? pause : play}
            className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${isPlaying ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30' : 'bg-sky-500 text-white hover:bg-sky-400'}`}>
            {isPlaying ? <><Pause className="w-4 h-4"/>Pause</> : <><Play className="w-4 h-4"/>Play</>}
          </button>
          {algo === 'max-sum' && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>K =</span>
              <input type="range" min="2" max="7" value={k} onChange={e => { setK(+e.target.value); setSteps([]); setStepIdx(-1); stepsRef.current = []; stepRef.current = -1 }} className="slider w-24" disabled={isPlaying} />
              <span className="text-primary-400 font-mono w-4">{k}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-400 ml-auto">
            <span>Speed</span>
            <input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(+e.target.value)} className="slider w-24" />
          </div>
        </div>
      </div>

      {current && (
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Window Start', value: current.start, color: 'text-primary-400' },
            { label: 'Window End', value: current.end, color: 'text-primary-400' },
            { label: algo === 'max-sum' ? 'Max Sum' : 'Max Length', value: current.maxSum, color: 'text-accent-green' },
          ].map(s => (
            <div key={s.label} className="glass-card px-3 py-3 border border-white/5">
              <div className={`font-display text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
