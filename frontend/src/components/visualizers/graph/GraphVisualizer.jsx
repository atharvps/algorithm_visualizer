import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react'
import { SPEED_DELAYS } from '@/constants/algorithms'

// Default graph
const DEFAULT_NODES = [
  { id: 0, label: 'A', x: 200, y: 80 },
  { id: 1, label: 'B', x: 80,  y: 200 },
  { id: 2, label: 'C', x: 320, y: 200 },
  { id: 3, label: 'D', x: 80,  y: 320 },
  { id: 4, label: 'E', x: 200, y: 380 },
  { id: 5, label: 'F', x: 320, y: 320 },
]
const DEFAULT_EDGES = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 2 },
  { from: 1, to: 2, weight: 5 },
  { from: 1, to: 3, weight: 10 },
  { from: 2, to: 5, weight: 3 },
  { from: 3, to: 4, weight: 4 },
  { from: 4, to: 5, weight: 7 },
  { from: 2, to: 3, weight: 11 },
]

const ALGOS = ['BFS', 'DFS', 'Dijkstra', "Prim's MST", "Kruskal's MST"]

// ─── BFS ─────────────────────────────────────────────────────────────────────
const bfsSteps = (nodes, edges) => {
  const steps = []
  const adj = buildAdj(nodes, edges)
  const visited = new Set()
  const queue = [0]
  visited.add(0)

  while (queue.length) {
    const curr = queue.shift()
    steps.push({ visited: [...visited], active: curr, path: [], desc: `Visiting node ${nodes[curr]?.label}`, highlightEdges: [] })
    for (const { to } of (adj[curr] || [])) {
      if (!visited.has(to)) {
        visited.add(to)
        queue.push(to)
        steps.push({ visited: [...visited], active: to, path: [], desc: `Discovered node ${nodes[to]?.label} via ${nodes[curr]?.label}`, highlightEdges: [`${curr}-${to}`] })
      }
    }
  }
  return steps
}

// ─── DFS ─────────────────────────────────────────────────────────────────────
const dfsSteps = (nodes, edges) => {
  const steps = []
  const adj = buildAdj(nodes, edges)
  const visited = new Set()

  const dfs = (node) => {
    visited.add(node)
    steps.push({ visited: [...visited], active: node, path: [], desc: `DFS visiting ${nodes[node]?.label}`, highlightEdges: [] })
    for (const { to } of (adj[node] || [])) {
      if (!visited.has(to)) {
        steps.push({ visited: [...visited], active: to, path: [], desc: `Exploring edge ${nodes[node]?.label} → ${nodes[to]?.label}`, highlightEdges: [`${node}-${to}`] })
        dfs(to)
      }
    }
  }
  dfs(0)
  return steps
}

// ─── Dijkstra ────────────────────────────────────────────────────────────────
const dijkstraSteps = (nodes, edges) => {
  const steps = []
  const n = nodes.length
  const adj = buildAdj(nodes, edges, true)
  const dist = Array(n).fill(Infinity)
  const visited = new Set()
  dist[0] = 0

  for (let i = 0; i < n; i++) {
    let u = -1
    for (let v = 0; v < n; v++) {
      if (!visited.has(v) && (u === -1 || dist[v] < dist[u])) u = v
    }
    if (dist[u] === Infinity) break
    visited.add(u)
    steps.push({ visited: [...visited], active: u, dist: [...dist], path: [], desc: `Processing node ${nodes[u]?.label} (dist=${dist[u]})`, highlightEdges: [] })

    for (const { to, weight } of (adj[u] || [])) {
      if (dist[u] + weight < dist[to]) {
        dist[to] = dist[u] + weight
        steps.push({ visited: [...visited], active: to, dist: [...dist], path: [], desc: `Updated dist[${nodes[to]?.label}] = ${dist[to]}`, highlightEdges: [`${u}-${to}`] })
      }
    }
  }
  return steps
}

// ─── Prim's MST ──────────────────────────────────────────────────────────────
const primsSteps = (nodes, edges) => {
  const steps = []
  const n = nodes.length
  const adj = buildAdj(nodes, edges, true)
  const inMST = new Set([0])
  const mstEdges = []

  while (inMST.size < n) {
    let minEdge = null, minW = Infinity
    for (const u of inMST) {
      for (const { to, weight } of (adj[u] || [])) {
        if (!inMST.has(to) && weight < minW) {
          minW = weight; minEdge = { from: u, to }
        }
      }
    }
    if (!minEdge) break
    inMST.add(minEdge.to)
    mstEdges.push(`${minEdge.from}-${minEdge.to}`)
    steps.push({ visited: [...inMST], active: minEdge.to, path: [], desc: `Adding ${nodes[minEdge.from]?.label} → ${nodes[minEdge.to]?.label} (w=${minW}) to MST`, highlightEdges: [...mstEdges] })
  }
  return steps
}

