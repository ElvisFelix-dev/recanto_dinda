import { useEffect, useState } from 'react'
import { ArrowUpRight, CheckCircle2, Clock3, PawPrint, RefreshCw, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api'

const statusInfo = {
  pending_review: { label: 'Em análise', className: 'bg-amber-50 text-amber-700' },
  approved: { label: 'Aprovado', className: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Rejeitado', className: 'bg-rose-50 text-rose-700' },
}

function StatCard({ title, value, description, icon: Icon, tone }) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-sky-50 text-sky-700', rose: 'bg-rose-50 text-rose-700',
  }
  return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/40"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p></div><div className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}><Icon size={21} /></div></div><p className="mt-3 text-xs text-slate-400">{description}</p></div>
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value))
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
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
      setStats(overview.data?.totals || { total: 0, pending: 0, approved: 0, rejected: 0 })
      setRecent(latest.data || [])
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os indicadores.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDashboard() }, [])

  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#54816b]">RESUMO OPERACIONAL</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Visão geral</h1><p className="mt-2 text-sm text-slate-500">Acompanhe os cadastros e a situação dos pets.</p></div><button title="Atualizar os indicadores e os cadastros recentes" onClick={loadDashboard} disabled={loading} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />Atualizar dados</button></div>
    {error && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"><span>{error}</span><button title="Recarregar os dados do dashboard" onClick={loadDashboard} className="font-semibold underline">Tentar novamente</button></div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total de pets" value={loading ? '—' : stats.total} description="Cadastros recebidos" icon={PawPrint} tone="green" />
      <StatCard title="Em análise" value={loading ? '—' : stats.pending} description="Aguardando avaliação da equipe" icon={Clock3} tone="amber" />
      <StatCard title="Aprovados" value={loading ? '—' : stats.approved} description="Cadastros aprovados" icon={CheckCircle2} tone="blue" />
      <StatCard title="Rejeitados" value={loading ? '—' : stats.rejected} description="Cadastros não aprovados" icon={XCircle} tone="rose" />
    </div>
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/40">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center md:px-6"><div><h2 className="font-bold text-slate-900">Cadastros recentes</h2><p className="mt-1 text-xs text-slate-400">Últimos pets enviados para avaliação</p></div><Link title="Consultar todos os cadastros" to="/admin/cadastros" className="inline-flex items-center gap-1 text-sm font-semibold text-[#286247] hover:text-[#173f32]">Ver todos <ArrowUpRight size={16} /></Link></div>
      {loading ? <div className="p-8 text-center text-sm text-slate-400">Carregando cadastros...</div> : recent.length === 0 ? <div className="p-10 text-center"><PawPrint className="mx-auto text-slate-300" size={30} /><p className="mt-3 font-semibold text-slate-600">Nenhum cadastro encontrado</p><p className="mt-1 text-sm text-slate-400">Quando um tutor cadastrar um pet, ele aparecerá aqui.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3 font-semibold">Pet</th><th className="px-6 py-3 font-semibold">Tutor</th><th className="px-6 py-3 font-semibold">Data</th><th className="px-6 py-3 font-semibold">Status</th><th className="px-6 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{recent.map(pet => { const status = statusInfo[pet.status] || statusInfo.pending_review; return <tr key={pet._id} className="transition hover:bg-slate-50/70"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#edf4ef]">{pet.avatar?.url ? <img src={pet.avatar.url} alt={`Foto de ${pet.name}`} className="h-full w-full object-cover"/> : <div className="grid h-full w-full place-items-center text-[#54816b]"><PawPrint size={17}/></div>}</div><div><p className="font-semibold text-slate-800">{pet.name || 'Pet sem nome'}</p><p className="mt-0.5 text-xs text-slate-400">{pet.breed || 'Raça não informada'}</p></div></div></td><td className="px-6 py-4"><p className="font-medium text-slate-700">{pet.guardian?.name || '—'}</p><p className="mt-0.5 text-xs text-slate-400">{pet.guardian?.email || ''}</p></td><td className="px-6 py-4 text-slate-500">{formatDate(pet.createdAt)}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span></td><td className="px-6 py-4 text-right"><Link title={`Abrir ficha de ${pet.name || 'pet'}`} to={`/admin/cadastros/${pet._id}`} className="font-semibold text-[#286247] hover:underline">Detalhes</Link></td></tr> })}</tbody></table></div>}
    </section>
  </div>
}
