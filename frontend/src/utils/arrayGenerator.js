/**
 * Generate arrays for algorithm visualization
 */

export const generateArray = (type, size, min = 5, max = 100) => {
  switch (type) {
    case 'sorted':        return generateSorted(size, min, max);
    case 'reverse-sorted':return generateReverseSorted(size, min, max);
    case 'nearly-sorted': return generateNearlySorted(size, min, max);
    case 'few-unique':    return generateFewUnique(size, min, max);
    case 'random':
    default:              return generateRandom(size, min, max);
  }
};

export const generateRandom = (size, min = 5, max = 100) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);

export const generateSorted = (size, min = 5, max = 100) => {
  const arr = generateRandom(size, min, max);
  return arr.sort((a, b) => a - b);
};

export const generateReverseSorted = (size, min = 5, max = 100) => {
  const arr = generateRandom(size, min, max);
  return arr.sort((a, b) => b - a);
};

export const generateNearlySorted = (size, min = 5, max = 100) => {
  const arr = generateSorted(size, min, max);
  const swaps = Math.max(1, Math.floor(size * 0.05));
  for (let i = 0; i < swaps; i++) {
    const a = Math.floor(Math.random() * size);
    const b = Math.floor(Math.random() * size);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }
  return arr;
};

export const generateFewUnique = (size, min = 5, max = 100) => {
  const uniqueCount = Math.max(3, Math.floor(size * 0.1));
  const uniques = Array.from({ length: uniqueCount }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
  return Array.from({ length: size }, () => uniques[Math.floor(Math.random() * uniques.length)]);
};

export const parseCustomArray = (input) => {
  try {
    const cleaned = input.replace(/[^0-9,\s-]/g, '');
    const arr = cleaned
      .split(/[,\s]+/)
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n));
    if (arr.length === 0) throw new Error('No valid numbers found');
    if (arr.length > 150) throw new Error('Max 150 elements allowed');
    if (arr.some((n) => n < 1 || n > 999)) throw new Error('Values must be between 1-999');
    return { arr, error: null };
  } catch (err) {
    return { arr: null, error: err.message };
  }
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
