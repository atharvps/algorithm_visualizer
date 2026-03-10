import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

class BSTNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; this.id = Math.random() }
}

const insertBST = (root, val) => {
  if (!root) return new BSTNode(val)
  if (val < root.val) root.left = insertBST(root.left, val)
  else if (val > root.val) root.right = insertBST(root.right, val)
  return root
}

const deepClone = (n) => {
  if (!n) return null
  const c = new BSTNode(n.val)
  c.id = n.id
  c.left = deepClone(n.left)
  c.right = deepClone(n.right)
  return c
}

const deleteBST = (root, val) => {
  if (!root) return null
  if (val < root.val) { root.left = deleteBST(root.left, val); return root }
  if (val > root.val) { root.right = deleteBST(root.right, val); return root }
  if (!root.left) return root.right
  if (!root.right) return root.left
  let succ = root.right
  while (succ.left) succ = succ.left
  root.val = succ.val
  root.right = deleteBST(root.right, succ.val)
  return root
}

const searchPath = (root, val) => {
  const path = []
  let curr = root
  while (curr) {
    path.push(curr.val)
    if (curr.val === val) break
    curr = val < curr.val ? curr.left : curr.right
  }
  return path
}

const layout = (node, x, y, gap) => {
  if (!node) return
  node.x = x; node.y = y
  if (node.left) layout(node.left, x - gap, y + 70, gap / 1.8)
  if (node.right) layout(node.right, x + gap, y + 70, gap / 1.8)
}

const collectNodes = (node, list = []) => {
  if (!node) return list
  list.push(node)
  collectNodes(node.left, list)
  collectNodes(node.right, list)
  return list
}

const collectEdges = (node, edges = []) => {
  if (!node) return edges
  if (node.left) { edges.push({ x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y }); collectEdges(node.left, edges) }
  if (node.right) { edges.push({ x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y }); collectEdges(node.right, edges) }
  return edges
}

const traverse = (node, type) => {
  if (!node) return []
  if (type === 'inorder') return [...traverse(node.left, 'inorder'), node.val, ...traverse(node.right, 'inorder')]
  if (type === 'preorder') return [node.val, ...traverse(node.left, 'preorder'), ...traverse(node.right, 'preorder')]
  if (type === 'postorder') return [...traverse(node.left, 'postorder'), ...traverse(node.right, 'postorder'), node.val]
  return []
}

const buildDefault = () => {
  let r = null
  for (const v of [50, 30, 70, 20, 40, 60, 80, 10, 35]) r = insertBST(r, v)
  return r
}

const SVG_W = 700, SVG_H = 420

export default function TreeVisualizer() {
  const [root, setRoot] = useState(buildDefault)
  const [input, setInput] = useState('')
  const [highlighted, setHighlighted] = useState([])
  const [message, setMessage] = useState('')

  const getLayoutRoot = () => {
    const cloned = deepClone(root)
    layout(cloned, SVG_W / 2, 50, 160)
    return cloned
  }

  const r = getLayoutRoot()
  const nodes = collectNodes(r)
  const edges = collectEdges(r)

  const flash = (vals, msg) => {
    setHighlighted(vals); setMessage(msg)
    setTimeout(() => setHighlighted([]), 2000)
  }

  const handleInsert = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    setRoot(prev => insertBST(deepClone(prev), v))
    flash([v], `Inserted ${v} into BST`)
    setInput('')
  }

  const handleDelete = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    setRoot(prev => deleteBST(deepClone(prev), v))
    setMessage(`Deleted ${v}`)
    setInput('')
  }

  const handleSearch = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    const path = searchPath(root, v)
    const found = path[path.length - 1] === v
    flash(path, found ? `Found ${v}! Path: ${path.join(' → ')}` : `${v} not found. Searched: ${path.join(' → ')}`)
  }

  const handleTraversal = (type) => {
    const result = traverse(root, type)
    flash(result, `${type.charAt(0).toUpperCase() + type.slice(1)}: [ ${result.join(', ')} ]`)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Data Structure Visualizer</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Binary Search Tree</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { label: 'Best: O(log n)', cls: 'complexity-best' },
            { label: 'Worst: O(n)',    cls: 'complexity-worst' },
            { label: 'Space: O(n)',    cls: 'complexity-space' },
          ].map(b => <span key={b.label} className={b.cls}>{b.label}</span>)}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Tree SVG */}
        <div className="lg:col-span-2 viz-container overflow-auto" style={{ minHeight: '440px' }}>
          <svg width={SVG_W} height={SVG_H} style={{ minWidth: SVG_W }}>
            {edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#263a57" strokeWidth="1.5" />
            ))}
            {nodes.map((node) => {
              const idx = highlighted.indexOf(node.val)
              const isHL = idx >= 0
              const isFirst = idx === 0 && highlighted.length > 1
              const isLast = idx === highlighted.length - 1 && highlighted.length > 0
              return (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r={22}
                    fill={isLast ? '#00ff8820' : isFirst ? '#ffd70020' : isHL ? '#00e5ff20' : '#0d1524'}
                    stroke={isLast ? '#00ff88' : isFirst ? '#ffd700' : isHL ? '#00e5ff' : '#263a57'}
                    strokeWidth={isHL ? 2.5 : 1.5}
                    style={{ filter: isHL ? `drop-shadow(0 0 8px ${isLast ? '#00ff88' : '#00e5ff'})` : 'none', transition: 'all 0.3s' }}
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle"
                    fill={isLast ? '#00ff88' : isFirst ? '#ffd700' : isHL ? '#00e5ff' : '#94a3b8'}
                    fontSize="13" fontWeight="600" fontFamily="Space Grotesk">{node.val}</text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="glass-card p-4 border border-white/5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations</p>
            <input type="number" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleInsert()}
              placeholder="Enter value..." className="input-field" />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Insert', fn: handleInsert, cls: 'bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30' },
                { label: 'Delete', fn: handleDelete, cls: 'bg-accent-red/20 text-accent-red border border-accent-red/30 hover:bg-accent-red/30' },
                { label: 'Search', fn: handleSearch, cls: 'bg-accent-green/20 text-accent-green border border-accent-green/30 hover:bg-accent-green/30' },
              ].map(btn => (
                <button key={btn.label} onClick={btn.fn}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${btn.cls}`}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 border border-white/5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Traversals</p>
            <div className="space-y-2">
              {['inorder', 'preorder', 'postorder'].map(t => (
                <button key={t} onClick={() => handleTraversal(t)}
                  className="w-full py-2 rounded-lg text-sm bg-surface-600 hover:bg-surface-500 text-slate-300 hover:text-white transition-all capitalize">
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => { setRoot(buildDefault()); setHighlighted([]); setMessage('') }}
            className="w-full btn-secondary flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset Tree
          </button>

          {message && (
            <div className="glass-card p-3 border border-primary-500/20 bg-primary-500/5">
              <p className="text-xs font-mono text-slate-300 break-words">{message}</p>
            </div>
          )}

          <div className="glass-card p-3 border border-white/5 space-y-1.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Legend</p>
            {[
              { color: '#ffd700', label: 'Search Start' },
              { color: '#00e5ff', label: 'On Path' },
              { color: '#00ff88', label: 'Found / Last' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
