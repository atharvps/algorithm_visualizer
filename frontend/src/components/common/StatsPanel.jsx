export default function StatsPanel({ comparisons = 0, swaps = 0, step = 0, totalSteps = 0, extra = [] }) {
  const stats = [
    { label: 'Comparisons', value: comparisons, color: 'text-primary-400' },
    { label: 'Swaps', value: swaps, color: 'text-accent-yellow' },
    { label: 'Step', value: `${step} / ${totalSteps}`, color: 'text-accent-green' },
    ...extra,
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="glass-card px-4 py-3 border border-white/5 text-center">
          <div className={`font-display text-xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
