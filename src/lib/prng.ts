export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rounding keeps SVG coordinates identical between server and client render
// (sin/cos can differ in their last bit between Node's and the browser's V8).
export const r2 = (n: number) => Math.round(n * 100) / 100;
