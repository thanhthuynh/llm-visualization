import { describe, it, expect } from 'vitest'
import { ENTRANCE_CHILD_DURATION, entranceContainer, entranceItem } from '@/motion/entrance'
import { MOTION } from '@/motion/tokens'

describe('entrance module', () => {
  it('ENTRANCE_CHILD_DURATION is 0.24s', () => {
    expect(ENTRANCE_CHILD_DURATION).toBe(0.24)
  })

  it('composed cascade total (last child delay + duration) is ≤ MOTION.max (360 ms budget guard)', () => {
    expect(3 * MOTION.stagger + ENTRANCE_CHILD_DURATION).toBeLessThanOrEqual(MOTION.max)
  })

  it('entranceContainer has hidden/visible states', () => {
    expect(entranceContainer).toHaveProperty('hidden')
    expect(entranceContainer).toHaveProperty('visible')
  })

  it('entranceContainer.visible has staggerChildren transition', () => {
    const visible = entranceContainer.visible
    expect(visible).toBeDefined()
    if (visible && typeof visible === 'object' && 'transition' in visible) {
      const t = visible.transition as Record<string, unknown>
      expect(t).toHaveProperty('staggerChildren', MOTION.stagger)
    } else {
      throw new Error('entranceContainer.visible.transition is missing')
    }
  })

  it('entranceItem.hidden is { opacity: 0, y: 8 }', () => {
    expect(entranceItem.hidden).toMatchObject({ opacity: 0, y: 8 })
  })

  it('entranceItem.visible targets opacity: 1, y: 0', () => {
    const visible = entranceItem.visible
    expect(visible).toBeDefined()
    if (visible && typeof visible === 'object') {
      expect(visible).toMatchObject({ opacity: 1, y: 0 })
    }
  })

  it('entranceItem.visible transition uses ENTRANCE_CHILD_DURATION', () => {
    const visible = entranceItem.visible
    if (visible && typeof visible === 'object' && 'transition' in visible) {
      const t = visible.transition as Record<string, unknown>
      expect(t).toHaveProperty('duration', ENTRANCE_CHILD_DURATION)
    } else {
      throw new Error('entranceItem.visible.transition is missing')
    }
  })
})
