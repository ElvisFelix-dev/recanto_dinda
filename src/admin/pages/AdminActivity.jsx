
import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  CalendarDays,
  RefreshCw,
  Search,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserRound,
  Clock3,
  Globe,
  FileSearch,
} from 'lucide-react'

import { adminApi } from '../../services/api'
import { useToast } from '../contexts/ToastContext'
import LoadingState from '../components/LoadingState'

const inputClass =
  'w-full rounded-xl border border-[#eadbd5] bg-white px-3.5 py-2.5 text-sm text-[#593A31] outline-none transition placeholder:text-[#b5a19a] focus:border-[#D94D91] focus:ring-4 focus:ring-[#F4C9DA]/40'

function dateTime(value) {
  if (!value) return '—'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
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

function entityLabel(entity = '') {
  const labels = {
    admin: 'Usuários',
    pet: 'Pets',
    report: 'Relatórios',
  }

  return labels[entity] || entity || 'Evento'
}

export default function AdminActivity() {
  const { showToast } = useToast()

  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    entity: '',
    from: '',
    to: '',
  })

  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)

    try {
      const response = await adminApi.getActivity({
        ...filters,
        page,
        limit: 25,
      })

      setItems(response.data || [])
      setPagination(
        response.pagination || {
          page,
          totalPages: 1,
          total: 0,
        }
      )
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Falha ao carregar atividades',
        message: error.message,
      })
    } finally {
      setLoading(false)
    }
  }, [filters, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  const updateFilter = (key, value) => {
    setPage(1)

    setFilters(current => ({
      ...current,
      [key]: value,
    }))
  }

  const totalPages = Math.max(1, pagination.totalPages || 1)

  return (
    <div className="min-h-full space-y-6">

      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FCE2ED] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A63C70]">
            <ShieldCheck size={14} />
            Segurança e transparência
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#593A31] sm:text-3xl">
            Histórico de atividades
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#927B72]">
            Acompanhe as ações realizadas na área administrativa e
            mantenha o controle das operações do Recanto da Dinda.
          </p>
        </div>

        <button
          type="button"
          title="Atualizar histórico"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadbd5] bg-white px-4 py-2.5 text-sm font-semibold text-[#593A31] shadow-sm transition hover:border-[#D94D91]/40 hover:bg-[#FFF8F3] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Atualizar
        </button>
      </div>

      {/* Indicadores */}
      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-[#f0e3dd] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
              <Activity size={21} />
            </div>

            <span className="rounded-full bg-[#FFF8F3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#927B72]">
              Auditoria
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold tracking-tight text-[#593A31]">
            {pagination.total}
          </p>

          <p className="mt-1 text-sm text-[#927B72]">
            Registros encontrados
          </p>
        </div>

        <div className="rounded-2xl border border-[#f0e3dd] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F4C9DA]/50 text-[#A63C70]">
              <ShieldCheck size={21} />
            </div>

            <span className="rounded-full bg-[#FCE2ED] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A63C70]">
              Segurança
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-[#593A31]">
            Auditoria
          </p>

          <p className="mt-1 text-sm text-[#927B72]">
            Ações administrativas rastreáveis
          </p>
        </div>
      </div>

      {/* Histórico */}
      <section className="overflow-hidden rounded-2xl border border-[#f0e3dd] bg-white shadow-sm">

        {/* Filtros */}
        <div className="border-b border-[#f0e3dd] bg-[#FFFCFA] p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-[#593A31]">
              Filtrar atividades
            </h2>

            <p className="mt-1 text-xs text-[#927B72]">
              Pesquise por ações, entidades ou período.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b5a19a]"
              />

              <input
                aria-label="Pesquisar no histórico"
                placeholder="Pesquisar atividade..."
                value={filters.search}
                onChange={event =>
                  updateFilter('search', event.target.value)
                }
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              aria-label="Filtrar entidade"
              value={filters.entity}
              onChange={event =>
                updateFilter('entity', event.target.value)
              }
              className={inputClass}
            >
              <option value="">Todas as entidades</option>
              <option value="admin">Usuários</option>
              <option value="pet">Pets</option>
              <option value="report">Relatórios</option>
            </select>

            <label className="flex min-w-0 items-center gap-2 rounded-xl border border-[#eadbd5] bg-white px-3 transition focus-within:border-[#D94D91] focus-within:ring-4 focus-within:ring-[#F4C9DA]/40">
              <CalendarDays
                size={16}
                className="shrink-0 text-[#D94D91]"
              />

              <input
                aria-label="Data inicial"
                type="date"
                value={filters.from}
                onChange={event =>
                  updateFilter('from', event.target.value)
                }
                className="min-w-0 w-full bg-transparent py-2.5 text-sm text-[#593A31] outline-none"
              />
            </label>

            <label className="flex min-w-0 items-center gap-2 rounded-xl border border-[#eadbd5] bg-white px-3 transition focus-within:border-[#D94D91] focus-within:ring-4 focus-within:ring-[#F4C9DA]/40">
              <CalendarDays
                size={16}
                className="shrink-0 text-[#D94D91]"
              />

              <input
                aria-label="Data final"
                type="date"
                value={filters.to}
                onChange={event =>
                  updateFilter('to', event.target.value)
                }
                className="min-w-0 w-full bg-transparent py-2.5 text-sm text-[#593A31] outline-none"
              />
            </label>

          </div>
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div className="p-8">
            <LoadingState label="Carregando histórico..." />
          </div>
        ) : items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#FFF8F3] text-[#D8B8AA]">
              <FileSearch size={30} />
            </div>

            <h3 className="mt-4 font-bold text-[#593A31]">
              Nenhuma atividade encontrada
            </h3>

            <p className="mt-1 text-sm text-[#927B72]">
              Não há registros para os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f4ebe6]">

            {items.map(item => (
              <article
                key={item._id}
                className="flex gap-3 px-5 py-5 transition hover:bg-[#FFFCFA] sm:gap-4"
              >
                <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
                  <Activity size={18} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-[#593A31]">
                      {labelAction(item.action)}
                    </h2>

                    <span className="rounded-full bg-[#FFF1F6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#A63C70]">
                      {entityLabel(item.entity)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-[#806B63]">
                    {item.description || 'Atividade registrada.'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#A18D85]">

                    <span className="inline-flex items-center gap-1.5">
                      <UserRound size={13} />
                      {item.actorName || 'Sistema'}
                      {item.actorEmail && ` · ${item.actorEmail}`}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={13} />
                      {dateTime(item.createdAt)}
                    </span>

                    {item.ip && (
                      <span className="inline-flex items-center gap-1.5">
                        <Globe size={13} />
                        IP: {item.ip}
                      </span>
                    )}

                  </div>
                </div>
              </article>
            ))}

          </div>
        )}

        {/* Paginação */}
        <div className="flex flex-col gap-3 border-t border-[#f0e3dd] bg-[#FFFCFA] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-[#927B72]">
            <strong className="text-[#593A31]">
              {pagination.total}
            </strong>{' '}
            atividade(s) encontrada(s)
          </p>

          <div className="flex items-center justify-between gap-3 sm:justify-end">

            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage(value => value - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#eadbd5] bg-white px-3 py-2 text-xs font-semibold text-[#593A31] transition hover:bg-[#FCE2ED] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Anterior
            </button>

            <span className="whitespace-nowrap text-xs font-medium text-[#927B72]">
              Página{' '}
              <strong className="text-[#593A31]">{page}</strong>
              {' '}de{' '}
              <strong className="text-[#593A31]">{totalPages}</strong>
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(value => value + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#eadbd5] bg-white px-3 py-2 text-xs font-semibold text-[#593A31] transition hover:bg-[#FCE2ED] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
              <ChevronRight size={14} />
            </button>

          </div>
        </div>
      </section>
    </div>
  )
}
