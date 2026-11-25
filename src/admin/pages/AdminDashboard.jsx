
import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  PawPrint,
  RefreshCw,
  XCircle,
  Users,
  Heart,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api'

const statusInfo = {
  pending_review: {
    label: 'Em análise',
    className: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-400',
  },
  approved: {
    label: 'Aprovado',
    className: 'bg-[#FCE2ED] text-[#A63C70] border-[#F4C9DA]',
    dot: 'bg-[#D94D91]',
  },
  rejected: {
    label: 'Rejeitado',
    className: 'bg-rose-50 text-rose-700 border-rose-100',
    dot: 'bg-rose-400',
  },
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
}) {
  const tones = {
    pink: {
      icon: 'bg-[#FCE2ED] text-[#D94D91]',
      accent: 'bg-[#D94D91]',
    },
    amber: {
      icon: 'bg-amber-50 text-amber-600',
      accent: 'bg-amber-400',
    },
    brown: {
      icon: 'bg-[#FFF1E9] text-[#8B5A49]',
      accent: 'bg-[#8B5A49]',
    },
    rose: {
      icon: 'bg-rose-50 text-rose-600',
      accent: 'bg-rose-400',
    },
  }

  const selectedTone = tones[tone] || tones.pink

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#f0e3dd] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div
        className={`absolute left-0 top-0 h-1 w-full ${selectedTone.accent} opacity-70`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#927B72]">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-[#593A31]">
            {value}
          </p>
        </div>

        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition group-hover:scale-105 ${selectedTone.icon}`}
        >
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-3 text-xs text-[#A18D85]">
        {description}
      </p>
    </div>
  )
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(date)
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadDashboard() {
    setLoading(true)
    setError('')

    try {
      const [overview, latest] = await Promise.all([
        adminApi.getReportOverview(),
        adminApi.getRegistrations({ page: 1, limit: 6 }),
      ])

      setStats(
        overview.data?.totals || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        }
      )

      setRecent(latest.data || [])
    } catch (err) {
      setError(
        err.message || 'Não foi possível carregar os indicadores.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  return (
    <div className="min-h-full space-y-7">

      {/* Boas-vindas e cabeçalho */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FCE2ED] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A63C70]">
            <Sparkles size={14} />
            Resumo operacional
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#593A31] sm:text-3xl">
            Visão geral
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#927B72]">
            Acompanhe os cadastros, os indicadores e a situação
            dos pets do Recanto da Dinda.
          </p>
        </div>

        <button
          type="button"
          title="Atualizar os indicadores e os cadastros recentes"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#eadbd5] bg-white px-4 py-2.5 text-sm font-semibold text-[#593A31] shadow-sm transition hover:border-[#D94D91]/40 hover:bg-[#FFF8F3] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Atualizar dados
        </button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>

          <button
            type="button"
            title="Recarregar os dados do dashboard"
            onClick={loadDashboard}
            className="font-semibold underline underline-offset-4"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Indicadores */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-[#D94D91]" />

          <h2 className="text-sm font-bold text-[#593A31]">
            Indicadores dos cadastros
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total de pets"
            value={loading ? '—' : stats.total}
            description="Cadastros recebidos"
            icon={PawPrint}
            tone="pink"
          />

          <StatCard
            title="Em análise"
            value={loading ? '—' : stats.pending}
            description="Aguardando avaliação da equipe"
            icon={Clock3}
            tone="amber"
          />

          <StatCard
            title="Aprovados"
            value={loading ? '—' : stats.approved}
            description="Cadastros aprovados"
            icon={CheckCircle2}
            tone="brown"
          />

          <StatCard
            title="Rejeitados"
            value={loading ? '—' : stats.rejected}
            description="Cadastros não aprovados"
            icon={XCircle}
            tone="rose"
          />
        </div>
      </section>

      {/* Cadastros recentes */}
      <section className="overflow-hidden rounded-2xl border border-[#f0e3dd] bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b border-[#f0e3dd] bg-[#FFFCFA] px-5 py-5 sm:flex-row sm:items-center md:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
                <Users size={18} />
              </div>

              <h2 className="font-bold text-[#593A31]">
                Cadastros recentes
              </h2>
            </div>

            <p className="mt-2 text-xs text-[#927B72]">
              Últimos pets enviados para avaliação
            </p>
          </div>

          <Link
            title="Consultar todos os cadastros"
            to="/admin/cadastros"
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#F4C9DA] bg-[#FCE2ED]/60 px-3.5 py-2 text-sm font-semibold text-[#A63C70] transition hover:bg-[#FCE2ED]"
          >
            Ver todos
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
              <RefreshCw size={19} className="animate-spin" />
            </div>

            <p className="text-sm text-[#927B72]">
              Carregando cadastros...
            </p>
          </div>
        ) : recent.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#FFF8F3] text-[#D8B8AA]">
              <PawPrint size={30} />
            </div>

            <h3 className="mt-4 font-bold text-[#593A31]">
              Nenhum cadastro encontrado
            </h3>

            <p className="mt-1 text-sm text-[#927B72]">
              Quando um tutor cadastrar um pet, ele aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">

              <thead className="bg-[#FFF8F3] text-[11px] uppercase tracking-wider text-[#A18D85]">
                <tr>
                  <th className="px-6 py-4 font-bold">
                    Pet
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Tutor
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Data
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>

                  <th className="px-6 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f4ebe6]">
                {recent.map(pet => {
                  const status =
                    statusInfo[pet.status] || statusInfo.pending_review

                  return (
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
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tutor */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#806B63]">
                          {pet.guardian?.name || '—'}
                        </p>

                        <p className="mt-0.5 text-xs text-[#A18D85]">
                          {pet.guardian?.email || ''}
                        </p>
                      </td>

                      {/* Data */}
                      <td className="px-6 py-4 text-[#806B63]">
                        {formatDate(pet.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                      </td>

                      {/* Ação */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          title={`Abrir ficha de ${pet.name || 'pet'}`}
                          to={`/admin/cadastros/${pet._id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-bold text-[#A63C70] transition hover:bg-[#FCE2ED]"
                        >
                          Detalhes
                          <ArrowUpRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé */}
        {!loading && recent.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-[#f0e3dd] bg-[#FFFCFA] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#A18D85]">
              Exibindo os últimos {recent.length} cadastros
            </p>

            <Link
              to="/admin/cadastros"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#A63C70] hover:underline"
            >
              Acessar todos os cadastros
              <ArrowUpRight size={13} />
            </Link>
          </div>
        )}
      </section>

      {/* Mensagem institucional */}
      <div className="flex items-center gap-3 rounded-2xl border border-[#F4C9DA]/70 bg-gradient-to-r from-[#FFF1F6] to-[#FFF8F3] p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#D94D91] shadow-sm">
          <Heart size={19} />
        </div>

        <div>
          <p className="text-sm font-bold text-[#593A31]">
            Cuidado e carinho em cada detalhe
          </p>

          <p className="mt-0.5 text-xs leading-5 text-[#927B72]">
            Cada cadastro representa uma nova história fazendo parte do Recanto da Dinda.
          </p>
        </div>
      </div>
    </div>
  )
}
