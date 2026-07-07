/**
 * Current zoom applied to the 1280px design stage. Written by `useScaleToFit`,
 * read by `scrollToScene` so the sticky-header offset matches the rendered
 * (zoomed) header height. Module-level on purpose: the value is a rendering
 * measurement, not React state — nothing re-renders when it changes.
 */
let stageZoom = 1

export function setStageZoom(zoom: number): void {
  stageZoom = zoom
}

export function getStageZoom(): number {
  return stageZoom
}
