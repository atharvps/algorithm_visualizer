import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { generateSorted, generateRandom, sleep } from '@/utils/arrayGenerator'
import { BAR_COLORS, SPEED_DELAYS } from '@/constants/algorithms'
import ComplexityBadges from '@/components/common/ComplexityBadges'
import StatsPanel from '@/components/common/StatsPanel'

const ALGOS = {
  'linear-search': {
    name: 'Linear Search', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)',
    generate: (size) => generateRandom(size, 1, 99).sort((a,b)=>a-b),
  },
  'binary-search': {
    name: 'Binary Search', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)',
    generate: (size) => generateSorted(size, 1, 99),
  },
}

const generateSteps = (algoId, arr, target) => {
  const steps = []
  if (algoId === 'linear-search') {
    for (let i = 0; i < arr.length; i++) {
      steps.push({ array: [...arr], active: [i], found: arr[i] === target ? i : -1, low: -1, mid: -1, high: -1, comparisons: i + 1, desc: `Checking arr[${i}] = ${arr[i]}${arr[i] === target ? ' ✓ Found!' : ''}` })
      if (arr[i] === target) break
    }
  } else {
    let low = 0, high = arr.length - 1, comparisons = 0
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      comparisons++
      steps.push({ array: [...arr], active: [mid], found: arr[mid] === target ? mid : -1, low, mid, high, comparisons, desc: `low=${low}, mid=${mid}, high=${high} → arr[${mid}]=${arr[mid]}${arr[mid] === target ? ' ✓ Found!' : arr[mid] < target ? ' → search right' : ' → search left'}` })
      if (arr[mid] === target) break
      else if (arr[mid] < target) low = mid + 1
      else high = mid - 1
    }
    if (!steps.some(s => s.found >= 0)) {
      steps.push({ array: [...arr], active: [], found: -2, low, mid: -1, high, comparisons, desc: `Target ${target} not found in array` })
    }
  }
  return steps
}

