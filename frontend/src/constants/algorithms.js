export const ALGORITHM_CATEGORIES = {
  sorting: {
    id: 'sorting',
    label: 'Sorting',
    icon: 'BarChart2',
    color: '#00e5ff',
    description: 'Visualize how sorting algorithms arrange elements',
    algorithms: [
      { id: 'bubble-sort',    name: 'Bubble Sort',    best: 'O(n)', avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)',      stable: true  },
      { id: 'selection-sort', name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)',     worst: 'O(n²)',      space: 'O(1)',      stable: false },
      { id: 'insertion-sort', name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)',      stable: true  },
      { id: 'merge-sort',     name: 'Merge Sort',     best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true },
      { id: 'quick-sort',     name: 'Quick Sort',     best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)',  space: 'O(log n)', stable: false },
      { id: 'heap-sort',      name: 'Heap Sort',      best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false },
    ],
  },
  searching: {
    id: 'searching',
    label: 'Searching',
    icon: 'Search',
    color: '#00ff88',
    description: 'Explore linear and binary search techniques',
    algorithms: [
      { id: 'linear-search', name: 'Linear Search', best: 'O(1)', avg: 'O(n)',       worst: 'O(n)',       space: 'O(1)' },
      { id: 'binary-search', name: 'Binary Search', best: 'O(1)', avg: 'O(log n)',   worst: 'O(log n)',   space: 'O(1)' },
    ],
  },
  graph: {
    id: 'graph',
    label: 'Graph',
    icon: 'GitBranch',
    color: '#a855f7',
    description: 'Traverse and analyze graph structures',
    algorithms: [
      { id: 'bfs',       name: 'BFS',              best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
      { id: 'dfs',       name: 'DFS',              best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
      { id: 'dijkstra',  name: "Dijkstra's",        best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(E log V)', space: 'O(V)' },
      { id: 'prims',     name: "Prim's MST",        best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(E log V)', space: 'O(V)' },
      { id: 'kruskals',  name: "Kruskal's MST",     best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)' },
    ],
  },
  tree: {
    id: 'tree',
    label: 'Trees',
    icon: 'GitMerge',
    color: '#ffd700',
    description: 'Insert, delete, and traverse binary search trees',
    algorithms: [
      { id: 'bst', name: 'Binary Search Tree', best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
    ],
  },
  linkedlist: {
    id: 'linkedlist',
    label: 'Linked List',
    icon: 'Link',
    color: '#ff8c42',
    description: 'Manipulate singly and doubly linked lists',
    algorithms: [
      { id: 'singly-linked-list', name: 'Singly Linked List', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)' },
      { id: 'doubly-linked-list', name: 'Doubly Linked List', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    ],
  },
  stackqueue: {
    id: 'stackqueue',
    label: 'Stack & Queue',
    icon: 'Layers',
    color: '#ec4899',
    description: 'Push, pop, enqueue, and dequeue operations',
    algorithms: [
      { id: 'stack', name: 'Stack',  best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(n)' },
      { id: 'queue', name: 'Queue',  best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    ],
  },
  'dynamic-programming': {
    id: 'dynamic-programming',
    label: 'Dynamic Programming',
    icon: 'Grid',
    color: '#ff4757',
    description: 'Solve complex problems with memoization',
    algorithms: [
      { id: 'fibonacci-dp',  name: 'Fibonacci (DP)',  best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)' },
      { id: 'knapsack-01',   name: '0/1 Knapsack',    best: 'O(nW)', avg: 'O(nW)', worst: 'O(nW)', space: 'O(nW)' },
      { id: 'lcs',           name: 'Longest Common Subsequence', best: 'O(mn)', avg: 'O(mn)', worst: 'O(mn)', space: 'O(mn)' },
      { id: 'matrix-chain',  name: 'Matrix Chain Multiplication', best: 'O(n³)', avg: 'O(n³)', worst: 'O(n³)', space: 'O(n²)' },
    ],
  },
  'sliding-window': {
    id: 'sliding-window',
    label: 'Sliding Window',
    icon: 'Maximize2',
    color: '#38bdf8',
    description: 'Efficiently process subarrays and substrings',
    algorithms: [
      { id: 'max-sum-subarray',     name: 'Max Sum Subarray (K)',    best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
      { id: 'longest-no-repeat',    name: 'Longest No-Repeat Substr', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(k)' },
      { id: 'sliding-window-max',   name: 'Sliding Window Maximum',   best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(k)' },
    ],
  },
  recursion: {
    id: 'recursion',
    label: 'Recursion',
    icon: 'RefreshCw',
    color: '#818cf8',
    description: 'Visualize recursive call trees and backtracking',
    algorithms: [
      { id: 'fibonacci-recursion', name: 'Fibonacci (Recursion)',  best: 'O(2ⁿ)', avg: 'O(2ⁿ)', worst: 'O(2ⁿ)', space: 'O(n)' },
      { id: 'merge-sort-tree',     name: 'Merge Sort Tree',         best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
      { id: 'permutations',        name: 'Permutations',            best: 'O(n!)', avg: 'O(n!)', worst: 'O(n!)', space: 'O(n)' },
    ],
  },
  string: {
    id: 'string',
    label: 'String',
    icon: 'Type',
    color: '#38bdf8',
    description: 'Pattern matching and string processing',
    algorithms: [
      { id: 'kmp', name: 'KMP Pattern Matching', best: 'O(n)', avg: 'O(n+m)', worst: 'O(n+m)', space: 'O(m)' },
    ],
  },
};

export const COMPLEXITY_CLASSES = [
  { label: 'O(1)',        fn: (n) => 1,               color: '#00ff88', name: 'Constant'    },
  { label: 'O(log n)',    fn: (n) => Math.log2(n),    color: '#00e5ff', name: 'Logarithmic' },
  { label: 'O(n)',        fn: (n) => n,               color: '#ffd700', name: 'Linear'      },
  { label: 'O(n log n)',  fn: (n) => n * Math.log2(n),color: '#ff8c42', name: 'Linearithmic'},
  { label: 'O(n²)',       fn: (n) => n * n,           color: '#ff4757', name: 'Quadratic'   },
  { label: 'O(2ⁿ)',       fn: (n) => Math.pow(2, n),  color: '#ec4899', name: 'Exponential' },
];

export const SPEED_LABELS = {
  1: '0.25×', 2: '0.5×', 3: '0.75×', 4: '1×', 5: '1.25×',
  6: '1.5×',  7: '2×',   8: '3×',    9: '4×', 10: '8×'
};

export const SPEED_DELAYS = {
  1: 2000, 2: 1000, 3: 600, 4: 400, 5: 250,
  6: 150,  7: 100,  8: 60,  9: 30,  10: 10
};

export const ARRAY_GENERATOR_TYPES = [
  { value: 'random',        label: 'Random' },
  { value: 'sorted',        label: 'Sorted' },
  { value: 'reverse-sorted',label: 'Reverse Sorted' },
  { value: 'nearly-sorted', label: 'Nearly Sorted' },
  { value: 'few-unique',    label: 'Few Unique' },
];

export const BAR_COLORS = {
  default:  '#1d2f47',
  active:   '#00e5ff',
  compare:  '#ffd700',
  sorted:   '#00ff88',
  pivot:    '#a855f7',
  min:      '#ff8c42',
  found:    '#00ff88',
  range:    '#00e5ff40',
};
