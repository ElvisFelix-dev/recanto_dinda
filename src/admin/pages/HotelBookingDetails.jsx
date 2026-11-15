import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, CalendarDays, Check, CheckCircle2, Clock3, FileText, HeartPulse,
  Mail, MapPin, PawPrint, Phone, ShieldCheck, UserRound, X, AlertCircle,
  Stethoscope, Syringe, Save, RefreshCw,
} from 'lucide-react'
import { hotelApi } from '../../services/api'
import LoadingState from '../components/LoadingState'

const STATUS = {
  pending: { label: 'Pendente', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  approved: { label: 'Aprovada', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  rejected: { label: 'Recusada', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
  cancelled: { label: 'Cancelada', className: 'bg-stone-100 text-stone-600 ring-stone-200' },
  completed: { label: 'Concluída', className: 'bg-sky-50 text-sky-700 ring-sky-200' },
}
const DECLARATIONS = [
  ['emergencyAuthorization', 'Autoriza atendimento veterinário emergencial'],
  ['truthfulInformation', 'Declara que as informações são verdadeiras'],
  ['adequateHealth', 'Declara que o pet está em condições adequadas de saúde'],
  ['disclosedConditions', 'Informou condições de saúde conhecidas'],
  ['socializationRisks', 'Está ciente dos riscos de socialização'],
  ['emergencyMeasures', 'Autoriza medidas necessárias em emergência'],
  ['veterinaryExpenses', 'Responsabiliza-se por despesas veterinárias'],
]
const date = (value, withTime = false) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'long' }).format(parsed)
}
const yesNo = value => value ? 'Sim' : 'Não'