// ─── Kruskal's MST ───────────────────────────────────────────────────────────
const kruskalsSteps = (nodes, edges) => {
  const steps = []
  const sorted = [...edges].sort((a, b) => a.weight - b.weight)
  const parent = nodes.map((_, i) => i)
  const mstEdges = []

  const find = (x) => parent[x] === x ? x : (parent[x] = find(parent[x]))
  const union = (x, y) => { parent[find(x)] = find(y) }

  for (const { from, to, weight } of sorted) {
    if (find(from) !== find(to)) {
      union(from, to)
      mstEdges.push(`${from}-${to}`)
      const visited = new Set()
      mstEdges.forEach(e => { const [a,b] = e.split('-').map(Number); visited.add(a); visited.add(b) })
      steps.push({ visited: [...visited], active: to, path: [], desc: `Adding edge ${nodes[from]?.label}-${nodes[to]?.label} (w=${weight})`, highlightEdges: [...mstEdges] })
    } else {
      steps.push({ visited: [], active: -1, path: [], desc: `Skipping ${nodes[from]?.label}-${nodes[to]?.label}: would form cycle`, highlightEdges: mstEdges })
    }
  }
  return steps
}

const buildAdj = (nodes, edges, weighted = false) => {
  const adj = {}
  nodes.forEach(n => adj[n.id] = [])
  edges.forEach(({ from, to, weight }) => {
    adj[from].push({ to, weight: weight || 1 })
    adj[to].push({ to: from, weight: weight || 1 })
  })
  return adj
}

const ALGO_FNS = {
  'BFS': bfsSteps, 'DFS': dfsSteps, 'Dijkstra': dijkstraSteps,
  "Prim's MST": primsSteps, "Kruskal's MST": kruskalsSteps,
}

