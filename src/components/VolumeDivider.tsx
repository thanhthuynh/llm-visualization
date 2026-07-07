/**
 * Volume divider that sits between section groups in the scroll column:
 * hairline — centered gold mono label — hairline. The negative bottom margin
 * tightens the column's 36px gap beneath it, matching the design reference.
 */
interface VolumeDividerProps {
  label: string
}

export function VolumeDivider({ label }: VolumeDividerProps) {
  return (
    <div aria-hidden="true" className="mt-[10px] mb-[-16px] flex items-center gap-[18px]">
      <div className="flex-1 border-t border-gold/22" />
      <span className="font-mono text-[11px] font-medium tracking-[.3em] text-gold">{label}</span>
      <div className="flex-1 border-t border-gold/22" />
    </div>
  )
}
