import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  FileText,
  PawPrint,
  RefreshCw,
  BedDouble,
  Sun,
  Users,
  XCircle,
} from 'lucide-react'
import { adminApi } from '../../services/api'
import { useToast } from '../contexts/ToastContext'
import LoadingState from '../components/LoadingState'

const numberFormat = new Intl.NumberFormat('pt-BR')

function monthLabel(year, month) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' })
    .format(new Date(year, month - 1, 1))
    .replace('.', '')
}

function formatNumber(value) {
  return numberFormat.format(Number(value) || 0)
}

const inputClass =
  'rounded-xl border border-[#eadbd5] bg-white px-3.5 py-2.5 text-sm text-[#593a31] outline-none transition focus:border-[#d94d91] focus:ring-4 focus:ring-[#d94d91]/10'

function MetricCard({ label, value, detail, icon: Icon, tone = 'pink' }) {
  const tones = {
    pink: 'bg-[#fce8f1] text-[#b83c78]',
    brown: 'bg-[#f1e8e3] text-[#593a31]',
    beige: 'bg-[#fff4e8] text-[#a66a35]',
    green: 'bg-[#eaf3ed] text-[#477456]',
  }

  return (
    <article className="rounded-2xl border border-[#f0e5df] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#8b746b]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#593a31]">
            {formatNumber(value)}
          </p>
          {detail ? <p className="mt-1 text-xs text-[#a58e85]">{detail}</p> : null}
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon size={20} />
        </span>
      </div>
    </article>
  )
}

function StatusLine({ label, value, icon: Icon, tone = 'brown' }) {
  const tones = {
    pink: 'text-[#c04480] bg-[#fce8f1]',
    brown: 'text-[#76564b] bg-[#f1e8e3]',
    green: 'text-[#477456] bg-[#eaf3ed]',
    amber: 'text-[#a66a35] bg-[#fff4e8]',
    red: 'text-[#b94b55] bg-[#fff0f0]',
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#f4ece8] py-3 last:border-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon size={15} />
        </span>
        <span className="text-sm text-[#765f56]">{label}</span>
      </div>
      <strong className="text-sm tabular-nums text-[#593a31]">{formatNumber(value)}</strong>
    </div>
  )
}

