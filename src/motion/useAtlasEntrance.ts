import { useEffect } from 'react'
import { animate } from 'motion'
import { SECTION_IDS } from '@/plates/plates.config'

/**
 * Gold accent as computed by the browser. Plates write gold strokes three
 * ways (attribute hex, `var(--color-gold)`, `stroke-gold` class), so ambient
 * flow matches on the computed value, which normalizes all of them.
 */
const GOLD_STROKE_COMPUTED = 'rgb(216, 166, 87)'
/** Ambient dashed-route flow speed, px per second. */
const DASH_FLOW_SPEED = 14
/** Cubic approximations of the reference easings. */
const EASE_IN_OUT_SINE: [number, number, number, number] = [0.37, 0, 0.63, 1]
const EASE_OUT_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

/**
 * The Atlas entrance grammar (first reveal per section, never re-run):
 * - sheet: opacity 0→1 + rise 14px, 620ms ease-out
 * - SVG strokes: dash-draw to full length, 760ms, 40ms stagger, 200ms base
 * - SVG circles: r 0→r + fade, 520ms ease-out-back, 26ms stagger
 * Ambient loops after entrance: gold dashed routes flow (~14px/s), hollow
 * halo circles pulse (r ×1.16, opacity .42→.12, 2.4s mirror).
 * Skipped entirely under prefers-reduced-motion — content stays visible.
 */
export function useAtlasEntrance(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof window.IntersectionObserver === 'undefined') return

    // Ambient loops run on the Web Animations API (motion's animate() does not
    // reliably loop stroke-dashoffset); entrances use motion's animate().
    const loops: Animation[] = []
    const animated = new Set<string>()

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )

    // Sheets below the fold start hidden so the entrance has something to do.
    for (const section of sections) {
      const sheet = section.querySelector<HTMLElement>('[data-screen-label]')
      if (sheet && section.getBoundingClientRect().top > window.innerHeight) {
        sheet.style.opacity = '0'
      }
    }

    function startAmbientFlow(stroke: SVGGeometryElement): void {
      const dash = stroke.getAttribute('stroke-dasharray')
      if (!dash || getComputedStyle(stroke).stroke !== GOLD_STROKE_COMPUTED) return
      const nums = (dash.match(/[\d.]+/g) ?? []).map(Number)
      let period = nums.reduce((a, b) => a + b, 0)
      if (nums.length === 1) period = (nums[0] ?? 0) * 2
      if (period <= 0) return
      const distance = period * 3
      loops.push(
        stroke.animate([{ strokeDashoffset: '0' }, { strokeDashoffset: `${-distance}` }], {
          duration: (distance / DASH_FLOW_SPEED) * 1000,
          easing: 'linear',
          iterations: Infinity,
        }),
      )
    }

    function runEntrance(section: HTMLElement): void {
      const sheet = section.querySelector<HTMLElement>('[data-screen-label]')
      if (!sheet) return

      animate(sheet, { opacity: [0, 1], y: [14, 0] }, { duration: 0.62, ease: 'easeOut' })

      const strokes = sheet.querySelectorAll<SVGGeometryElement>('svg path, svg polyline, svg line')
      strokes.forEach((stroke, idx) => {
        let length = 0
        try {
          length = stroke.getTotalLength()
        } catch {
          return // detached/non-rendered geometry — leave it static
        }
        if (!length) return
        const originalDash = stroke.getAttribute('stroke-dasharray')
        stroke.style.strokeDasharray = `${length} ${length}`
        stroke.style.strokeDashoffset = String(length)
        const draw = animate(
          stroke,
          { strokeDashoffset: [length, 0] },
          { duration: 0.76, delay: 0.2 + idx * 0.04, ease: EASE_IN_OUT_SINE },
        )
        void draw.then(() => {
          stroke.style.strokeDashoffset = '0'
          if (originalDash) {
            stroke.style.strokeDasharray = originalDash
          } else {
            stroke.style.removeProperty('stroke-dasharray')
          }
          startAmbientFlow(stroke)
        })
      })

      const circles = Array.from(sheet.querySelectorAll<SVGCircleElement>('svg circle'))
      circles.forEach((circle, idx) => {
        const radius = Number.parseFloat(circle.getAttribute('r') ?? '0')
        if (!radius) return
        animate(
          circle,
          { r: [0, radius], opacity: [0, 1] },
          { duration: 0.52, delay: 0.32 + idx * 0.026, ease: EASE_OUT_BACK },
        )
      })
      for (const circle of circles) {
        if (circle.getAttribute('fill') !== 'none') continue
        const radius = Number.parseFloat(circle.getAttribute('r') ?? '0')
        if (!radius) continue
        loops.push(
          circle.animate(
            [
              { r: `${radius}px`, opacity: 0.42 },
              { r: `${radius * 1.16}px`, opacity: 0.12 },
            ],
            {
              duration: 2400,
              delay: 900,
              easing: 'ease-in-out',
              iterations: Infinity,
              direction: 'alternate',
            },
          ),
        )
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !animated.has(entry.target.id)) {
            animated.add(entry.target.id)
            runEntrance(entry.target as HTMLElement)
          }
        }
      },
      { threshold: 0.15 },
    )
    sections.forEach((section) => io.observe(section))

    return () => {
      io.disconnect()
      loops.forEach((loop) => loop.cancel())
    }
  }, [])
}
