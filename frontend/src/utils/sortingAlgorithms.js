/**
 * Sorting algorithms - each returns array of steps for visualization
 * Step: { array, active, comparing, sorted, pivot, swaps, comparisons, description }
 */

const makeStep = (array, active = [], comparing = [], sorted = [], pivot = null, swaps = 0, comparisons = 0, desc = '') => ({
  array: [...array],
  active,
  comparing,
  sorted: [...sorted],
  pivot,
  swaps,
  comparisons,
  description: desc,
});

// ─── BUBBLE SORT ────────────────────────────────────────────────────────────
export const bubbleSort = (input) => {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  const sorted = [];
  let swaps = 0, comparisons = 0;

  steps.push(makeStep(arr, [], [], sorted, null, swaps, comparisons, 'Starting Bubble Sort'));

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push(makeStep(arr, [j, j + 1], [j, j + 1], sorted, null, swaps, comparisons, `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`));
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swapped = true;
        steps.push(makeStep(arr, [j, j + 1], [], sorted, null, swaps, comparisons, `Swapped: arr[${j}]=${arr[j]} ↔ arr[${j+1}]=${arr[j+1]}`));
      }
    }
    sorted.unshift(n - 1 - i);
    steps.push(makeStep(arr, [], [], sorted, null, swaps, comparisons, `Element ${arr[n-1-i]} placed at position ${n-1-i}`));
    if (!swapped) break;
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(makeStep(arr, [], [], allSorted, null, swaps, comparisons, 'Bubble Sort complete!'));
  return steps;
};

// ─── SELECTION SORT ──────────────────────────────────────────────────────────
export const selectionSort = (input) => {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  const sorted = [];
  let swaps = 0, comparisons = 0;

  steps.push(makeStep(arr, [], [], sorted, null, swaps, comparisons, 'Starting Selection Sort'));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(makeStep(arr, [i], [], sorted, minIdx, swaps, comparisons, `Finding minimum in range [${i}, ${n-1}]`));

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push(makeStep(arr, [j], [minIdx, j], sorted, minIdx, swaps, comparisons, `Comparing arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}`));
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push(makeStep(arr, [j], [], sorted, minIdx, swaps, comparisons, `New minimum found: arr[${j}]=${arr[j]}`));
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      steps.push(makeStep(arr, [i, minIdx], [], sorted, null, swaps, comparisons, `Swapped arr[${i}] with arr[${minIdx}]`));
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  steps.push(makeStep(arr, [], [], sorted, null, swaps, comparisons, 'Selection Sort complete!'));
  return steps;
};

// ─── INSERTION SORT ──────────────────────────────────────────────────────────
export const insertionSort = (input) => {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let swaps = 0, comparisons = 0;

  steps.push(makeStep(arr, [], [], [0], null, swaps, comparisons, 'Starting Insertion Sort'));

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push(makeStep(arr, [i], [], Array.from({ length: i }, (_, k) => k), null, swaps, comparisons, `Inserting arr[${i}]=${key} into sorted portion`));

    while (j >= 0 && arr[j] > key) {
      comparisons++;
      arr[j + 1] = arr[j];
      swaps++;
      steps.push(makeStep(arr, [j, j + 1], [j, j + 1], Array.from({ length: i }, (_, k) => k), null, swaps, comparisons, `Shifting arr[${j}]=${arr[j]} right`));
      j--;
    }
    arr[j + 1] = key;
    steps.push(makeStep(arr, [j + 1], [], Array.from({ length: i + 1 }, (_, k) => k), null, swaps, comparisons, `Placed ${key} at position ${j + 1}`));
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(makeStep(arr, [], [], allSorted, null, swaps, comparisons, 'Insertion Sort complete!'));
  return steps;
};

// ─── MERGE SORT ──────────────────────────────────────────────────────────────
export const mergeSort = (input) => {
  const arr = [...input];
  const steps = [];
  let swaps = 0, comparisons = 0;

  steps.push(makeStep(arr, [], [], [], null, swaps, comparisons, 'Starting Merge Sort'));

  const merge = (arr, left, mid, right) => {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < L.length && j < R.length) {
      comparisons++;
      steps.push(makeStep([...arr], [left + i, mid + 1 + j], [], [], null, swaps, comparisons, `Comparing L[${i}]=${L[i]} and R[${j}]=${R[j]}`));
      if (L[i] <= R[j]) {
        arr[k++] = L[i++];
      } else {
        arr[k++] = R[j++];
        swaps++;
      }
      steps.push(makeStep([...arr], [k - 1], [], [], null, swaps, comparisons, `Placed ${arr[k-1]} at index ${k-1}`));
    }
    while (i < L.length) { arr[k++] = L[i++]; }
    while (j < R.length) { arr[k++] = R[j++]; }
  };

  const mergeSortHelper = (arr, left, right) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    steps.push(makeStep([...arr], [], [left, right], [], null, swaps, comparisons, `Dividing [${left}..${right}] at mid ${mid}`));
    mergeSortHelper(arr, left, mid);
    mergeSortHelper(arr, mid + 1, right);
    merge(arr, left, mid, right);
  };

  mergeSortHelper(arr, 0, arr.length - 1);
  const allSorted = Array.from({ length: arr.length }, (_, i) => i);
  steps.push(makeStep(arr, [], [], allSorted, null, swaps, comparisons, 'Merge Sort complete!'));
  return steps;
};

