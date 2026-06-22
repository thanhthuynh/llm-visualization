import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { shouldShowPrologue, resolveSnapMode } from '@/prologue/usePrologueGate'
import { __setReducedMotion } from '../setup'

// ── shouldShowPrologue ────────────────────────────────────────────────────────

describe('shouldShowPrologue', () => {
  it('returns true for empty hash (fresh entry)', () => {
    expect(shouldShowPrologue('')).toBe(true)
  })

  it('returns true for #intro', () => {
    expect(shouldShowPrologue('#intro')).toBe(true)
  })

  it('returns true for #INTRO (case-insensitive)', () => {
    expect(shouldShowPrologue('#INTRO')).toBe(true)
  })

  it('returns false for #tokenize (real station id → bypass)', () => {
    expect(shouldShowPrologue('#tokenize')).toBe(false)
  })

  it('returns false for #window (real station id → bypass)', () => {
    expect(shouldShowPrologue('#window')).toBe(false)
  })

  it('returns false for #about (real station id → bypass)', () => {
    expect(shouldShowPrologue('#about')).toBe(false)
  })

  it('returns true for #xyz-unknown (garbage hash → still show)', () => {
    expect(shouldShowPrologue('#xyz-unknown')).toBe(true)
  })
})

// ── resolveSnapMode ───────────────────────────────────────────────────────────

describe('resolveSnapMode', () => {
  it('returns proximity when no reduced motion and no ?prologue=static', () => {
    expect(resolveSnapMode(false, '')).toBe('proximity')
  })

  it('returns static when reduced motion is true', () => {
    expect(resolveSnapMode(true, '')).toBe('static')
  })

  it('returns static when ?prologue=static query param is set', () => {
    expect(resolveSnapMode(false, '?prologue=static')).toBe('static')
  })

  it('returns static when both reduced motion and ?prologue=static', () => {
    expect(resolveSnapMode(true, '?prologue=static')).toBe('static')
  })
})

// ── usePrologueGate (integration via component) ───────────────────────────────

import { usePrologueGate } from '@/prologue/usePrologueGate'

function GateProbe() {
  const { showPrologue, snapMode } = usePrologueGate()
  return (
    <div>
      <span data-testid="show">{String(showPrologue)}</span>
      <span data-testid="snap">{snapMode}</span>
    </div>
  )
}

describe('usePrologueGate', () => {
  afterEach(() => {
    __setReducedMotion(false)
  })

  it('returns snapMode=static when reduced motion is enabled', () => {
    __setReducedMotion(true)
    render(<GateProbe />)
    expect(screen.getByTestId('snap').textContent).toBe('static')
  })

  it('returns snapMode=proximity by default (no reduced motion)', () => {
    render(<GateProbe />)
    expect(screen.getByTestId('snap').textContent).toBe('proximity')
  })
})
