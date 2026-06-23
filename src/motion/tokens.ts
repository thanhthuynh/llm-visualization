// Mirrors the --motion-*/--ease-* tokens in src/index.css @theme. Keep in sync.
export const MOTION = {
  micro: 0.16, // --motion-micro 160ms
  standard: 0.32, // --motion-standard 320ms
  max: 0.36, // --motion-max 360ms
  stagger: 0.04, // --motion-stagger 40ms
} as const

export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const // --ease-standard
export const EASE_DECELERATE = [0, 0, 0.2, 1] as const // --ease-decelerate