// ─── QUICK SORT ───────────────────────────────────────────────────────────────
export const quickSort = (input) => {
  const arr = [...input];
  const steps = [];
  let swaps = 0, comparisons = 0;
  const sorted = new Set();

  steps.push(makeStep(arr, [], [], [], null, swaps, comparisons, 'Starting Quick Sort'));

  const partition = (arr, low, high) => {
    const pivotVal = arr[high];
    let i = low - 1;
    steps.push(makeStep([...arr], [], [], [...sorted], high, swaps, comparisons, `Pivot = arr[${high}] = ${pivotVal}`));

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push(makeStep([...arr], [j], [], [...sorted], high, swaps, comparisons, `Comparing arr[${j}]=${arr[j]} with pivot ${pivotVal}`));
      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
          steps.push(makeStep([...arr], [i, j], [], [...sorted], high, swaps, comparisons, `Swapped arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}`));
        }
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    sorted.add(i + 1);
    steps.push(makeStep([...arr], [i + 1], [], [...sorted], null, swaps, comparisons, `Pivot ${pivotVal} placed at position ${i+1}`));
    return i + 1;
  };

  const quickSortHelper = (arr, low, high) => {
    if (low >= high) {
      if (low === high) sorted.add(low);
      return;
    }
    const pi = partition(arr, low, high);
    quickSortHelper(arr, low, pi - 1);
    quickSortHelper(arr, pi + 1, high);
  };

  quickSortHelper(arr, 0, arr.length - 1);
  const allSorted = Array.from({ length: arr.length }, (_, i) => i);
  steps.push(makeStep(arr, [], [], allSorted, null, swaps, comparisons, 'Quick Sort complete!'));
  return steps;
};

// ─── HEAP SORT ────────────────────────────────────────────────────────────────
export const heapSort = (input) => {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let swaps = 0, comparisons = 0;
  const sorted = [];

  steps.push(makeStep(arr, [], [], sorted, null, swaps, comparisons, 'Starting Heap Sort - building max heap'));

  const heapify = (arr, n, i) => {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      comparisons++;
      steps.push(makeStep([...arr], [i, l], [], sorted, null, swaps, comparisons, `Comparing parent[${i}]=${arr[i]} with left[${l}]=${arr[l]}`));
      if (arr[l] > arr[largest]) largest = l;
    }
    if (r < n) {
      comparisons++;
      steps.push(makeStep([...arr], [i, r], [], sorted, null, swaps, comparisons, `Comparing parent[${i}]=${arr[i]} with right[${r}]=${arr[r]}`));
      if (arr[r] > arr[largest]) largest = r;
    }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      swaps++;
      steps.push(makeStep([...arr], [i, largest], [], sorted, null, swaps, comparisons, `Swapped arr[${i}] and arr[${largest}]`));
      heapify(arr, n, largest);
    }
  };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  steps.push(makeStep(arr, [], [], sorted, null, swaps, comparisons, 'Max heap built. Extracting elements...'));

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;
    sorted.unshift(i);
    steps.push(makeStep([...arr], [0, i], [], sorted, null, swaps, comparisons, `Extracted max ${arr[i]} to position ${i}`));
    heapify(arr, i, 0);
  }
  sorted.unshift(0);
  steps.push(makeStep(arr, [], [], sorted, null, swaps, comparisons, 'Heap Sort complete!'));
  return steps;
};

export const SORT_ALGORITHMS = {
  'bubble-sort':    { fn: bubbleSort,    name: 'Bubble Sort'    },
  'selection-sort': { fn: selectionSort, name: 'Selection Sort' },
  'insertion-sort': { fn: insertionSort, name: 'Insertion Sort' },
  'merge-sort':     { fn: mergeSort,     name: 'Merge Sort'     },
  'quick-sort':     { fn: quickSort,     name: 'Quick Sort'     },
  'heap-sort':      { fn: heapSort,      name: 'Heap Sort'      },
};