export default function SearchingVisualizer() {
  const [algo, setAlgo] = useState('linear-search')
  const [size, setSize] = useState(30)
  const [speed, setSpeed] = useState(5)
  const [target, setTarget] = useState('')
  const [arr, setArr] = useState([])
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const timerRef = useRef(null)
  const isPlayRef = useRef(false)
  const stepRef = useRef(-1)
  const stepsRef = useRef([])

  useEffect(() => { reset() }, [algo, size])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    isPlayRef.current = false
    const newArr = ALGOS[algo].generate(size)
    setArr(newArr)
    setSteps([])
    setStepIdx(-1)
    setCurrentStep(null)
    setIsPlaying(false)
    stepsRef.current = []
    stepRef.current = -1
  }, [algo, size])

  const getTarget = () => {
    const t = parseInt(target)
    if (!isNaN(t)) return t
    const a = ALGOS[algo].generate(size)
    setArr(a)
    return a[Math.floor(Math.random() * a.length)]
  }

  const play = () => {
    const t = getTarget()
    let st = stepsRef.current
    if (!st.length) {
      st = generateSteps(algo, arr, t)
      stepsRef.current = st
      setSteps(st)
    }
    let idx = stepRef.current >= st.length - 1 ? -1 : stepRef.current
    isPlayRef.current = true
    setIsPlaying(true)

    const advance = () => {
      if (!isPlayRef.current) return
      idx++
      if (idx >= st.length) { isPlayRef.current = false; setIsPlaying(false); return }
      stepRef.current = idx
      setStepIdx(idx)
      setCurrentStep(st[idx])
      timerRef.current = setTimeout(advance, SPEED_DELAYS[speed] || 300)
    }
    advance()
  }

  const pause = () => {
    clearTimeout(timerRef.current)
    isPlayRef.current = false
    setIsPlaying(false)
  }

  const stepFwd = () => {
    pause()
    const t = getTarget()
    let st = stepsRef.current
    if (!st.length) {
      st = generateSteps(algo, arr, t)
      stepsRef.current = st
      setSteps(st)
    }
    const next = Math.min(stepRef.current + 1, st.length - 1)
    stepRef.current = next
    setStepIdx(next)
    setCurrentStep(st[next])
  }

  const displayArr = currentStep?.array || arr
  const maxVal = Math.max(...displayArr, 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="section-label">Algorithm Visualizer</p>
          <h1 className="font-display text-2xl font-bold text-white mt-1">Searching Algorithms</h1>
        </div>
        <ComplexityBadges meta={ALGOS[algo]} />
      </div>

      <div className="flex gap-2">
        {Object.entries(ALGOS).map(([id, info]) => (
          <button key={id} onClick={() => setAlgo(id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${algo === id ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                           : 'bg-surface-700 text-slate-400 hover:text-white border border-white/5'}`}>
            {info.name}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="viz-container p-4" style={{ minHeight: '280px' }}>
        <div className="flex items-end justify-center gap-0.5 h-56">
          {displayArr.map((val, i) => {
            const h = Math.max(8, (val / maxVal) * 100)
            let bg = '#1d2f47'
            if (currentStep) {
              if (currentStep.found === i) bg = BAR_COLORS.sorted
              else if (currentStep.active?.includes(i)) bg = BAR_COLORS.active
              else if (algo === 'binary-search' && currentStep.low !== -1) {
                const { low, high, mid } = currentStep
                if (i < low || i > high) bg = '#0d1524'
                else if (i === low || i === high) bg = '#263a57'
                else if (i === mid) bg = BAR_COLORS.compare
              }
            }
            return (
              <motion.div key={i} layout
                className="flex-1 max-w-[20px] rounded-t-sm transition-colors duration-200 relative"
                style={{ height: `${h}%`, backgroundColor: bg, boxShadow: currentStep?.found === i ? `0 0 8px ${BAR_COLORS.sorted}` : 'none' }}
              >
                {displayArr.length <= 25 && (
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 font-mono">{val}</span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Binary search range indicator */}
        {algo === 'binary-search' && currentStep && currentStep.low >= 0 && (
          <div className="mt-8 text-center text-xs font-mono text-slate-400 flex justify-center gap-6">
            <span className="text-accent-green">Low: {currentStep.low}</span>
            <span className="text-accent-yellow">Mid: {currentStep.mid}</span>
            <span className="text-accent-red">High: {currentStep.high}</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {currentStep?.desc && (
          <motion.div key={currentStep.desc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`glass-card px-4 py-2.5 border ${currentStep.found >= 0 ? 'border-accent-green/30 bg-accent-green/5' : currentStep.found === -2 ? 'border-accent-red/30 bg-accent-red/5' : 'border-white/5'}`}>
            <p className="text-sm font-mono text-slate-300">{currentStep.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="glass-card p-4 border border-white/5 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Target:</label>
            <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="auto"
              className="input-field w-20 text-sm py-1.5" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={reset} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all"><RotateCcw className="w-4 h-4" /></button>
            <button onClick={stepFwd} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all"><SkipForward className="w-4 h-4" /></button>
            <button onClick={isPlaying ? pause : play}
              className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${isPlaying ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30' : 'bg-accent-green text-surface-900 hover:bg-accent-green/90 shadow-sm'}`}>
              {isPlaying ? <><Pause className="w-4 h-4" />Pause</> : <><Play className="w-4 h-4" />Search</>}
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5"><span>Array Size</span><span className="text-accent-green font-mono">{size}</span></div>
            <input type="range" min="5" max="80" value={size} onChange={(e) => !isPlaying && setSize(+e.target.value)} className="slider w-full" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5"><span>Speed</span><span className="text-accent-green font-mono">{speed}</span></div>
            <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(+e.target.value)} className="slider w-full" />
          </div>
        </div>
      </div>

      {currentStep && (
        <StatsPanel
          comparisons={currentStep.comparisons}
          swaps={0}
          step={stepIdx + 1}
          totalSteps={steps.length}
          extra={[{ label: 'Result', value: currentStep.found >= 0 ? `Found at [${currentStep.found}]` : currentStep.found === -2 ? 'Not Found' : '...', color: currentStep.found >= 0 ? 'text-accent-green' : currentStep.found === -2 ? 'text-accent-red' : 'text-slate-400' }]}
        />
      )}
    </div>
  )
}
