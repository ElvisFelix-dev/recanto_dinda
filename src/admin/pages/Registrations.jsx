
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  PawPrint,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

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

const inputClass =
  'w-full rounded-xl border border-[#eadbd5] bg-white px-3.5 py-3 text-sm text-[#593A31] outline-none transition placeholder:text-[#b5a19a] focus:border-[#D94D91] focus:ring-4 focus:ring-[#F4C9DA]/40'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  }).format(date)
}

export default function Registrations() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  })

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
      const result = await adminApi.getRegistrations({
        page,
        limit: PAGE_SIZE,
        search,
        status,
      })

      setItems(Array.isArray(result.data) ? result.data : [])

      setPagination(
        result.pagination || {
          page,
          total: 0,
          totalPages: 1,
        }
      )
    } catch (err) {
      setError(
        err.message || 'Não foi possível carregar os cadastros.'
      )
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => {
    loadRegistrations()
  }, [loadRegistrations])

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

  const firstItem = pagination.total
    ? (pagination.page - 1) * PAGE_SIZE + 1
    : 0

  const lastItem = Math.min(
    pagination.page * PAGE_SIZE,
    pagination.total || 0
  )

  const totalPages = Math.max(1, pagination.totalPages || 1)

  const activeFilters = [
    search && `Busca: ${search}`,
    status &&
      `Status: ${
        statusOptions.find(item => item.value === status)?.label
      }`,
  ].filter(Boolean)

  return (
    <div className="min-h-full space-y-6">

      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FCE2ED] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A63C70]">
            <PawPrint size={14} />
            Gestão de animais
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#593A31] sm:text-3xl">
            Cadastros de pets
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#927B72]">
            Consulte os cadastros recebidos e acompanhe a avaliação
            de cada animal do Recanto da Dinda.
          </p>
        </div>

        <button
          type="button"
          title="Atualizar a lista de cadastros"
          onClick={loadRegistrations}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#eadbd5] bg-white px-4 py-2.5 text-sm font-semibold text-[#593A31] shadow-sm transition hover:border-[#D94D91]/40 hover:bg-[#FFF8F3] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <section className="rounded-2xl border border-[#f0e3dd] bg-white p-5 shadow-sm">

        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
            <SlidersHorizontal size={18} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#593A31]">
              Filtros de pesquisa
            </h2>

            <p className="mt-0.5 text-xs text-[#927B72]">
              Encontre rapidamente o cadastro que procura.
            </p>
          </div>
        </div>

        <form
          onSubmit={submitSearch}
          className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto_auto]"
        >
          {/* Pesquisa */}
          <label className="relative block">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b5a19a]"
            />

            <input
              title="Pesquisar por nome do pet, tutor, e-mail ou CPF"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder="Buscar por pet, tutor, e-mail ou CPF..."
              className={`${inputClass} pl-10`}
            />
          </label>

          {/* Status */}
          <select
            title="Filtrar cadastros por status"
            value={status}
            onChange={event => {
              setStatus(event.target.value)
              setPage(1)
            }}
            className={inputClass}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Pesquisar */}
          <button
            title="Aplicar pesquisa e filtros"
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D94D91] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-[#D94D91]/20 transition hover:bg-[#bd3d7b]"
          >
            <Search size={16} />
            Pesquisar
          </button>

          {/* Limpar */}
          <button
            title="Limpar pesquisa e filtros"
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#eadbd5] px-4 py-3 text-sm font-semibold text-[#806B63] transition hover:bg-[#FFF8F3] hover:text-[#593A31]"
          >
            <X size={15} />
            Limpar
          </button>
        </form>

        {/* Resumo dos filtros */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f4ebe6] pt-4">
          <span className="text-xs text-[#927B72]">
            <strong className="text-[#593A31]">
              {pagination.total || 0}
            </strong>{' '}
            cadastro(s) encontrado(s)
          </span>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#A18D85]">
                Filtros ativos:
              </span>

              {activeFilters.map(filter => (
                <span
                  key={filter}
                  className="rounded-full border border-[#F4C9DA] bg-[#FFF1F6] px-2.5 py-1 text-[10px] font-bold text-[#A63C70]"
                >
                  {filter}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Erro */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>

          <button
            type="button"
            title="Atualizar a lista de cadastros"
            onClick={loadRegistrations}
            className="font-semibold underline underline-offset-4"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Tabela de cadastros */}
      <section className="overflow-hidden rounded-2xl border border-[#f0e3dd] bg-white shadow-sm">

        {/* Cabeçalho da tabela */}
        <div className="flex flex-col justify-between gap-3 border-b border-[#f0e3dd] bg-[#FFFCFA] px-5 py-5 sm:flex-row sm:items-center md:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
                <PawPrint size={18} />
              </div>

              <h2 className="font-bold text-[#593A31]">
                Todos os cadastros
              </h2>
            </div>

            <p className="mt-2 text-xs text-[#927B72]">
              Informações enviadas pelos tutores
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[#F4C9DA] bg-[#FFF1F6] px-3 py-1.5 text-xs font-bold text-[#A63C70] sm:flex">
            <PawPrint size={14} />
            Recanto da Dinda
          </div>
        </div>

        {/* Carregamento */}
        {loading ? (
          <div className="p-8">
            <LoadingState label="Buscando cadastros..." />
          </div>
        ) : items.length === 0 ? (
          /* Estado vazio */
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#FFF8F3] text-[#D8B8AA]">
              <PawPrint size={28} />
            </div>

            <h3 className="mt-4 font-bold text-[#593A31]">
              Nenhum cadastro encontrado
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#927B72]">
              Tente alterar os filtros ou aguarde um novo cadastro
              de pet.
            </p>

            {(search || status) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FCE2ED] px-4 py-2.5 text-sm font-bold text-[#A63C70] transition hover:bg-[#F4C9DA]"
              >
                <X size={15} />
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">

                <thead className="bg-[#FFF8F3] text-[11px] uppercase tracking-wider text-[#A18D85]">
                  <tr>
                    <th className="px-6 py-4 font-bold">
                      Pet
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Tutor responsável
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Contato
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Recebido em
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-bold">
                      Ação
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f4ebe6]">
                  {items.map(pet => (
                    <tr
                      key={pet._id}
                      className="transition hover:bg-[#FFFCFA]"
                    >
                      {/* Pet */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#f0e3dd] bg-[#FFF8F3]">
                            {pet.avatar?.url ? (
                              <img
                                src={pet.avatar.url}
                                alt={`Foto de ${pet.name}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[#D94D91]">
                                <PawPrint size={19} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-[#593A31]">
                              {pet.name || 'Pet sem nome'}
                            </p>

                            <p className="mt-0.5 text-xs text-[#A18D85]">
                              {pet.breed || 'Raça não informada'}

                              {pet.sex
                                ? ` · ${
                                    pet.sex === 'female'
                                      ? 'Fêmea'
                                      : 'Macho'
                                  }`
                                : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tutor */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#593A31]">
                          {pet.guardian?.name || '—'}
                        </p>

                        <p className="mt-0.5 text-xs text-[#A18D85]">
                          {pet.guardian?.cpf || ''}
                        </p>
                      </td>

                      {/* Contato */}
                      <td className="px-6 py-4">
                        <p className="text-[#806B63]">
                          {pet.guardian?.phone || '—'}
                        </p>

                        <p className="mt-0.5 max-w-[190px] truncate text-xs text-[#A18D85]">
                          {pet.guardian?.email || ''}
                        </p>
                      </td>

                      {/* Data */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#806B63]">
                          <CalendarDays
                            size={14}
                            className="text-[#D94D91]"
                          />
                          {formatDate(pet.createdAt)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={pet.status} />
                      </td>

                      {/* Ação */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          title={`Abrir ficha de ${pet.name || 'pet'}`}
                          to={`/admin/cadastros/${pet._id}`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#F4C9DA] bg-white px-3 py-2 text-xs font-bold text-[#A63C70] transition hover:bg-[#FCE2ED]"
                        >
                          <Eye size={14} />
                          Ver cadastro
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex flex-col gap-3 border-t border-[#f0e3dd] bg-[#FFFCFA] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">

              <p className="text-xs text-[#927B72]">
                Exibindo{' '}
                <strong className="text-[#593A31]">
                  {firstItem}–{lastItem}
                </strong>{' '}
                de{' '}
                <strong className="text-[#593A31]">
                  {pagination.total}
                </strong>{' '}
                cadastros
              </p>

              <div className="flex items-center justify-between gap-2 sm:justify-end">

                <button
                  type="button"
                  title="Ir para a página anterior"
                  onClick={() =>
                    setPage(current => Math.max(1, current - 1))
                  }
                  disabled={page <= 1 || loading}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#eadbd5] bg-white px-3 py-2 text-xs font-semibold text-[#593A31] transition hover:bg-[#FCE2ED] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Anterior
                </button>

                <span className="whitespace-nowrap px-2 text-xs font-medium text-[#927B72]">
                  Página{' '}
                  <strong className="text-[#593A31]">
                    {pagination.page || page}
                  </strong>{' '}
                  de{' '}
                  <strong className="text-[#593A31]">
                    {totalPages}
                  </strong>
                </span>

                <button
                  type="button"
                  title="Ir para a próxima página"
                  onClick={() => setPage(current => current + 1)}
                  disabled={page >= totalPages || loading}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#eadbd5] bg-white px-3 py-2 text-xs font-semibold text-[#593A31] transition hover:bg-[#FCE2ED] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próxima
                  <ChevronRight size={15} />
                </button>

              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
