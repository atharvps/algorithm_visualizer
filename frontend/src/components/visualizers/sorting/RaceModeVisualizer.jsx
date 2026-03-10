import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { SORT_ALGORITHMS } from '@/utils/sortingAlgorithms'
import { generateArray } from '@/utils/arrayGenerator'
import { SPEED_DELAYS, ARRAY_GENERATOR_TYPES, BAR_COLORS } from '@/constants/algorithms'

const ALGO_LIST = Object.entries(SORT_ALGORITHMS).map(([id, v]) => ({ id, name: v.name }))

function RaceCanvas({ steps, stepIdx, label, color }) {
  const canvasRef = useRef(null)
  const current = steps[stepIdx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const arr = current?.array || (steps[0]?.array || [])
    const n = arr.length
    if (!n) return
    const maxVal = Math.max(...arr, 1)
    const barW = Math.max(2, (W - n) / n)

    arr.forEach((val, i) => {
      const x = i * (barW + 1)
      const h = Math.max(4, (val / maxVal) * (H - 8))
      const y = H - h
      let c = BAR_COLORS.default
      if (current) {
        if (current.sorted?.includes(i)) c = BAR_COLORS.sorted
        else if (current.pivot === i) c = BAR_COLORS.pivot
        else if (current.active?.includes(i)) c = color
        else if (current.comparing?.includes(i)) c = BAR_COLORS.compare
      }
      ctx.fillStyle = c
      ctx.fillRect(x, y, barW, h)
    })
  }, [steps, stepIdx, color])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    })
    ro.observe(canvas)
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    return () => ro.disconnect()
  }, [])

  const progress = steps.length > 0 ? ((stepIdx + 1) / steps.length) * 100 : 0
  const done = stepIdx >= steps.length - 1 && steps.length > 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color }}>{label}</span>
        {done && <span className="text-xs text-accent-green font-mono">✓ Done</span>}
      </div>
      <div className="viz-container" style={{ height: '180px' }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-100" style={{ width: `${progress}%`, backgroundColor: color }} />
      </div>
      {current && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { label: 'Comparisons', value: current.comparisons || 0 },
            { label: 'Swaps', value: current.swaps || 0 },
            { label: 'Step', value: `${Math.max(0, stepIdx + 1)} / ${steps.length}` },
          ].map(s => (
            <div key={s.label} className="glass-card px-2 py-1.5 border border-white/5">
              <div className="font-mono font-bold" style={{ color }}>{s.value}</div>
              <div className="text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RaceModeVisualizer() {
  const [algo1, setAlgo1] = useState('bubble-sort')
  const [algo2, setAlgo2] = useState('quick-sort')
  const [genType, setGenType] = useState('random')
  const [arraySize, setArraySize] = useState(50)
  const [speed, setSpeed] = useState(5)
  const [arr, setArr] = useState(() => generateArray('random', 50))
  const [steps1, setSteps1] = useState([])
  const [steps2, setSteps2] = useState([])
  const [idx1, setIdx1] = useState(-1)
  const [idx2, setIdx2] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [winner, setWinner] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [times, setTimes] = useState({ algo1: null, algo2: null })

  const timerRef = useRef(null)
  const isPlayRef = useRef(false)
  const idx1Ref = useRef(-1), idx2Ref = useRef(-1)
  const done1Ref = useRef(false), done2Ref = useRef(false)
  const steps1Ref = useRef([]), steps2Ref = useRef([])

  const reset = () => {
    clearTimeout(timerRef.current); isPlayRef.current = false
    const a = generateArray(genType, arraySize)
    setArr(a)
    setSteps1([]); setSteps2([])
    setIdx1(-1); setIdx2(-1)
    setIsPlaying(false); setWinner(null); setTimes({ algo1: null, algo2: null })
    idx1Ref.current = -1; idx2Ref.current = -1
    done1Ref.current = false; done2Ref.current = false
    steps1Ref.current = []; steps2Ref.current = []
  }

  const play = () => {
    const s1 = SORT_ALGORITHMS[algo1]?.fn([...arr]) || []
    const s2 = SORT_ALGORITHMS[algo2]?.fn([...arr]) || []
    steps1Ref.current = s1; steps2Ref.current = s2
    setSteps1(s1); setSteps2(s2)

    let i1 = -1, i2 = -1
    done1Ref.current = false; done2Ref.current = false
    isPlayRef.current = true; setIsPlaying(true)
    setWinner(null)
    const t0 = performance.now(); setStartTime(t0)

    const advance = () => {
      if (!isPlayRef.current) return
      const d1 = done1Ref.current, d2 = done2Ref.current

      if (!d1) {
        i1++
        if (i1 >= s1.length) {
          done1Ref.current = true
          const t = ((performance.now() - t0) / 1000).toFixed(2)
          setTimes(prev => ({ ...prev, algo1: t }))
          if (!winner && done2Ref.current) setWinner(SORT_ALGORITHMS[algo1]?.name)
          else if (!winner) setWinner(SORT_ALGORITHMS[algo1]?.name + ' (algo 1)')
        } else {
          idx1Ref.current = i1; setIdx1(i1)
        }
      }
      if (!d2) {
        i2++
        if (i2 >= s2.length) {
          done2Ref.current = true
          const t = ((performance.now() - t0) / 1000).toFixed(2)
          setTimes(prev => ({ ...prev, algo2: t }))
          if (!winner && done1Ref.current) setWinner(SORT_ALGORITHMS[algo2]?.name)
          else if (!winner) setWinner(SORT_ALGORITHMS[algo2]?.name + ' (algo 2)')
        } else {
          idx2Ref.current = i2; setIdx2(i2)
        }
      }

      if (done1Ref.current && done2Ref.current) {
        isPlayRef.current = false; setIsPlaying(false); return
      }
      timerRef.current = setTimeout(advance, SPEED_DELAYS[speed] || 200)
    }
    advance()
  }

  const pause = () => {
    clearTimeout(timerRef.current); isPlayRef.current = false; setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Algorithm Race Mode</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Side-by-Side Comparison</h1>
      </div>

      {winner && (
        <div className="glass-card p-4 border border-accent-yellow/30 bg-accent-yellow/5 text-center">
          <p className="text-accent-yellow font-display font-bold text-lg">🏆 {winner} finished first!</p>
          <div className="flex justify-center gap-6 mt-2 text-sm font-mono text-slate-400">
            {times.algo1 && <span>{SORT_ALGORITHMS[algo1]?.name}: {times.algo1}s</span>}
            {times.algo2 && <span>{SORT_ALGORITHMS[algo2]?.name}: {times.algo2}s</span>}
          </div>
        </div>
      )}

      {/* Canvases */}
      <div className="grid md:grid-cols-2 gap-4">
        <RaceCanvas steps={steps1} stepIdx={idx1} label={SORT_ALGORITHMS[algo1]?.name} color="#00e5ff" />
        <RaceCanvas steps={steps2} stepIdx={idx2} label={SORT_ALGORITHMS[algo2]?.name} color="#a855f7" />
      </div>

      {/* Controls */}
      <div className="glass-card p-4 border border-white/5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Algorithm 1</label>
            <select value={algo1} onChange={e => { setAlgo1(e.target.value); reset() }} disabled={isPlaying}
              className="input-field text-sm">
              {ALGO_LIST.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Algorithm 2</label>
            <select value={algo2} onChange={e => { setAlgo2(e.target.value); reset() }} disabled={isPlaying}
              className="input-field text-sm">
              {ALGO_LIST.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5"><span>Array Size</span><span className="text-primary-400 font-mono">{arraySize}</span></div>
            <input type="range" min="10" max="150" value={arraySize} onChange={e => { setArraySize(+e.target.value); reset() }} className="slider w-full" disabled={isPlaying} />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5"><span>Speed</span><span className="text-primary-400 font-mono">{speed}</span></div>
            <input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(+e.target.value)} className="slider w-full" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {ARRAY_GENERATOR_TYPES.map(t => (
              <button key={t.value} onClick={() => { setGenType(t.value); reset() }} disabled={isPlaying}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${genType === t.value ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-surface-600 text-slate-400 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <button onClick={reset} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all"><RotateCcw className="w-4 h-4" /></button>
            <button onClick={isPlaying ? pause : play}
              className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${isPlaying ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30' : 'bg-primary-500 text-surface-900 hover:bg-primary-400 shadow-glow-sm'}`}>
              {isPlaying ? <><Pause className="w-4 h-4"/>Pause</> : <><Play className="w-4 h-4"/>Race!</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
