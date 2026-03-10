// ComplexityBadges.jsx
export default function ComplexityBadges({ meta }) {
  if (!meta) return null
  return (
    <div className="flex flex-wrap gap-2">
      {meta.best  && <span className="complexity-best">Best: {meta.best}</span>}
      {meta.avg   && <span className="complexity-avg">Avg: {meta.avg}</span>}
      {meta.worst && <span className="complexity-worst">Worst: {meta.worst}</span>}
      {meta.space && <span className="complexity-space">Space: {meta.space}</span>}
      {meta.stable !== undefined && (
        <span className={`complexity-badge ${meta.stable ? 'bg-accent-green/20 text-accent-green' : 'bg-slate-700 text-slate-400'}`}>
          {meta.stable ? 'Stable' : 'Unstable'}
        </span>
      )}
    </div>
  )
}