export default function GraphVisualizer() {
  const [algo, setAlgo] = useState('BFS')
  const [nodes, setNodes] = useState(DEFAULT_NODES)
  const [edges, setEdges] = useState(DEFAULT_EDGES)
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const [speed, setSpeed] = useState(4)
  const [dragging, setDragging] = useState(null)
  const [addEdgeMode, setAddEdgeMode] = useState(false)
  const [edgeSrc, setEdgeSrc] = useState(null)
  const [startNode, setStartNode] = useState(0)

  const timerRef = useRef(null)
  const isPlayRef = useRef(false)
  const stepRef = useRef(-1)
  const stepsRef = useRef([])
  const svgRef = useRef(null)

  const reset = () => {
    clearTimeout(timerRef.current)
    isPlayRef.current = false
    setSteps([]); setStepIdx(-1); setCurrentStep(null); setIsPlaying(false)
    stepsRef.current = []; stepRef.current = -1
  }

  const play = () => {
    let st = stepsRef.current
    if (!st.length) {
      st = ALGO_FNS[algo](nodes, edges)
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
      timerRef.current = setTimeout(advance, SPEED_DELAYS[speed] || 400)
    }
    advance()
  }

  const pause = () => {
    clearTimeout(timerRef.current)
    isPlayRef.current = false
    setIsPlaying(false)
  }

  // Node dragging
  const onMouseDown = (e, nodeId) => {
    if (addEdgeMode) {
      if (edgeSrc === null) { setEdgeSrc(nodeId); return }
      if (edgeSrc !== nodeId) {
        const w = parseInt(prompt('Edge weight:', '1') || '1')
        setEdges(prev => [...prev, { from: edgeSrc, to: nodeId, weight: w }])
      }
      setEdgeSrc(null); setAddEdgeMode(false); return
    }
    setDragging(nodeId)
  }

  const onMouseMove = useCallback((e) => {
    if (dragging === null) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x, y } : n))
  }, [dragging])

  const onMouseUp = () => setDragging(null)

  const addNode = () => {
    const id = nodes.length
    setNodes(prev => [...prev, { id, label: String.fromCharCode(65 + id % 26), x: 200 + Math.random()*100, y: 200 + Math.random()*100 }])
  }

  const visited = new Set(currentStep?.visited || [])
  const activeNode = currentStep?.active
  const highlightEdges = new Set(currentStep?.highlightEdges || [])

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Algorithm Visualizer</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Graph Algorithms</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {ALGOS.map(a => (
          <button key={a} onClick={() => { setAlgo(a); reset() }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${algo === a ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-surface-700 text-slate-400 hover:text-white border border-white/5'}`}>
            {a}
          </button>
        ))}
      </div>

      {/* SVG Graph */}
      <div className="viz-container" style={{ height: '460px' }}>
        <svg ref={svgRef} className="w-full h-full" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
          {/* Edges */}
          {edges.map((e, i) => {
            const fn = nodes.find(n => n.id === e.from)
            const tn = nodes.find(n => n.id === e.to)
            if (!fn || !tn) return null
            const key1 = `${e.from}-${e.to}`, key2 = `${e.to}-${e.from}`
            const isHL = highlightEdges.has(key1) || highlightEdges.has(key2)
            const mx = (fn.x + tn.x) / 2, my = (fn.y + tn.y) / 2
            return (
              <g key={i}>
                <line x1={fn.x} y1={fn.y} x2={tn.x} y2={tn.y}
                  stroke={isHL ? '#00e5ff' : '#1d2f47'} strokeWidth={isHL ? 2.5 : 1.5}
                  style={{ filter: isHL ? 'drop-shadow(0 0 4px #00e5ff)' : 'none', transition: 'all 0.3s' }} />
                <text x={mx} y={my - 6} textAnchor="middle" className="text-xs" fill="#64748b" fontSize="11">
                  {e.weight}
                </text>
              </g>
            )
          })}

          {/* Edge-src indicator */}
          {edgeSrc !== null && (() => {
            const n = nodes.find(x => x.id === edgeSrc)
            return n ? <circle cx={n.x} cy={n.y} r={22} fill="none" stroke="#ffd700" strokeWidth={2} strokeDasharray="4" /> : null
          })()}

          {/* Nodes */}
          {nodes.map(node => {
            const isVisited = visited.has(node.id)
            const isActive = activeNode === node.id
            const isStart = node.id === startNode
            let fill = '#0d1524', stroke = '#263a57'
            if (isActive) { fill = '#ffd70020'; stroke = '#ffd700' }
            else if (isVisited) { fill = '#00e5ff20'; stroke = '#00e5ff' }
            else if (isStart && !currentStep) { fill = '#a855f720'; stroke = '#a855f7' }

            return (
              <g key={node.id} onMouseDown={(e) => onMouseDown(e, node.id)}
                 style={{ cursor: addEdgeMode ? 'crosshair' : 'grab', userSelect: 'none' }}>
                <circle cx={node.x} cy={node.y} r={20} fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ filter: isActive ? 'drop-shadow(0 0 8px #ffd700)' : isVisited ? 'drop-shadow(0 0 6px #00e5ff60)' : 'none', transition: 'all 0.3s' }} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fill={isActive ? '#ffd700' : isVisited ? '#00e5ff' : '#94a3b8'}
                  fontSize="13" fontWeight="600" fontFamily="Space Grotesk">{node.label}</text>
                {currentStep?.dist && (
                  <text x={node.x} y={node.y - 28} textAnchor="middle" fill="#00ff88" fontSize="11" fontFamily="JetBrains Mono">
                    {currentStep.dist[node.id] === Infinity ? '∞' : currentStep.dist[node.id]}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {currentStep?.desc && (
        <div className="glass-card px-4 py-2.5 border border-white/5">
          <p className="text-sm font-mono text-slate-300">{currentStep.desc}</p>
        </div>
      )}

      <div className="glass-card p-4 border border-white/5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={reset} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all"><RotateCcw className="w-4 h-4" /></button>
          <button onClick={isPlaying ? pause : play}
            className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${isPlaying ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30' : 'bg-purple-500 text-white hover:bg-purple-400'}`}>
            {isPlaying ? <><Pause className="w-4 h-4"/>Pause</> : <><Play className="w-4 h-4"/>Run {algo}</>}
          </button>
          <button onClick={() => setAddEdgeMode(!addEdgeMode)}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all ${addEdgeMode ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30' : 'btn-secondary'}`}>
            <Plus className="w-3.5 h-3.5" /> {addEdgeMode ? 'Click two nodes...' : 'Add Edge'}
          </button>
          <button onClick={addNode} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Node
          </button>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
            <span>Speed</span>
            <input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(+e.target.value)} className="slider w-24" />
          </div>
        </div>
        <p className="text-xs text-slate-500">💡 Drag nodes to rearrange. Click "Add Edge" then click two nodes to connect them.</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { color: '#a855f7', label: 'Start Node' },
          { color: '#00e5ff', label: 'Visited' },
          { color: '#ffd700', label: 'Current' },
          { color: '#00e5ff', label: 'MST/Path Edge', edge: true },
        ].map(({ color, label, edge }) => (
          <div key={label} className="flex items-center gap-1.5">
            {edge ? <div className="w-5 h-0.5 rounded" style={{ backgroundColor: color }} />
                  : <div className="w-3 h-3 rounded-full border" style={{ borderColor: color, backgroundColor: `${color}20` }} />}
            <span className="text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
