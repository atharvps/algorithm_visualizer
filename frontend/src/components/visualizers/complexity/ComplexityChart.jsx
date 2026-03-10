import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { COMPLEXITY_CLASSES } from '@/constants/algorithms'

const generateData = (maxN = 20) =>
  Array.from({ length: maxN }, (_, i) => {
    const n = i + 1
    const entry = { n }
    COMPLEXITY_CLASSES.forEach(c => {
      const val = c.fn(n)
      entry[c.label] = isFinite(val) && val < 1e9 ? Math.round(val * 100) / 100 : null
    })
    return entry
  })

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card p-3 border border-white/10 text-xs font-mono shadow-card">
      <p className="text-slate-400 mb-1.5">n = {label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value?.toLocaleString()}</p>
      ))}
    </div>
  )
}

export default function ComplexityChart() {
  const [maxN, setMaxN] = useState(20)
  const [enabled, setEnabled] = useState(new Set(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)']))
  const data = generateData(maxN)

  const toggle = (label) => {
    setEnabled(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Complexity Analysis</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Big-O Growth Comparison</h1>
        <p className="text-slate-400 text-sm mt-1">Compare how algorithm time complexity scales with input size n</p>
      </div>

      {/* Controls */}
      <div className="glass-card p-4 border border-white/5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {COMPLEXITY_CLASSES.map(c => (
            <button key={c.label} onClick={() => toggle(c.label)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border-2 transition-all
                ${enabled.has(c.label) ? 'opacity-100' : 'opacity-30'}`}
              style={{ borderColor: c.color, backgroundColor: enabled.has(c.label) ? `${c.color}20` : 'transparent', color: c.color }}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400">Max n =</label>
          <input type="range" min="5" max="30" value={maxN} onChange={e => setMaxN(+e.target.value)} className="slider w-40" />
          <span className="text-primary-400 font-mono text-sm">{maxN}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="viz-container p-4" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1d2f47" />
            <XAxis dataKey="n" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} label={{ value: 'n (input size)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11, paddingTop: 16 }} />
            {COMPLEXITY_CLASSES.filter(c => enabled.has(c.label)).map(c => (
              <Line key={c.label} type="monotone" dataKey={c.label} stroke={c.color}
                strokeWidth={2} dot={false} connectNulls activeDot={{ r: 4, fill: c.color }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reference Table */}
      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <h3 className="font-display font-semibold text-white text-sm">Complexity Reference</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Complexity', 'Name', 'Example', 'n=10', 'n=100', 'n=1000'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { cls: 'O(1)',       name: 'Constant',     ex: 'Array access',        n10: '1',        n100: '1',         n1000: '1' },
                { cls: 'O(log n)',   name: 'Logarithmic',  ex: 'Binary search',       n10: '3',        n100: '7',         n1000: '10' },
                { cls: 'O(n)',       name: 'Linear',       ex: 'Linear search',       n10: '10',       n100: '100',       n1000: '1,000' },
                { cls: 'O(n log n)', name: 'Linearithmic', ex: 'Merge/Quick Sort',    n10: '33',       n100: '664',       n1000: '9,966' },
                { cls: 'O(n²)',      name: 'Quadratic',    ex: 'Bubble/Insert Sort',  n10: '100',      n100: '10,000',    n1000: '1,000,000' },
                { cls: 'O(2ⁿ)',      name: 'Exponential',  ex: 'Fibonacci (naive)',   n10: '1,024',    n100: '1.27e30',   n1000: '∞' },
              ].map((row, i) => {
                const color = COMPLEXITY_CLASSES.find(c => c.label === row.cls)?.color || '#94a3b8'
                return (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold" style={{ color }}>{row.cls}</td>
                    <td className="px-4 py-3 text-slate-300">{row.name}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{row.ex}</td>
                    <td className="px-4 py-3 font-mono text-slate-300 text-xs">{row.n10}</td>
                    <td className="px-4 py-3 font-mono text-slate-300 text-xs">{row.n100}</td>
                    <td className="px-4 py-3 font-mono text-slate-300 text-xs">{row.n1000}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
