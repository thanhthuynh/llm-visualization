export function softmaxWithTemperature(
  logits: ReadonlyArray<number>,
  temperature: number,
): number[] {
  if (logits.length === 0) {
    throw new Error('softmaxWithTemperature: logits must be non-empty')
  }
  if (!(temperature > 0)) {
    throw new Error(`softmaxWithTemperature: temperature must be > 0 (got ${temperature})`)
  }
  const scaled = logits.map((l) => l / temperature)
  const maxScaled = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - maxScaled))
  const Z = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / Z)
}
