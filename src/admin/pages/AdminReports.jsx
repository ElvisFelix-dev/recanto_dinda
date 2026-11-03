import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts'
import { CalendarDays, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react'
import { adminApi } from '../../services/api'
import { useToast } from '../contexts/ToastContext'
import LoadingState from '../components/LoadingState'

function monthLabel(year, month) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(new Date(year, month - 1, 1)).replace('.', '')
}
const inputClass = 'rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#6b9a7d] focus:ring-4 focus:ring-emerald-50'

export default function AdminReports() {
  const { showToast } = useToast()
  const [range, setRange] = useState({ from: '', to: '' })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.getReportOverview(range)
      setReport(response.data || null)
    } catch (error) {
      showToast({ type: 'error', title: 'Não foi possível gerar o relatório', message: error.message })
    } finally { setLoading(false) }
  }, [range, showToast])

  useEffect(() => { load() }, [load])

  const chartData = useMemo(() => (report?.registrationsByMonth || []).map(item => ({
    month: monthLabel(item.year, item.month),
    total: item.total,
  })), [report])

  async function exportCsv() {
    setExporting(true)
    try {
      const filename = await adminApi.downloadRegistrationsCsv(range)
      showToast({ type: 'success', title: 'Planilha exportada', message: `${filename} foi baixado. O arquivo CSV abre no Excel.` })
    } catch (error) {
      showToast({ type: 'error', title: 'Falha ao exportar planilha', message: error.message })
    } finally { setExporting(false) }
  }

  const totals = report?.totals || { total: 0, pending: 0, approved: 0, rejected: 0 }
  const cards = [
    { label: 'Total de cadastros', value: totals.total, color: 'text-slate-900', bg: 'bg-slate-50' },
    { label: 'Em análise', value: totals.pending, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Aprovados', value: totals.approved, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Rejeitados', value: totals.rejected, color: 'text-rose-700', bg: 'bg-rose-50' },
  ]

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end print:hidden"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#54816b]">Indicadores operacionais</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Relatórios</h1><p className="mt-2 text-sm text-slate-500">Acompanhe os cadastros e exporte os dados para análise.</p></div><div className="flex flex-wrap gap-2"><button title="Atualizar relatório" onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>Atualizar</button><button title="Imprimir ou salvar relatório como PDF" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><FileText size={16}/>Salvar PDF</button><button title="Baixar CSV compatível com Excel" onClick={exportCsv} disabled={exporting} className="inline-flex items-center gap-2 rounded-xl bg-[#286247] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4e37] disabled:opacity-50"><FileSpreadsheet size={16}/>{exporting ? 'Exportando...' : 'Exportar Excel'}</button></div></div>
    <section className="rounded-2xl border border-slate-100 bg-white p-5 print:hidden"><div className="mb-3 flex items-center gap-2"><CalendarDays size={17} className="text-[#54816b]"/><h2 className="text-sm font-bold text-slate-800">Período do relatório</h2></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><label className="flex-1"><span className="mb-1 block text-xs text-slate-500">Data inicial</span><input type="date" value={range.from} onChange={event => setRange(current => ({ ...current, from: event.target.value }))} className={`${inputClass} w-full`}/></label><label className="flex-1"><span className="mb-1 block text-xs text-slate-500">Data final</span><input type="date" value={range.to} onChange={event => setRange(current => ({ ...current, to: event.target.value }))} className={`${inputClass} w-full`}/></label><button onClick={load} disabled={loading || (range.from && range.to && range.from > range.to)} className="mt-5 rounded-xl bg-[#edf4ef] px-5 py-2.5 text-sm font-bold text-[#286247] hover:bg-[#dcebe0] disabled:opacity-50">Aplicar período</button><button onClick={() => setRange({ from: '', to: '' })} className="mt-5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">Limpar</button></div></section>
    <div className="hidden print:block"><h1 className="text-2xl font-bold">Relatório de cadastros — Recanto da Dinda</h1><p className="mt-1 text-sm text-slate-500">Gerado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())}{range.from || range.to ? ` · Período: ${range.from || 'início'} até ${range.to || 'hoje'}` : ' · Todos os períodos'}</p></div>
    {loading ? <LoadingState label="Calculando indicadores..."/> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card => <div key={card.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className={`inline-flex rounded-xl px-3 py-2 text-xs font-semibold ${card.bg} ${card.color}`}>{card.label}</div><p className={`mt-4 text-3xl font-bold tracking-tight ${card.color}`}>{card.value}</p></div>)}</div>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="mb-5"><h2 className="font-bold text-slate-900">Cadastros por mês</h2><p className="mt-1 text-xs text-slate-400">Distribuição mensal de novos registros no período selecionado.</p></div>{chartData.length === 0 ? <div className="flex h-64 items-center justify-center text-sm text-slate-400">Não há cadastros para exibir neste período.</div> : <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 8, right: 12, left: -20, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1ed"/><XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}/><ChartTooltip cursor={{ fill: '#f5f8f5' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}/><Bar dataKey="total" name="Cadastros" fill="#54816b" radius={[7, 7, 0, 0]} maxBarSize={52}/></BarChart></ResponsiveContainer></div>}</section>
      <section className="rounded-2xl border border-slate-100 bg-white p-5"><h2 className="font-bold text-slate-900">Resumo do período</h2><p className="mt-2 text-sm leading-6 text-slate-600">Foram recebidos <strong>{totals.total}</strong> cadastros, dos quais <strong>{totals.approved}</strong> estão aprovados, <strong>{totals.pending}</strong> aguardam análise e <strong>{totals.rejected}</strong> foram rejeitados.</p><p className="mt-3 text-xs text-slate-400">A exportação de planilha utiliza CSV com separador compatível com Excel. Para gerar PDF, utilize o botão “Salvar PDF” e selecione “Salvar como PDF” na janela de impressão.</p></section>
    </>}
  </div>
}
