import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'

// ─── Fibonacci DP ────────────────────────────────────────────────────────────
function FibDP() {
  const [n, setN] = useState(10)
  const [dp, setDp] = useState([])
  const [activeIdx, setActiveIdx] = useState(-1)
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true)
    const arr = Array(n + 1).fill(0)
    arr[0] = 0; arr[1] = 1
    setDp([...arr]); setActiveIdx(0)
    await new Promise(r => setTimeout(r, 300))
    setActiveIdx(1)
    await new Promise(r => setTimeout(r, 300))
    for (let i = 2; i <= n; i++) {
      arr[i] = arr[i-1] + arr[i-2]
      setDp([...arr]); setActiveIdx(i)
      await new Promise(r => setTimeout(r, 280))
    }
    setActiveIdx(-1); setRunning(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-400">n =</label>
        <input type="range" min="3" max="20" value={n} onChange={e => { setN(+e.target.value); setDp([]); setActiveIdx(-1) }} className="slider w-40" disabled={running} />
        <span className="text-primary-400 font-mono text-sm w-6">{n}</span>
      </div>
      <div className="viz-container p-6" style={{ minHeight: '120px' }}>
        {dp.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="border-collapse min-w-full text-center font-mono text-xs">
              <thead>
                <tr>{dp.map((_, i) => <th key={i} className="px-3 py-1 text-slate-500 border border-surface-600">i={i}</th>)}</tr>
              </thead>
              <tbody>
                <tr>{dp.map((v, i) => (
                  <td key={i} className={`px-3 py-2 border border-surface-600 font-bold transition-all duration-200
                    ${i === activeIdx ? 'bg-primary-500/30 text-primary-300' : i < activeIdx || activeIdx === -1 ? 'bg-surface-700 text-white' : 'bg-surface-800 text-slate-600'}`}>
                    {v}
                  </td>
                ))}</tr>
              </tbody>
            </table>
          </div>
        ) : <div className="text-slate-600 text-center py-6 font-mono">Press Run to fill DP table</div>}
      </div>
      <div className="flex gap-3">
        <button onClick={run} disabled={running} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Play className="w-4 h-4" />{running ? 'Running...' : 'Run Fibonacci DP'}
        </button>
        <button onClick={() => { setDp([]); setActiveIdx(-1) }} className="btn-secondary"><RotateCcw className="w-4 h-4" /></button>
      </div>
      {dp.length > 0 && activeIdx === -1 && <p className="text-sm font-mono text-accent-green">fib({n}) = {dp[n]}</p>}
    </div>
  )
}

