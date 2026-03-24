/**
 * Procedural terrain generation for the isometric board.
 *
 * Heights snap to fixed levels (in "game units"):
 *   -20, -15, -10, -5, 0, 5, 10, 15, 20
 *
 * fBM (fractional Brownian motion) layered value noise gives organic,
 * island-like terrain with smooth transitions between biomes.
 */

export const HEIGHTS = [-20, -15, -10, -5, 0, 5, 10, 15, 20] as const;
export type HeightLevel = (typeof HEIGHTS)[number];

/** Game-unit height → visual Y position (Three.js world units) */
export const VISUAL_SCALE = 0.14;

/** Bottom of the deepest tile — all boxes extend down to this Y */
export const BASE_Y = HEIGHTS[0] * VISUAL_SCALE; // −2.8

// ---------------------------------------------------------------------------
// Noise helpers
// ---------------------------------------------------------------------------

function fract(x: number) {
  return x - Math.floor(x);
}

/** Deterministic hash for two integers */
function hash(x: number, y: number): number {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
}

/** Smooth bilinear value noise, range 0..1 */
function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x),  iy = Math.floor(y);
  const fx = x - ix,          fy = y - iy;
  // Smoothstep curve
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return (
    hash(ix,     iy    ) * (1 - ux) * (1 - uy) +
    hash(ix + 1, iy    ) *      ux  * (1 - uy) +
    hash(ix,     iy + 1) * (1 - ux) *      uy  +
    hash(ix + 1, iy + 1) *      ux  *      uy
  );
}

/**
 * Fractional Brownian Motion — four octaves.
 * Returns a value roughly in [0, 0.9375].
 */
function fbm(x: number, y: number): number {
  return (
    valueNoise(x,       y      ) * 0.500 +
    valueNoise(x * 2,   y * 2  ) * 0.250 +
    valueNoise(x * 4,   y * 4  ) * 0.125 +
    valueNoise(x * 8,   y * 8  ) * 0.0625
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a `size × size` height map.
 * Each cell snaps to one of the nine fixed height levels.
 *
 * @param size  Board dimension (e.g. 20 → 20×20 grid)
 * @param seed  Random seed — different values produce different maps
 */
export function generateTerrain(size: number, seed = 0): HeightLevel[][] {
  const scale = 0.13;
  const ox = seed * 137.508;   // offset x
  const oy = seed * 89.314;    // offset y

  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const raw = fbm((col + ox) * scale, (row + oy) * scale) / 0.9375; // normalise → 0..1
      // Power curve biases distribution toward lower elevations (more ocean/plains)
      const biased = Math.pow(raw, 1.25);
      const idx = Math.min(Math.round(biased * (HEIGHTS.length - 1)), HEIGHTS.length - 1);
      return HEIGHTS[idx];
    })
  );
}

// ---------------------------------------------------------------------------
// Visual mappings
// ---------------------------------------------------------------------------

export const HEIGHT_COLORS: Record<HeightLevel, string> = {
  [-20]: "#0b1d30",  // deep ocean
  [-15]: "#163555",  // ocean
  [-10]: "#1e5480",  // shallow water
  [ -5]: "#d6c07a",  // sand / beach
  [  0]: "#5c8c3e",  // plains / grass
  [  5]: "#4a7230",  // forest
  [ 10]: "#3a5c25",  // dense forest
  [ 15]: "#7a6655",  // rocky mountain
  [ 20]: "#eeece8",  // snow peak
};

export const HEIGHT_LABELS: Record<HeightLevel, string> = {
  [-20]: "Deep Ocean",
  [-15]: "Ocean",
  [-10]: "Shallow Water",
  [ -5]: "Beach",
  [  0]: "Plains",
  [  5]: "Forest",
  [ 10]: "Dense Forest",
  [ 15]: "Mountain",
  [ 20]: "Peak",
};

/** True for tiles that should render below the water plane */
export function isWater(h: HeightLevel): boolean {
  return h <= -10;
}
