import type { ReactNode } from 'react'

/**
 * The shared 1280×960 chart sheet every Atlas screen renders on.
 *
 * `chart` variant (Plates I–VII, IV·Detail, Gazetteer): survey grid, double
 * gold frame (insets 34/42), tick strips top+bottom, content inset 42px.
 * `hero` variant (Home, Colophon): brighter survey grid + radial vignette,
 * no frame; content fills the sheet.
 *
 * The `data-screen-label` attribute is the hook for entrance animations and
 * visual-diff tooling — it mirrors the design reference exactly.
 */
interface PlateSheetProps {
  label: string
  variant?: 'chart' | 'hero'
  /**
   * Content-box classes. Chart default is the canonical `padding:42px 54px`;
   * dense plates pass e.g. `px-[54px] py-[38px]` (IV·Detail) or
   * `px-[54px] py-[40px]` (V–VII). Hero screens own their padding entirely.
   */
  contentClassName?: string
  children: ReactNode
}

export function PlateSheet({
  label,
  variant = 'chart',
  contentClassName,
  children,
}: PlateSheetProps) {
  const isHero = variant === 'hero'
  return (
    <div
      data-screen-label={label}
      className="relative h-[960px] w-[1280px] overflow-hidden rounded-[3px] bg-sheet shadow-sheet"
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${isHero ? 'survey-grid-bright' : 'survey-grid'}`}
      />
      {isHero ? (
        <div aria-hidden="true" className="hero-vignette absolute inset-0" />
      ) : (
        <>
          <div aria-hidden="true" className="absolute inset-[34px] border border-gold/50" />
          <div aria-hidden="true" className="absolute inset-[42px] border border-gold/22" />
          <div
            aria-hidden="true"
            className="tick-strip absolute top-[42px] right-[42px] left-[42px]"
          />
          <div
            aria-hidden="true"
            className="tick-strip absolute right-[42px] bottom-[42px] left-[42px]"
          />
        </>
      )}
      <div
        className={`absolute flex flex-col ${
          isHero
            ? `inset-0 ${contentClassName ?? 'px-[54px] pt-[42px] pb-[38px]'}`
            : `inset-[42px] ${contentClassName ?? 'px-[54px] py-[42px]'}`
        }`}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Canonical plate title row: plate number · italic Fraunces title · subject tag,
 * on a gold hairline. Title size varies 28–30px per plate; pass `titleClassName`
 * to override the default 30px.
 */
interface PlateTitleRowProps {
  no: string
  title: string
  subject: string
  titleClassName?: string
  className?: string
}

export function PlateTitleRow({
  no,
  title,
  subject,
  titleClassName = 'text-[30px]',
  className = 'pb-[20px]',
}: PlateTitleRowProps) {
  return (
    <div className={`flex items-baseline justify-between border-b border-gold/30 ${className}`}>
      <span className="font-mono text-[12px] font-medium tracking-[.2em] whitespace-nowrap text-gold">
        {no}
      </span>
      <span className={`font-display font-medium text-ink-display italic ${titleClassName}`}>
        {title}
      </span>
      <span className="font-mono text-[12px] font-medium tracking-[.2em] whitespace-nowrap text-ink-muted">
        {subject}
      </span>
    </div>
  )
}

/** Centered lede paragraph under the title row. */
interface PlateLedeProps {
  className?: string
  children: ReactNode
}

export function PlateLede({ className = 'mt-[18px] max-w-[660px]', children }: PlateLedeProps) {
  return (
    <p
      className={`mx-auto text-center font-body text-[14px] leading-[1.55] text-ink-body ${className}`}
    >
      {children}
    </p>
  )
}

/** Canonical footer credits row. Border/padding vary per plate via className. */
interface PlateFooterProps {
  left: ReactNode
  right: ReactNode
  className?: string
}

export function PlateFooter({
  left,
  right,
  className = 'border-t border-gold/30 pt-[18px]',
}: PlateFooterProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="font-mono text-[11px] tracking-[.12em] text-ink-muted">{left}</span>
      <span className="font-mono text-[11px] tracking-[.12em] text-ink-soft">{right}</span>
    </div>
  )
}
