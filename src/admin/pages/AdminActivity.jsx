import { useCallback, useEffect, useState } from 'react'
import { Activity, CalendarDays, RefreshCw, Search, ShieldCheck } from 'lucide-react'
import { adminApi } from '../../services/api'
import { useToast } from '../contexts/ToastContext'
import LoadingState from '../components/LoadingState'

const inputClass = 'rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#6b9a7d] focus:ring-4 focus:ring-emerald-50'
function dateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
function labelAction(action = '') {
  const labels = {
    'auth.login': 'Login realizado',
    'admin.created': 'Usuário criado',
    'admin.updated': 'Usuário atualizado',
    'admin.password_changed': 'Senha alterada',
    'pet.status.approved': 'Pet aprovado',
    'pet.status.rejected': 'Cadastro rejeitado',
    'pet.status.pending_review': 'Retornado para análise',
    'pet.avatar.updated': 'Foto do pet atualizada',
    'pet.avatar.removed': 'Foto do pet removida',
    'report.exported': 'Relatório exportado',
  }
  return labels[action] || action.replaceAll('.', ' ')
}
export default function AdminActivity() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ search: '', entity: '', from: '', to: '' })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.getActivity({ ...filters, page, limit: 25 })
      setItems(response.data || [])
      setPagination(response.pagination || { page, totalPages: 1, total: 0 })
    } catch (error) {
      showToast({ type: 'error', title: 'Falha ao carregar atividades', message: error.message })
    } finally { setLoading(false) }
  }, [filters, page, showToast])
  useEffect(() => { load() }, [load])

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#54816b]">Segurança e transparência</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Histórico de atividades</h1><p className="mt-2 text-sm text-slate-500">Acompanhe as ações realizadas na área administrativa.</p></div><button title="Atualizar histórico" onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><RefreshCw size={16}/>Atualizar</button></div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-slate-100 bg-white p-5"><Activity className="text-[#54816b]" size={20}/><p className="mt-3 text-2xl font-bold text-slate-900">{pagination.total}</p><p className="text-xs text-slate-500">Registros encontrados</p></div><div className="rounded-2xl border border-slate-100 bg-white p-5"><ShieldCheck className="text-sky-600" size={20}/><p className="mt-3 text-2xl font-bold text-slate-900">Auditoria</p><p className="text-xs text-slate-500">Ações administrativas rastreáveis</p></div></div>
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="grid gap-3 border-b border-slate-100 p-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input aria-label="Pesquisar no histórico" placeholder="Pesquisar atividade..." value={filters.search} onChange={event => { setPage(1); setFilters(current => ({ ...current, search: event.target.value })) }} className={`${inputClass} w-full pl-9`}/></div>
        <select aria-label="Filtrar entidade" value={filters.entity} onChange={event => { setPage(1); setFilters(current => ({ ...current, entity: event.target.value })) }} className={inputClass}><option value="">Todas as entidades</option><option value="admin">Usuários</option><option value="pet">Pets</option><option value="report">Relatórios</option></select>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3"><CalendarDays size={15} className="text-slate-400"/><input aria-label="Data inicial" type="date" value={filters.from} onChange={event => { setPage(1); setFilters(current => ({ ...current, from: event.target.value })) }} className="min-w-0 flex-1 py-2 text-sm outline-none"/></label>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3"><CalendarDays size={15} className="text-slate-400"/><input aria-label="Data final" type="date" value={filters.to} onChange={event => { setPage(1); setFilters(current => ({ ...current, to: event.target.value })) }} className="min-w-0 flex-1 py-2 text-sm outline-none"/></label>
      </div>
      {loading ? <LoadingState label="Carregando histórico..."/> : items.length === 0 ? <div className="p-12 text-center"><Activity className="mx-auto text-slate-300" size={32}/><p className="mt-3 font-semibold text-slate-600">Nenhuma atividade encontrada</p><p className="mt-1 text-sm text-slate-400">Não há registros para os filtros selecionados.</p></div> : <div className="divide-y divide-slate-100">{items.map(item => <article key={item._id} className="flex gap-4 px-5 py-5 transition hover:bg-slate-50/60"><div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf4ef] text-[#54816b]"><Activity size={18}/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold text-slate-800">{labelAction(item.action)}</h2><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item.entity || 'evento'}</span></div><p className="mt-1 text-sm leading-6 text-slate-600">{item.description || 'Atividade registrada.'}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400"><span>{item.actorName || 'Sistema'}{item.actorEmail ? ` · ${item.actorEmail}` : ''}</span><span>{dateTime(item.createdAt)}</span>{item.ip && <span>IP: {item.ip}</span>}</div></div></article>)}</div>}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4"><p className="text-xs text-slate-400">{pagination.total} atividade(s)</p><div className="flex items-center gap-3"><button disabled={page <= 1 || loading} onClick={() => setPage(value => value - 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40">Anterior</button><span className="text-xs text-slate-500">Página {page} de {Math.max(1, pagination.totalPages || 1)}</span><button disabled={page >= (pagination.totalPages || 1) || loading} onClick={() => setPage(value => value + 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40">Próxima</button></div></div>
    </section>
  </div>
}
