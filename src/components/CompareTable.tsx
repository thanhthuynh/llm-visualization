import { ClaimTier } from './ClaimTier'
import type { Tier } from '@/data/compare.config'

interface CompareTableRow {
  label: string
  value: string
  tier: Tier
}

interface CompareTableProps {
  rows: ReadonlyArray<CompareTableRow>
  caption?: string
}

export function CompareTable({ rows, caption }: CompareTableProps) {
  return (
    <table
      {...(caption ? { 'aria-label': caption } : {})}
      className="w-full border-collapse font-body text-[13px]"
    >
      {caption && (
        <caption className="text-left text-text-muted text-[11px] pb-2">
          {caption}
        </caption>
      )}
      <tbody>
        {rows.map((r, i) => (
          <tr key={`${r.label}-${i}`} className="border-t border-border">
            <th
              scope="row"
              className="text-left px-2.5 py-2 font-semibold text-text-primary"
            >
              {r.label}
            </th>
            <td className="px-2.5 py-2 text-text-muted">{r.value}</td>
            <td className="px-2.5 py-2 text-right">
              <ClaimTier tier={r.tier} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
