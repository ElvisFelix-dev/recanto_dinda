import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, Eye, PawPrint, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react'
import { adminApi } from '../../services/api'
import StatusBadge from '../components/StatusBadge'
import LoadingState from '../components/LoadingState'

const PAGE_SIZE = 10
const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'pending_review', label: 'Em análise' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'rejected', label: 'Rejeitados' },
]

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date)
}

export default function Registrations() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRegistrations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await adminApi.getRegistrations({ page, limit: PAGE_SIZE, search, status })
      setItems(Array.isArray(result.data) ? result.data : [])
      setPagination(result.pagination || { page, total: 0, totalPages: 1 })
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os cadastros.')
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => { loadRegistrations() }, [loadRegistrations])

  function submitSearch(event) {
    event.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  function clearFilters() {
    setSearchInput('')
    setSearch('')
    setStatus('')
    setPage(1)
  }

  const firstItem = pagination.total ? (pagination.page - 1) * PAGE_SIZE + 1 : 0
  const lastItem = Math.min(pagination.page * PAGE_SIZE, pagination.total || 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#54816b]">GESTÃO DE ANIMAIS</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Cadastros de pets</h1>
          <p className="mt-2 text-sm text-slate-500">Consulte os cadastros recebidos e acompanhe a avaliação de cada animal.</p>
        </div>
        <button title="Atualizar a lista de cadastros" onClick={loadRegistrations} disabled={loading} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />Atualizar</button>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/40 md:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700"><SlidersHorizontal size={17} className="text-[#54816b]" />Filtros de pesquisa</div>
        <form onSubmit={submitSearch} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto_auto]">
          <label className="relative block"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input title="Pesquisar por nome do pet, tutor, e-mail ou CPF" value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Buscar por pet, tutor, e-mail ou CPF..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#6b9a7d] focus:bg-white focus:ring-4 focus:ring-emerald-50" /></label>
          <select title="Filtrar cadastros por status" value={status} onChange={event => { setStatus(event.target.value); setPage(1) }} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none focus:border-[#6b9a7d] focus:ring-4 focus:ring-emerald-50">{statusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          <button title="Aplicar pesquisa e filtros" type="submit" className="rounded-xl bg-[#286247] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4e37]">Pesquisar</button>
          <button title="Limpar pesquisa e filtros" type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"><X size={15} />Limpar</button>
        </form>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400"><span>{pagination.total || 0} cadastro(s) encontrado(s)</span>{(search || status) && <span>Filtros ativos: {[search && `Busca: ${search}`, status && `Status: ${statusOptions.find(item => item.value === status)?.label}`].filter(Boolean).join(' · ')}</span>}</div>
      </section>

      {error && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"><span>{error}</span><button title="Atualizar a lista de cadastros" onClick={loadRegistrations} className="font-semibold underline">Tentar novamente</button></div>}

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/40">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6"><div><h2 className="font-bold text-slate-900">Todos os cadastros</h2><p className="mt-1 text-xs text-slate-400">Informações enviadas pelos tutores</p></div><div className="hidden items-center gap-2 rounded-full bg-[#edf4ef] px-3 py-1.5 text-xs font-semibold text-[#286247] sm:flex"><PawPrint size={14} />Recanto da Dinda</div></div>
        {loading ? <LoadingState label="Buscando cadastros..." /> : items.length === 0 ? <div className="px-6 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#edf4ef] text-[#54816b]"><PawPrint size={26} /></div><h3 className="mt-4 font-bold text-slate-800">Nenhum cadastro encontrado</h3><p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Tente alterar os filtros ou aguarde um novo cadastro de pet.</p></div> : <>
          <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3.5 font-semibold">Pet</th><th className="px-6 py-3.5 font-semibold">Tutor responsável</th><th className="px-6 py-3.5 font-semibold">Contato</th><th className="px-6 py-3.5 font-semibold">Recebido em</th><th className="px-6 py-3.5 font-semibold">Status</th><th className="px-6 py-3.5 text-right font-semibold">Ação</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map(pet => <tr key={pet._id} className="transition hover:bg-[#f8faf8]"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#edf4ef] text-[#54816b]">{pet.avatar?.url ? <img src={pet.avatar.url} alt={`Foto de ${pet.name}`} className="h-full w-full object-cover"/> : <div className="grid h-full w-full place-items-center"><PawPrint size={18}/></div>}</div><div><p className="font-semibold text-slate-800">{pet.name || 'Pet sem nome'}</p><p className="mt-0.5 text-xs text-slate-400">{pet.breed || 'Raça não informada'}{pet.sex ? ` · ${pet.sex === 'female' ? 'Fêmea' : 'Macho'}` : ''}</p></div></div></td><td className="px-6 py-4"><p className="font-medium text-slate-700">{pet.guardian?.name || '—'}</p><p className="mt-0.5 text-xs text-slate-400">{pet.guardian?.cpf || ''}</p></td><td className="px-6 py-4"><p className="text-slate-600">{pet.guardian?.phone || '—'}</p><p className="mt-0.5 max-w-[190px] truncate text-xs text-slate-400">{pet.guardian?.email || ''}</p></td><td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 text-slate-500"><CalendarDays size={14} className="text-slate-400" />{formatDate(pet.createdAt)}</span></td><td className="px-6 py-4"><StatusBadge status={pet.status} /></td><td className="px-6 py-4 text-right"><Link title={`Abrir ficha de ${pet.name || 'pet'}`} to={`/admin/cadastros/${pet._id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7e5db] px-3 py-2 text-xs font-semibold text-[#286247] transition hover:bg-[#edf4ef]"><Eye size={14} />Ver cadastro</Link></td></tr>)}</tbody></table></div>
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"><p className="text-xs text-slate-400">Exibindo <span className="font-semibold text-slate-600">{firstItem}–{lastItem}</span> de <span className="font-semibold text-slate-600">{pagination.total}</span> cadastros</p><div className="flex items-center justify-between gap-2 sm:justify-end"><button title="Ir para a página anterior" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page <= 1 || loading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={15} />Anterior</button><span className="px-2 text-xs font-medium text-slate-500">Página {pagination.page || page} de {Math.max(1, pagination.totalPages || 1)}</span><button title="Ir para a próxima página" onClick={() => setPage(current => current + 1)} disabled={page >= (pagination.totalPages || 1) || loading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Próxima<ChevronRight size={15} /></button></div></div>
        </>}
      </section>
    </div>
  )
}
