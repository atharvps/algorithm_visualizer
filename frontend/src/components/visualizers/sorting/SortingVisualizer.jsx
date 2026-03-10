import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Settings, ChevronDown, Code2 } from 'lucide-react'
import { SORT_ALGORITHMS } from '@/utils/sortingAlgorithms'
import { generateArray, parseCustomArray } from '@/utils/arrayGenerator'
import { SPEED_DELAYS, ARRAY_GENERATOR_TYPES, BAR_COLORS } from '@/constants/algorithms'
import { CODE_SNIPPETS } from '@/constants/codeSnippets'
import CodePanel from '@/components/common/CodePanel'
import ComplexityBadges from '@/components/common/ComplexityBadges'
import StatsPanel from '@/components/common/StatsPanel'
import { ALGORITHM_CATEGORIES } from '@/constants/algorithms'

const ALGO_INFO = ALGORITHM_CATEGORIES.sorting.algorithms

export default function SortingVisualizer() {
  const [selectedAlgo, setSelectedAlgo] = useState('bubble-sort')
  const [arraySize, setArraySize]       = useState(40)
  const [speed, setSpeed]               = useState(5)
  const [genType, setGenType]           = useState('random')
  const [customInput, setCustomInput]   = useState('')
  const [showCustom, setShowCustom]     = useState(false)
  const [showCode, setShowCode]         = useState(true)
  const [codeLang, setCodeLang]         = useState('cpp')

  const [array, setArray]               = useState([])
  const [steps, setSteps]               = useState([])
  const [stepIdx, setStepIdx]           = useState(-1)
  const [isPlaying, setIsPlaying]       = useState(false)
  const [isFinished, setIsFinished]     = useState(false)
  const [currentStep, setCurrentStep]   = useState(null)

  const timerRef    = useRef(null)
  const stepsRef    = useRef([])
  const stepIdxRef  = useRef(-1)
  const isPlayingRef= useRef(false)

  const canvasRef = useRef(null)

  // Generate initial array
  useEffect(() => {
    resetAll()
  }, [selectedAlgo, arraySize, genType])

  const resetAll = useCallback(() => {
    clearTimer()
    const arr = generateArray(genType, arraySize)
    setArray(arr)
    setSteps([])
    setStepIdx(-1)
    setIsPlaying(false)
    setIsFinished(false)
    setCurrentStep(null)
    stepsRef.current = []
    stepIdxRef.current = -1
    isPlayingRef.current = false
  }, [genType, arraySize])

  // Draw on canvas
  useEffect(() => {
    drawCanvas()
  }, [currentStep, array])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    const displayArr = currentStep ? currentStep.array : array
    if (!displayArr.length) return

    const n = displayArr.length
    const maxVal = Math.max(...displayArr, 1)
    const barW = Math.max(2, (W - n * 1) / n)
    const gap = 1

    displayArr.forEach((val, i) => {
      const x = i * (barW + gap)
      const h = Math.max(4, (val / maxVal) * (H - 10))
      const y = H - h

      // Determine color
      let color = BAR_COLORS.default
      if (currentStep) {
        const { active, comparing, sorted, pivot } = currentStep
        if (sorted?.includes(i))       color = BAR_COLORS.sorted
        else if (pivot === i)          color = BAR_COLORS.pivot
        else if (active?.includes(i))  color = BAR_COLORS.active
        else if (comparing?.includes(i)) color = BAR_COLORS.compare
      }

      // Draw bar
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect?.(x, y, barW, h, [2, 2, 0, 0]) || ctx.rect(x, y, barW, h)
      ctx.fill()

      // Glow for active bars
      if (currentStep?.active?.includes(i) || currentStep?.pivot === i) {
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.fillRect(x, y, barW, h)
        ctx.shadowBlur = 0
      }

      // Value label for small arrays
      if (n <= 30 && barW > 14) {
        ctx.fillStyle = '#94a3b8'
        ctx.font = `${Math.min(10, barW * 0.7)}px JetBrains Mono`
        ctx.textAlign = 'center'
        ctx.fillText(val, x + barW / 2, H - 2)
      }
    })
  }, [currentStep, array])

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawCanvas()
    })
    observer.observe(canvas)
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    return () => observer.disconnect()
  }, [drawCanvas])

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }

  const computeSteps = () => {
    const algoFn = SORT_ALGORITHMS[selectedAlgo]?.fn
    if (!algoFn) return []
    return algoFn([...array])
  }

  const startPlay = () => {
    let stepsList = stepsRef.current
    if (!stepsList.length) {
      stepsList = computeSteps()
      stepsRef.current = stepsList
      setSteps(stepsList)
    }

    let idx = stepIdxRef.current
    if (idx >= stepsList.length - 1) {
      idx = -1
      stepIdxRef.current = -1
    }

    isPlayingRef.current = true
    setIsPlaying(true)

    const advance = () => {
      if (!isPlayingRef.current) return
      idx++
      if (idx >= stepsList.length) {
        isPlayingRef.current = false
        setIsPlaying(false)
        setIsFinished(true)
        return
      }
      stepIdxRef.current = idx
      setStepIdx(idx)
      setCurrentStep(stepsList[idx])
      timerRef.current = setTimeout(advance, SPEED_DELAYS[speed] || 200)
    }
    advance()
  }

  const pausePlay = () => {
    clearTimer()
    isPlayingRef.current = false
    setIsPlaying(false)
  }

  const stepForward = () => {
    pausePlay()
    let stepsList = stepsRef.current
    if (!stepsList.length) {
      stepsList = computeSteps()
      stepsRef.current = stepsList
      setSteps(stepsList)
    }
    const next = Math.min(stepIdxRef.current + 1, stepsList.length - 1)
    stepIdxRef.current = next
    setStepIdx(next)
    setCurrentStep(stepsList[next])
    if (next === stepsList.length - 1) setIsFinished(true)
  }

  const handleCustomInput = () => {
    const { arr, error } = parseCustomArray(customInput)
    if (error) { alert(error); return }
    clearTimer()
    setArray(arr)
    setArraySize(arr.length)
    setSteps([])
    setStepIdx(-1)
    setCurrentStep(null)
    setIsFinished(false)
    stepsRef.current = []
    stepIdxRef.current = -1
    setShowCustom(false)
  }

  const progress = steps.length > 0 ? ((stepIdx + 1) / steps.length) * 100 : 0
  const algoMeta = ALGO_INFO.find(a => a.id === selectedAlgo)
  const codeLines = CODE_SNIPPETS[selectedAlgo]?.[codeLang] || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="section-label">Algorithm Visualizer</p>
          <h1 className="font-display text-2xl font-bold text-white mt-1">Sorting Algorithms</h1>
        </div>
        {algoMeta && <ComplexityBadges meta={algoMeta} />}
      </div>

      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2">
        {ALGO_INFO.map((algo) => (
          <button key={algo.id} onClick={() => setSelectedAlgo(algo.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${selectedAlgo === algo.id
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-surface-700 text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
              }`}>
            {algo.name}
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid xl:grid-cols-3 gap-4">
        {/* Canvas */}
        <div className={`${showCode ? 'xl:col-span-2' : 'xl:col-span-3'} space-y-4`}>
          <div className="viz-container" style={{ height: '300px' }}>
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }} />
          </div>

          {/* Description */}
          <AnimatePresence mode="wait">
            {currentStep?.description && (
              <motion.div key={currentStep.description}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass-card px-4 py-2.5 border border-white/5">
                <p className="text-sm text-slate-300 font-mono">{currentStep.description}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="glass-card p-4 border border-white/5 space-y-4">
            {/* Playback */}
            <div className="flex items-center justify-center gap-3">
              <button onClick={resetAll} className="p-2.5 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 hover:text-white transition-all">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={() => { clearTimer(); setStepIdx(-1); setCurrentStep(null); setIsFinished(false); stepsRef.current = []; stepIdxRef.current = -1 }}
                className="p-2.5 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all">
                <SkipForward className="w-4 h-4 rotate-180" />
              </button>
              <button onClick={isPlaying ? pausePlay : startPlay}
                className={`px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all
                  ${isPlaying ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30 hover:bg-accent-yellow/30'
                              : 'bg-primary-500 text-surface-900 hover:bg-primary-400 shadow-glow-sm'}`}>
                {isPlaying ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> {isFinished ? 'Replay' : stepIdx >= 0 ? 'Resume' : 'Play'}</>}
              </button>
              <button onClick={stepForward}
                className="p-2.5 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 hover:text-white transition-all">
                <SkipForward className="w-4 h-4" />
              </button>
              <button onClick={() => setShowCode(!showCode)}
                className={`p-2.5 rounded-lg transition-all ${showCode ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-surface-600 text-slate-400 hover:text-white'}`}>
                <Code2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sliders */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Array Size</span><span className="text-primary-400 font-mono">{arraySize}</span>
                </div>
                <input type="range" min="5" max="150" value={arraySize}
                  onChange={(e) => !isPlaying && setArraySize(+e.target.value)}
                  className="slider w-full" disabled={isPlaying} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Speed</span>
                  <span className="text-primary-400 font-mono">
                    {speed <= 2 ? '0.5×' : speed <= 4 ? '1×' : speed <= 6 ? '1.5×' : speed <= 8 ? '3×' : '8×'}
                  </span>
                </div>
                <input type="range" min="1" max="10" value={speed}
                  onChange={(e) => setSpeed(+e.target.value)}
                  className="slider w-full" />
              </div>
            </div>

            {/* Generator + custom */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex gap-1.5 flex-wrap">
                {ARRAY_GENERATOR_TYPES.map((t) => (
                  <button key={t.value} onClick={() => !isPlaying && setGenType(t.value)} disabled={isPlaying}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all
                      ${genType === t.value ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-surface-600 text-slate-400 hover:text-white'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => !isPlaying && setShowCustom(!showCustom)}
                className="btn-ghost text-xs py-1 px-2 flex items-center gap-1">
                <Settings className="w-3 h-3" /> Custom
                <ChevronDown className={`w-3 h-3 transition-transform ${showCustom ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showCustom && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex gap-2">
                <input value={customInput} onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter numbers separated by commas: 5,3,8,1,9..."
                  className="input-field flex-1 text-sm" />
                <button onClick={handleCustomInput} className="btn-primary text-sm py-2 px-3 whitespace-nowrap">Apply</button>
              </motion.div>
            )}
          </div>

          {/* Stats */}
          {currentStep && (
            <StatsPanel
              comparisons={currentStep.comparisons}
              swaps={currentStep.swaps}
              step={stepIdx + 1}
              totalSteps={steps.length}
            />
          )}
        </div>

        {/* Code panel */}
        {showCode && (
          <div className="xl:col-span-1">
            <CodePanel
              lines={codeLines}
              language={codeLang}
              onLangChange={setCodeLang}
              activeLines={[]}
              algoName={SORT_ALGORITHMS[selectedAlgo]?.name}
            />
          </div>
        )}
      </div>
    </div>
  )
}
