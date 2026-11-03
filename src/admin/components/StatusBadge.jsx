import { Clock3, CheckCircle2, XCircle } from 'lucide-react'

const statusMap = {
  pending_review: { label: 'Em análise', className: 'bg-amber-50 text-amber-700 ring-amber-200', Icon: Clock3 },
  approved: { label: 'Aprovado', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200', Icon: CheckCircle2 },
  rejected: { label: 'Rejeitado', className: 'bg-rose-50 text-rose-700 ring-rose-200', Icon: XCircle },
}

export function getStatusLabel(status) {
  return statusMap[status]?.label || 'Não informado'
}

export default function StatusBadge({ status }) {
  const config = statusMap[status] || statusMap.pending_review
  const { Icon } = config
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.className}`}>
      <Icon size={13} />{config.label}
    </span>
  )
}