function MonthlyChart({ title, description, data, color, emptyMessage }) {
  const chartData = (data || []).map((item) => ({
    month: monthLabel(item.year, item.month),
    total: item.total,
  }))

  return (
    <section className="rounded-2xl border border-[#f0e5df] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-[#593a31]">{title}</h2>
        <p className="mt-1 text-xs text-[#a58e85]">{description}</p>
      </div>
      {chartData.length === 0 ? (
        <div className="flex h-60 items-center justify-center text-center text-sm text-[#a58e85]">
          {emptyMessage}
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 10, left: -22, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1e9e5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a58e85' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#a58e85' }} axisLine={false} tickLine={false} />
              <ChartTooltip
                cursor={{ fill: '#fff8f5' }}
                formatter={(value) => [formatNumber(value), 'Quantidade']}
                contentStyle={{ borderRadius: 12, border: '1px solid #eadbd5', fontSize: 12 }}
              />
              <Bar dataKey="total" name="Quantidade" fill={color} radius={[7, 7, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

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
      showToast({
        type: 'error',
        title: 'Não foi possível gerar o relatório',
        message: error.message,
      })
    } finally {
      setLoading(false)
    }
  }, [range, showToast])

  useEffect(() => {
    load()
  }, [load])

  const registrations = report?.totals || { total: 0, pending: 0, approved: 0, rejected: 0 }
  const hotel = report?.hotel || {}
  const hotelTotals = hotel.totals || {}
  const daycare = report?.daycare || {}
  const daycareTotals = daycare.totals || {}

  const allMonthly = useMemo(() => {
    const registrationsByMonth = report?.registrationsByMonth || []
    const bookingsByMonth = hotel.bookingsByMonth || []
    const attendanceByMonth = daycare.attendanceByMonth || []
    return { registrationsByMonth, bookingsByMonth, attendanceByMonth }
  }, [report, hotel.bookingsByMonth, daycare.attendanceByMonth])

  async function exportCsv() {
    setExporting(true)
    try {
      const filename = await adminApi.downloadRegistrationsCsv(range)
      showToast({
        type: 'success',
        title: 'Relatório exportado',
        message: `${filename} foi baixado. O arquivo CSV pode ser aberto no Excel.`,
      })
    } catch (error) {
      showToast({ type: 'error', title: 'Falha ao exportar planilha', message: error.message })
    } finally {
      setExporting(false)
    }
  }

  const hasReport = Boolean(report)
  const topPets = daycare.topPets || []

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end print:hidden">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#d94d91]">
            Gestão e indicadores
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#593a31]">Relatórios</h1>
          <p className="mt-2 text-sm text-[#8b746b]">
            Visão consolidada dos cadastros, hospedagens, daycare e frequência dos pets.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            title="Atualizar relatório"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd5] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#765f56] transition hover:bg-[#fff8f5] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Atualizar
          </button>
          <button
            type="button"
            title="Imprimir ou salvar relatório como PDF"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd5] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#765f56] transition hover:bg-[#fff8f5]"
          >
            <FileText size={16} /> Salvar PDF
          </button>
          <button
            type="button"
            title="Baixar relatório completo compatível com Excel"
            onClick={exportCsv}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d94d91] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c33e80] disabled:opacity-50"
          >
            <FileSpreadsheet size={16} /> {exporting ? 'Exportando...' : 'Exportar Excel'}
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-[#f0e5df] bg-white p-5 print:hidden">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays size={17} className="text-[#d94d91]" />
          <h2 className="text-sm font-bold text-[#593a31]">Período do relatório</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-1 block text-xs text-[#8b746b]">Data inicial</span>
            <input
              type="date"
              value={range.from}
              onChange={(event) => setRange((current) => ({ ...current, from: event.target.value }))}
              className={`${inputClass} w-full`}
            />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-xs text-[#8b746b]">Data final</span>
            <input
              type="date"
              value={range.to}
              onChange={(event) => setRange((current) => ({ ...current, to: event.target.value }))}
              className={`${inputClass} w-full`}
            />
          </label>
          <button
            type="button"
            onClick={load}
            disabled={loading || (range.from && range.to && range.from > range.to)}
            className="rounded-xl bg-[#fce8f1] px-5 py-2.5 text-sm font-bold text-[#b83c78] transition hover:bg-[#f8d8e7] disabled:opacity-50"
          >
            Aplicar período
          </button>
          <button
            type="button"
            onClick={() => setRange({ from: '', to: '' })}
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#8b746b] transition hover:bg-[#fff8f5]"
          >
            Limpar
          </button>
        </div>
      </section>

      <div className="hidden print:block">
        <h1 className="text-2xl font-bold text-[#593a31]">Relatório operacional — Recanto da Dinda</h1>
        <p className="mt-1 text-sm text-[#8b746b]">
          Gerado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())}
          {range.from || range.to
            ? ` · Período: ${range.from || 'início'} até ${range.to || 'hoje'}`
            : ' · Todos os períodos'}
        </p>
      </div>

      {loading ? (
        <LoadingState label="Calculando indicadores..." />
      ) : !hasReport ? (
        <div className="rounded-2xl border border-[#f0e5df] bg-white p-8 text-center text-sm text-[#8b746b]">
          Não foi possível carregar os dados do relatório.
        </div>
      ) : (
        <>
          <section>
            <div className="mb-3 flex items-center gap-2">
              <PawPrint size={18} className="text-[#d94d91]" />
              <h2 className="font-bold text-[#593a31]">Visão geral</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Pets cadastrados" value={registrations.total} detail="Total de registros no período" icon={PawPrint} tone="pink" />
              <MetricCard label="Hospedagens" value={hotelTotals.total} detail={`${formatNumber(hotelTotals.requestedNights)} diárias solicitadas`} icon={BedDouble} tone="brown" />
              <MetricCard label="Atendimentos daycare" value={daycareTotals.attendances} detail="Entradas registradas no período" icon={Sun} tone="beige" />
              <MetricCard label="Presenças concluídas" value={daycareTotals.completed} detail={`${formatNumber(daycareTotals.presentNowOrWithoutCheckout)} sem saída registrada`} icon={CalendarCheck} tone="green" />
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#f0e5df] bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <PawPrint size={18} className="text-[#d94d91]" />
                <h2 className="font-bold text-[#593a31]">Cadastros de pets</h2>
              </div>
              <StatusLine label="Aprovados" value={registrations.approved} icon={CheckCircle2} tone="green" />
              <StatusLine label="Em análise" value={registrations.pending} icon={Clock3} tone="amber" />
              <StatusLine label="Rejeitados" value={registrations.rejected} icon={XCircle} tone="red" />
              <StatusLine label="Total de cadastros" value={registrations.total} icon={Users} tone="brown" />
            </div>

            <div className="rounded-2xl border border-[#f0e5df] bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <BedDouble size={18} className="text-[#d94d91]" />
                <h2 className="font-bold text-[#593a31]">Resumo das hospedagens</h2>
              </div>
              <StatusLine label="Aguardando análise" value={hotelTotals.pending} icon={Clock3} tone="amber" />
              <StatusLine label="Aprovadas" value={hotelTotals.approved} icon={CheckCircle2} tone="green" />
              <StatusLine label="Concluídas" value={hotelTotals.completed} icon={CalendarCheck} tone="brown" />
              <StatusLine label="Canceladas" value={hotelTotals.cancelled} icon={XCircle} tone="red" />
              <StatusLine label="Rejeitadas" value={hotelTotals.rejected} icon={XCircle} tone="pink" />
              <StatusLine label="Diárias solicitadas" value={hotelTotals.requestedNights} icon={BedDouble} tone="beige" />
            </div>

            <div className="rounded-2xl border border-[#f0e5df] bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Sun size={18} className="text-[#d94d91]" />
                <h2 className="font-bold text-[#593a31]">Resumo do daycare e frequência</h2>
              </div>
              <StatusLine label="Entradas registradas" value={daycareTotals.checkIns} icon={CalendarCheck} tone="green" />
              <StatusLine label="Saídas registradas" value={daycareTotals.checkOuts} icon={CheckCircle2} tone="brown" />
              <StatusLine label="Permanecem sem saída" value={daycareTotals.presentNowOrWithoutCheckout} icon={Clock3} tone="amber" />
              <StatusLine label="Frequências concluídas" value={daycareTotals.completed} icon={CheckCircle2} tone="pink" />
            </div>

            <div className="rounded-2xl border border-[#f0e5df] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Users size={18} className="text-[#d94d91]" />
                <h2 className="font-bold text-[#593a31]">Pets com maior frequência</h2>
              </div>
              {topPets.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#a58e85]">Ainda não há frequências registradas neste período.</p>
              ) : (
                <div className="space-y-3">
                  {topPets.map((pet, index) => (
                    <div key={pet.petId || `${pet.petName}-${index}`} className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#fce8f1] text-xs font-bold text-[#b83c78]">{index + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#765f56]">{pet.petName || 'Pet não identificado'}</span>
                      <strong className="text-sm tabular-nums text-[#593a31]">{formatNumber(pet.total)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="font-bold text-[#593a31]">Evolução mensal</h2>
              <p className="mt-1 text-xs text-[#a58e85]">Comparativo de cadastros, hospedagens e frequências no período selecionado.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              <MonthlyChart title="Cadastros por mês" description="Novos pets cadastrados." data={allMonthly.registrationsByMonth} color="#d94d91" emptyMessage="Não há cadastros neste período." />
              <MonthlyChart title="Hospedagens por mês" description="Solicitações de hospedagem criadas." data={allMonthly.bookingsByMonth} color="#8b6254" emptyMessage="Não há hospedagens neste período." />
              <MonthlyChart title="Frequência por mês" description="Entradas de pets registradas no daycare." data={allMonthly.attendanceByMonth} color="#c68a55" emptyMessage="Não há frequências neste período." />
            </div>
          </section>

          <section className="rounded-2xl border border-[#f0e5df] bg-white p-5">
            <h2 className="font-bold text-[#593a31]">Resumo do período</h2>
            <p className="mt-2 text-sm leading-6 text-[#765f56]">
              No período selecionado, foram registrados <strong>{formatNumber(registrations.total)}</strong> pets,
              <strong> {formatNumber(hotelTotals.total)}</strong> solicitações de hospedagem e
              <strong> {formatNumber(daycareTotals.attendances)}</strong> entradas no daycare.
              Foram contabilizadas <strong>{formatNumber(hotelTotals.requestedNights)}</strong> diárias solicitadas
              e <strong>{formatNumber(daycareTotals.completed)}</strong> frequências com saída registrada.
            </p>
            <p className="mt-3 text-xs text-[#a58e85]">
              O PDF pode ser salvo pelo botão “Salvar PDF”. A planilha é exportada em CSV, formato compatível com Excel,
              com seções separadas para cadastros, hospedagens e daycare/frequência.
            </p>
          </section>
        </>
      )}
    </div>
  )
}