function Section({ icon: Icon, title, subtitle, children, className = '' }) {
  return <section className={`overflow-hidden rounded-2xl border border-[#f0e2da] bg-white shadow-sm shadow-[#593a31]/5 ${className}`}>
    <div className="flex items-center gap-3 border-b border-[#f4eae5] px-5 py-4 sm:px-6">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f5] text-[#c44d83]"><Icon size={19}/></div>
      <div><h2 className="font-extrabold text-[#593a31]">{title}</h2>{subtitle && <p className="mt-0.5 text-xs text-stone-400">{subtitle}</p>}</div>
    </div>
    <div className="p-5 sm:p-6">{children}</div>
  </section>
}
function Field({ label, value, className = '' }) {
  return <div className={className}><p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-[#63483e]">{value || '—'}</p></div>
}
function BooleanLine({ label, value }) {
  return <div className="flex items-start gap-2 text-sm"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${value ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>{value ? <Check size={13}/> : <X size={13}/>}</span><span className="text-stone-600">{label}</span></div>
}

export default function HotelBookingDetails() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError(''); setNotice('')
    try {
      const response = await hotelApi.getBooking(id)
      const data = response.data || null
      setBooking(data)
      setAdminNotes(data?.adminNotes || '')
    } catch (err) { setError(err.message || 'Não foi possível carregar a hospedagem.') }
    finally { setLoading(false) }
  }, [id])
  useEffect(() => { load() }, [load])

  const nights = useMemo(() => {
    if (!booking?.requestedCheckIn || !booking?.requestedCheckOut) return 0
    return Math.max(0, Math.ceil((new Date(booking.requestedCheckOut) - new Date(booking.requestedCheckIn)) / 86400000))
  }, [booking])

  const updateStatus = async status => {
    setSaving(true); setError(''); setNotice('')
    try {
      await hotelApi.updateBooking(id, { status, adminNotes })
      await load()
      setNotice(`Solicitação ${STATUS[status]?.label.toLowerCase()} com sucesso.`)
    } catch (err) { setError(err.message || 'Não foi possível atualizar a solicitação.') }
    finally { setSaving(false) }
  }
  const saveNotes = async () => {
    setSaving(true); setError(''); setNotice('')
    try {
      await hotelApi.updateBooking(id, { status: booking.status, adminNotes })
      await load()
      setNotice('Observações salvas com sucesso.')
    } catch (err) { setError(err.message || 'Não foi possível salvar as observações.') }
    finally { setSaving(false) }
  }

  if (loading) return <LoadingState label="Carregando detalhes da hospedagem..." />
  if (error && !booking) return <div className="space-y-4"><Link to="/admin/hotel" className="inline-flex items-center gap-2 text-sm font-bold text-[#9b6b5c]"><ArrowLeft size={16}/>Voltar às hospedagens</Link><div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl bg-[#593a31] px-4 py-2.5 text-sm font-bold text-white"><RefreshCw size={16}/>Tentar novamente</button></div>
  if (!booking) return null

  const health = booking.healthInformation || {}
  const guardian = booking.guardian || {}
  const pet = booking.petSnapshot || booking.pet || {}
  const status = STATUS[booking.status] || STATUS.pending

  return <div className="mx-auto max-w-6xl space-y-6 pb-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link to="/admin/hotel" className="inline-flex items-center gap-2 text-sm font-bold text-[#9b6b5c] transition hover:text-[#593a31]"><ArrowLeft size={17}/>Voltar às hospedagens</Link>
      <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd3] bg-white px-3.5 py-2.5 text-sm font-bold text-[#79594d] hover:bg-[#fff9f6]"><RefreshCw size={15}/>Atualizar</button>
    </div>

    <header className="rounded-3xl bg-gradient-to-br from-[#593a31] via-[#70483e] to-[#9a6658] p-6 text-white shadow-lg shadow-[#593a31]/10 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#f5c9d9]">Recanto da Dinda · Hotel</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">Detalhes da hospedagem</h1><p className="mt-2 text-sm text-white/70">Solicitação #{String(booking._id).slice(-8).toUpperCase()}</p></div>
        <span className={`inline-flex w-fit items-center rounded-full px-3.5 py-2 text-xs font-extrabold ring-1 ring-inset ${status.className}`}>{status.label}</span>
      </div>
      <div className="mt-7 grid gap-4 border-t border-white/15 pt-5 sm:grid-cols-3">
        <div className="flex items-center gap-3"><CalendarDays className="text-[#f5c9d9]" size={20}/><div><p className="text-xs text-white/60">Check-in solicitado</p><p className="font-bold">{date(booking.requestedCheckIn)}</p></div></div>
        <div className="flex items-center gap-3"><CalendarDays className="text-[#f5c9d9]" size={20}/><div><p className="text-xs text-white/60">Check-out solicitado</p><p className="font-bold">{date(booking.requestedCheckOut)}</p></div></div>
        <div className="flex items-center gap-3"><Clock3 className="text-[#f5c9d9]" size={20}/><div><p className="text-xs text-white/60">Duração prevista</p><p className="font-bold">{nights} {nights === 1 ? 'diária' : 'diárias'}</p></div></div>
      </div>
    </header>

    {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</div>}
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

    <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <div className="space-y-6">
        <Section icon={PawPrint} title="Informações do pet" subtitle="Dados informados na solicitação">
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0f5] text-[#c44d83]"><PawPrint size={27}/></div>
            <div><h3 className="text-xl font-black text-[#593a31]">{pet.name || 'Pet sem nome'}</h3><p className="mt-1 text-sm text-stone-500">{pet.breed || 'Raça não informada'}</p></div>
          </div>
          <div className="mt-5 grid gap-4 border-t border-[#f4eae5] pt-5 sm:grid-cols-2"><Field label="Sexo" value={pet.sex === 'female' ? 'Fêmea' : pet.sex === 'male' ? 'Macho' : '—'}/><Field label="Castrado(a)" value={yesNo(pet.neutered)}/></div>
        </Section>

        <Section icon={UserRound} title="Dados do tutor" subtitle="Responsável pelo pet e pela solicitação">
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Nome completo" value={guardian.name}/><Field label="CPF" value={guardian.cpf}/><Field label="RG" value={guardian.rg}/><Field label="Telefone" value={guardian.phone}/><Field label="E-mail" value={guardian.email}/><Field label="Endereço" value={guardian.address}/></div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-[#f4eae5] pt-4">{guardian.phone && <a href={`https://wa.me/55${guardian.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#f1f7ef] px-3.5 py-2.5 text-xs font-bold text-[#47734e]"><Phone size={15}/>Contato telefônico / WhatsApp</a>}{guardian.email && <a href={`mailto:${guardian.email}`} className="inline-flex items-center gap-2 rounded-xl bg-[#fff6f9] px-3.5 py-2.5 text-xs font-bold text-[#b64d7c]"><Mail size={15}/>Enviar e-mail</a>}</div>
        </Section>

        <Section icon={HeartPulse} title="Saúde e cuidados" subtitle="Informações de saúde declaradas pelo tutor">
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Vacinas em dia" value={yesNo(health.vaccinesUpToDate)}/><Field label="Última vermifugação" value={date(health.lastDewormingDate)}/><Field label="Antipulgas" value={health.fleaTreatment}/><Field label="Possui alergias?" value={yesNo(health.hasAllergies)}/><Field label="Utiliza medicamentos?" value={yesNo(health.takesMedication)}/></div>
          {health.hasAllergies && <div className="mt-4 rounded-xl bg-amber-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-700">Alergias informadas</p><p className="mt-1 whitespace-pre-wrap text-sm text-amber-900">{health.allergyDetails || 'Sem detalhes adicionais.'}</p></div>}
          {health.takesMedication && <div className="mt-3 rounded-xl bg-sky-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-sky-700">Medicamentos e orientações</p><p className="mt-1 whitespace-pre-wrap text-sm text-sky-900">{health.medicationDetails || 'Sem detalhes adicionais.'}</p></div>}
          <div className="mt-5 border-t border-[#f4eae5] pt-5"><h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#593a31]"><Stethoscope size={17} className="text-[#c44d83]"/>Veterinário de referência</h3><div className="grid gap-4 sm:grid-cols-3"><Field label="Clínica" value={health.veterinarian?.clinic}/><Field label="Veterinário" value={health.veterinarian?.name}/><Field label="Telefone" value={health.veterinarian?.phone}/></div></div>
          <div className="mt-5 border-t border-[#f4eae5] pt-5"><h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#593a31]"><Syringe size={17} className="text-[#c44d83]"/>Carteira de vacinação</h3>
            {health.vaccinationCards?.length ? <div className="flex flex-wrap gap-2">{health.vaccinationCards.map((file, index) => <a key={`${file.publicId || file.url}-${index}`} href={file.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd3] px-3 py-2.5 text-xs font-bold text-[#79594d] hover:bg-[#fff8f4]"><FileText size={15}/> {file.originalName || `Carteira de vacinação ${index + 1}`}</a>)}</div> : <p className="text-sm text-stone-400">Nenhum arquivo anexado.</p>}
          </div>
        </Section>

        <Section icon={ShieldCheck} title="Declarações e autorizações" subtitle="Confirmações registradas no envio do formulário">
          <div className="grid gap-3">{DECLARATIONS.map(([key, label]) => <BooleanLine key={key} label={label} value={Boolean(booking.declarations?.[key])}/>)}</div>
        </Section>
      </div>

      <aside className="space-y-6">
        <Section icon={CalendarDays} title="Resumo da solicitação">
          <div className="space-y-4"><Field label="Solicitação recebida em" value={date(booking.createdAt, true)}/><Field label="Última atualização" value={date(booking.updatedAt, true)}/><Field label="Status atual" value={status.label}/>{booking.reviewedAt && <Field label="Analisada em" value={date(booking.reviewedAt, true)}/>}{booking.reviewedBy && <Field label="Analisada por" value={booking.reviewedBy.name}/>}</div>
        </Section>
        <Section icon={FileText} title="Observações internas" subtitle="Visíveis apenas para a equipe administrativa">
          <textarea value={adminNotes} onChange={event => setAdminNotes(event.target.value)} maxLength={2000} rows={5} placeholder="Adicione informações importantes sobre esta hospedagem..." className="w-full resize-y rounded-xl border border-[#eadbd3] bg-[#fffdfb] px-3.5 py-3 text-sm text-[#593a31] outline-none transition placeholder:text-stone-400 focus:border-[#c77c9b] focus:ring-2 focus:ring-[#f9e3ec]"/>
          <div className="mt-2 flex items-center justify-between"><span className="text-[11px] text-stone-400">{adminNotes.length}/2000 caracteres</span><button disabled={saving} onClick={saveNotes} className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd3] px-3.5 py-2.5 text-xs font-extrabold text-[#79594d] disabled:opacity-50"><Save size={14}/>Salvar observações</button></div>
        </Section>
        {booking.status === 'pending' && <Section icon={ShieldCheck} title="Analisar solicitação" subtitle="Aprove ou recuse o pedido de hospedagem">
          <div className="space-y-3"><button disabled={saving} onClick={() => updateStatus('approved')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#593a31] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#70483e] disabled:opacity-50"><CheckCircle2 size={17}/>Aprovar hospedagem</button><button disabled={saving} onClick={() => updateStatus('rejected')} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-extrabold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"><X size={17}/>Recusar solicitação</button></div>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-stone-400"><AlertCircle size={14} className="mt-0.5 shrink-0"/>A alteração de status será registrada no histórico da solicitação.</p>
        </Section>}
        {booking.status === 'approved' && <Section icon={CheckCircle2} title="Hospedagem aprovada"><p className="text-sm leading-relaxed text-stone-500">Esta solicitação foi aprovada. As informações do pet e do tutor estão disponíveis para a equipe durante o atendimento.</p></Section>}
      </aside>
    </div>
  </div>
}