// ─── 0/1 Knapsack ────────────────────────────────────────────────────────────
function KnapsackDP() {
  const weights = [2, 3, 4, 5]
  const values  = [3, 4, 5, 6]
  const W = 8
  const n = weights.length
  const [dp, setDp] = useState([])
  const [activeCell, setActiveCell] = useState(null)
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true)
    const table = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0))
    setDp(table.map(r => [...r]))
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= W; w++) {
        if (weights[i-1] <= w) {
          table[i][w] = Math.max(table[i-1][w], values[i-1] + table[i-1][w - weights[i-1]])
        } else {
          table[i][w] = table[i-1][w]
        }
        setDp(table.map(r => [...r])); setActiveCell([i, w])
        await new Promise(r => setTimeout(r, 100))
      }
    }
    setActiveCell(null); setRunning(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
        <span>Weights: [{weights.join(', ')}]</span>
        <span>Values: [{values.join(', ')}]</span>
        <span>Capacity: {W}</span>
      </div>
      <div className="viz-container p-4 overflow-auto" style={{ minHeight: '200px' }}>
        {dp.length > 0 ? (
          <table className="border-collapse text-center font-mono text-xs min-w-full">
            <thead>
              <tr>
                <th className="px-2 py-1 text-slate-500 border border-surface-600">i\w</th>
                {Array.from({ length: W + 1 }, (_, w) => (
                  <th key={w} className="px-2 py-1 text-slate-500 border border-surface-600">{w}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <td className="px-2 py-1 border border-surface-600 text-slate-400 font-bold">
                    {i === 0 ? '∅' : `i${i}(w=${weights[i-1]})`}
                  </td>
                  {row.map((v, w) => {
                    const isActive = activeCell && activeCell[0] === i && activeCell[1] === w
                    const isMax = activeCell === null && i === n && w === W
                    return (
                      <td key={w} className={`px-2 py-1.5 border border-surface-600 font-bold transition-all duration-150
                        ${isMax ? 'bg-accent-green/30 text-accent-green'
                                : isActive ? 'bg-primary-500/30 text-primary-300' : v > 0 ? 'bg-surface-700 text-white' : 'text-slate-600'}`}>
                        {v}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="text-slate-600 text-center py-6 font-mono">Press Run to fill DP table</div>}
      </div>
      <div className="flex gap-3">
        <button onClick={run} disabled={running} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Play className="w-4 h-4" />{running ? 'Running...' : 'Run Knapsack'}
        </button>
        <button onClick={() => { setDp([]); setActiveCell(null) }} className="btn-secondary"><RotateCcw className="w-4 h-4" /></button>
      </div>
      {dp.length > 0 && activeCell === null && (
        <p className="text-sm font-mono text-accent-green">Max Value = {dp[n]?.[W]}</p>
      )}
    </div>
  )
}

// ─── LCS ─────────────────────────────────────────────────────────────────────
function LCSDP() {
  const [s1, setS1] = useState('ABCBDAB')
  const [s2, setS2] = useState('BDCAB')
  const [dp, setDp] = useState([])
  const [lcs, setLcs] = useState('')
  const [running, setRunning] = useState(false)
  const [activeCell, setActiveCell] = useState(null)

  const run = async () => {
    setRunning(true); setLcs('')
    const m = s1.length, k = s2.length
    const table = Array.from({ length: m + 1 }, () => Array(k + 1).fill(0))
    setDp(table.map(r => [...r]))

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= k; j++) {
        if (s1[i-1] === s2[j-1]) table[i][j] = table[i-1][j-1] + 1
        else table[i][j] = Math.max(table[i-1][j], table[i][j-1])
        setDp(table.map(r => [...r])); setActiveCell([i,j])
        await new Promise(r => setTimeout(r, 80))
      }
    }

    // Backtrack LCS
    let i = m, j = k, result = ''
    while (i > 0 && j > 0) {
      if (s1[i-1] === s2[j-1]) { result = s1[i-1] + result; i--; j-- }
      else if (table[i-1][j] > table[i][j-1]) i--
      else j--
    }
    setLcs(result); setActiveCell(null); setRunning(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">String 1</label>
          <input value={s1} onChange={e => { setS1(e.target.value.toUpperCase().slice(0,10)); setDp([]); setLcs('') }}
            className="input-field w-28 text-sm font-mono uppercase" maxLength={10} />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">String 2</label>
          <input value={s2} onChange={e => { setS2(e.target.value.toUpperCase().slice(0,10)); setDp([]); setLcs('') }}
            className="input-field w-28 text-sm font-mono uppercase" maxLength={10} />
        </div>
      </div>
      <div className="viz-container p-4 overflow-auto" style={{ minHeight: '200px' }}>
        {dp.length > 0 ? (
          <table className="border-collapse text-center font-mono text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1 border border-surface-600 text-slate-500"> </th>
                <th className="px-2 py-1 border border-surface-600 text-slate-500">ε</th>
                {s2.split('').map((c, j) => <th key={j} className="px-2 py-1 border border-surface-600 text-accent-yellow">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <td className="px-2 py-1 border border-surface-600 text-accent-yellow font-bold">{i === 0 ? 'ε' : s1[i-1]}</td>
                  {row.map((v, j) => {
                    const isActive = activeCell && activeCell[0] === i && activeCell[1] === j
                    return (
                      <td key={j} className={`px-2 py-1.5 border border-surface-600 font-bold transition-all duration-100
                        ${isActive ? 'bg-primary-500/30 text-primary-300' : v > 0 ? 'bg-surface-700 text-white' : 'text-slate-600'}`}>
                        {v}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="text-slate-600 text-center py-6 font-mono">Press Run to compute LCS</div>}
      </div>
      <div className="flex gap-3">
        <button onClick={run} disabled={running} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Play className="w-4 h-4" />{running ? 'Running...' : 'Run LCS'}
        </button>
        <button onClick={() => { setDp([]); setLcs('') }} className="btn-secondary"><RotateCcw className="w-4 h-4" /></button>
      </div>
      {lcs && <p className="text-sm font-mono text-accent-green">LCS = "{lcs}" (length {lcs.length})</p>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'fibonacci', label: 'Fibonacci', component: FibDP },
  { id: 'knapsack',  label: '0/1 Knapsack', component: KnapsackDP },
  { id: 'lcs',       label: 'LCS', component: LCSDP },
]

export default function DPVisualizer() {
  const [tab, setTab] = useState('fibonacci')
  const Active = TABS.find(t => t.id === tab)?.component || FibDP

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Algorithm Visualizer</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Dynamic Programming</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="complexity-worst">Most: O(n²) or O(nW)</span>
          <span className="complexity-space">Memoized Recursion</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${tab === t.id ? 'bg-accent-red/20 text-accent-red border border-accent-red/30'
                            : 'bg-surface-700 text-slate-400 hover:text-white border border-white/5'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Active />
      </motion.div>
    </div>
  )
}
