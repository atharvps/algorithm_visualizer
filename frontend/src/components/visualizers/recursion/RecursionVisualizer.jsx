import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react'

// Build Fibonacci recursion tree
const buildFibTree = (n, depth = 0, maxDepth = 6) => {
  if (depth > maxDepth) return null
  const node = { id: Math.random().toString(36).slice(2), label: `fib(${n})`, value: n <= 1 ? n : null, n, depth, children: [] }
  if (n <= 1) return node
  const left = buildFibTree(n - 1, depth + 1, maxDepth)
  const right = buildFibTree(n - 2, depth + 1, maxDepth)
  if (left) node.children.push(left)
  if (right) node.children.push(right)
  return node
}

// Collect nodes in call order (DFS)
const collectOrder = (node, order = []) => {
  if (!node) return order
  order.push(node.id)
  node.children.forEach(c => collectOrder(c, order))
  return order
}

function TreeNode({ node, highlighted, collapsed, onToggle, depth }) {
  const isHL = highlighted === node.id
  const isCollapsed = collapsed.has(node.id)
  const hasChildren = node.children.length > 0

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: depth * 0.05 }}
          onClick={() => hasChildren && onToggle(node.id)}
          className={`relative px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 transition-all
            ${isHL ? 'border-primary-500 bg-primary-500/30 text-primary-200 shadow-glow-sm scale-110'
                   : node.value !== null ? 'border-accent-green/60 bg-accent-green/10 text-accent-green'
                   : 'border-surface-400 bg-surface-700 text-white hover:border-surface-300'}`}
          style={{ minWidth: 64 }}>
          {node.label}
          {node.value !== null && <span className="ml-1 text-accent-green">={node.value}</span>}
          {hasChildren && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-surface-500 flex items-center justify-center">
              {isCollapsed ? <ChevronRight className="w-2 h-2 text-slate-400" /> : <ChevronDown className="w-2 h-2 text-slate-400" />}
            </span>
          )}
        </motion.button>
      </div>

      {!isCollapsed && node.children.length > 0 && (
        <div className="flex gap-4 mt-1 relative">
          {/* Connecting lines */}
          <div className="absolute top-0 left-0 right-0 flex justify-around">
            {node.children.map((_, i) => (
              <div key={i} className="w-0.5 h-4 bg-surface-500" />
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} highlighted={highlighted} collapsed={collapsed} onToggle={onToggle} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RecursionVisualizer() {
  const [n, setN] = useState(5)
  const [tree, setTree] = useState(null)
  const [highlighted, setHighlighted] = useState(null)
  const [collapsed, setCollapsed] = useState(new Set())
  const [running, setRunning] = useState(false)
  const [callOrder, setCallOrder] = useState([])
  const [step, setStep] = useState(-1)

  const buildTree = () => {
    const t = buildFibTree(n, 0, Math.min(n, 5))
    setTree(t)
    const order = collectOrder(t)
    setCallOrder(order)
    return { t, order }
  }

  const run = async () => {
    setRunning(true)
    const { t, order } = buildTree()
    setCollapsed(new Set())
    for (let i = 0; i < order.length; i++) {
      setHighlighted(order[i])
      setStep(i)
      await new Promise(r => setTimeout(r, 300))
    }
    setHighlighted(null)
    setRunning(false)
  }

  const reset = () => {
    setTree(null); setHighlighted(null); setCollapsed(new Set()); setRunning(false); setCallOrder([]); setStep(-1)
  }

  const toggleCollapse = (id) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Algorithm Visualizer</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Recursion Tree</h1>
        <div className="flex gap-2 mt-2">
          <span className="complexity-worst">Time: O(2ⁿ)</span>
          <span className="complexity-space">Space: O(n)</span>
        </div>
      </div>

      <div className="glass-card p-4 border border-white/5 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-400">fib(n), n =</label>
            <input type="range" min="2" max="7" value={n}
              onChange={e => { setN(+e.target.value); reset() }}
              className="slider w-32" disabled={running} />
            <span className="text-primary-400 font-mono font-bold text-lg w-4">{n}</span>
          </div>
          <div className="flex gap-2 ml-auto">
            <button onClick={reset} disabled={running} className="p-2 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-300 transition-all disabled:opacity-50">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={run} disabled={running}
              className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <Play className="w-4 h-4" />{running ? `Step ${step+1}/${callOrder.length}...` : 'Animate Calls'}
            </button>
            <button onClick={buildTree} disabled={running} className="btn-secondary text-sm">
              Build Tree
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500">Click on any node to collapse/expand its subtree</p>
      </div>

      {/* Tree visualization */}
      {tree ? (
        <div className="viz-container p-6 overflow-auto" style={{ minHeight: '400px' }}>
          <div className="flex justify-center min-w-max">
            <TreeNode node={tree} highlighted={highlighted} collapsed={collapsed} onToggle={toggleCollapse} depth={0} />
          </div>
        </div>
      ) : (
        <div className="viz-container p-12 text-center text-slate-600">
          <p className="font-mono text-sm">Press "Build Tree" or "Animate Calls" to visualize fib({n})</p>
        </div>
      )}

      {/* Call stack info */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Calls', value: callOrder.length || '?', color: 'text-primary-400' },
          { label: 'Tree Depth', value: n, color: 'text-accent-yellow' },
          { label: 'Overlapping', value: n > 2 ? 'Yes (DP needed)' : 'No', color: 'text-accent-red' },
        ].map(s => (
          <div key={s.label} className="glass-card px-4 py-3 border border-white/5 text-center">
            <div className={`font-display font-bold text-lg ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
