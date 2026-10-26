/** Utilidades de física ligera para el botón Stretch y el guante. */

export function sstep(x: number) {
  const v = x < 0 ? 0 : x > 1 ? 1 : x
  return v * v * (3 - 2 * v)
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
