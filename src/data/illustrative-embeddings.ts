export interface IllustrativeDot {
  label: string
  x: number // normalised −1..1
  y: number
}

export const ILLUSTRATIVE_DOTS: ReadonlyArray<IllustrativeDot> = [
  { label: 'sky', x: -0.55, y: -0.4 },
  { label: 'blue', x: -0.3, y: -0.55 },
  { label: 'cloud', x: -0.5, y: -0.15 },
  { label: 'rain', x: -0.2, y: -0.2 },
  { label: 'dog', x: 0.45, y: 0.3 },
  { label: 'cat', x: 0.55, y: 0.1 },
  { label: 'walked', x: 0.25, y: 0.55 },
  { label: 'ran', x: 0.45, y: 0.5 },
]
