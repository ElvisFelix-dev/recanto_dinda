import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Check, CheckCircle2, ChevronLeft, ChevronRight, Eye, EyeOff, Filter,
  MessageSquareQuote, PawPrint, Plus, RefreshCw, Search, ShieldCheck,
  Star, Trash2, X,
} from 'lucide-react'
import { adminApi, testimonialApi } from '../../services/api'
import LoadingState from '../components/LoadingState'
import { useToast } from '../contexts/ToastContext'

const PAGE_SIZE = 10
const statusLabels = {
  pending: 'Pendente',
  approved: 'Publicado',
  hidden: 'Oculto',
}
const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  hidden: 'bg-slate-100 text-slate-600 ring-slate-200',
}

function StatusPill({ status }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.pending}`}>{statusLabels[status] || status}</span>
}

function PetAvatar({ pet, size = 'h-12 w-12' }) {
  return <div className={`${size} shrink-0 overflow-hidden rounded-2xl border border-[#F4C9DA] bg-[#FCE2ED] text-[#D94D91]`}>{pet?.avatar?.url ? <img src={pet.avatar.url} alt={`Foto de ${pet.name}`} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center"><PawPrint size={21} /></div>}</div>
}

export default function AdminTestimonials() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [guardians, setGuardians] = useState([])
  const [guardiansLoading, setGuardiansLoading] = useState(false)
  const [form, setForm] = useState({ guardianId: '', text: '', rating: 5, source: 'whatsapp', notes: '', testimonial: false, petImage: false })

  const loadTestimonials = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const response = await testimonialApi.getAdminTestimonials({ page, limit: PAGE_SIZE, status, search })
      setItems(response.items || response.data || [])
      setPagination(response.pagination || { page, total: 0, totalPages: 1 })
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os depoimentos.')
    } finally { setLoading(false) }
  }, [page, status, search])

  const loadGuardians = useCallback(async () => {
    setGuardiansLoading(true)
    try {
      // O endpoint existente lista pets aprovados e inclui o tutor relacionado.
      const first = await adminApi.getRegistrations({ status: 'approved', page: 1, limit: 50 })
      const all = [...(first.data || [])]
      const pages = first.pagination?.totalPages || 1
      for (let current = 2; current <= pages; current += 1) {
        const response = await adminApi.getRegistrations({ status: 'approved', page: current, limit: 50 })
        all.push(...(response.data || []))
      }
      const unique = new Map()
      all.forEach((pet) => {
        const guardian = pet.guardian
        if (guardian?._id && !unique.has(String(guardian._id))) {
          unique.set(String(guardian._id), { ...guardian, pets: [] })
        }
        if (guardian?._id) unique.get(String(guardian._id)).pets.push(pet)
      })
      setGuardians([...unique.values()].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR')))
    } catch (err) {
      showToast({ type: 'error', title: 'Falha ao carregar tutores', message: err.message })
    } finally { setGuardiansLoading(false) }
  }, [showToast])

  useEffect(() => { loadTestimonials() }, [loadTestimonials])
  useEffect(() => { loadGuardians() }, [loadGuardians])

  const selectedGuardian = useMemo(() => guardians.find((item) => String(item._id) === form.guardianId), [guardians, form.guardianId])

  function resetForm() {
    setForm({ guardianId: '', text: '', rating: 5, source: 'whatsapp', notes: '', testimonial: false, petImage: false })
  }

  async function handleCreate(event) {
    event.preventDefault()
    if (!form.guardianId || form.text.trim().length < 10 || !form.testimonial || !form.petImage) {
      showToast({ type: 'warning', title: 'Confira os campos', message: 'Selecione um tutor, escreva ao menos 10 caracteres e confirme as duas autorizações.' })
      return
    }
    setSaving(true)
    try {
      const response = await testimonialApi.createTestimonial({
        guardianId: form.guardianId,
        text: form.text.trim(),
        rating: Number(form.rating),
        authorization: { testimonial: true, petImage: true, source: form.source, notes: form.notes.trim() },
      })
      showToast({ type: 'success', title: 'Depoimento cadastrado', message: response.message || 'O depoimento foi salvo como pendente.' })
      resetForm(); setShowForm(false); setStatus('pending'); setPage(1); setSearch('')
      await loadTestimonials()
    } catch (err) {
      showToast({ type: 'error', title: 'Não foi possível cadastrar', message: err.message })
    } finally { setSaving(false) }
  }

  async function changeStatus(item, nextStatus) {
    const action = nextStatus === 'approved' ? 'aprovar e publicar' : nextStatus === 'hidden' ? 'ocultar' : 'voltar para pendente'
    if (!window.confirm(`Deseja ${action} este depoimento?`)) return
    try {
      const response = await testimonialApi.updateTestimonialStatus(item._id, nextStatus)
      showToast({ type: 'success', title: 'Status atualizado', message: response.message || 'Alteração realizada.' })
      await loadTestimonials()
    } catch (err) { showToast({ type: 'error', title: 'Não foi possível alterar o status', message: err.message }) }
  }

  async function deleteItem(item) {
    if (!window.confirm('Tem certeza que deseja excluir este depoimento? Esta ação não pode ser desfeita.')) return
    try {
      await testimonialApi.deleteTestimonial(item._id)
      showToast({ type: 'success', title: 'Depoimento excluído' })
      await loadTestimonials()
    } catch (err) { showToast({ type: 'error', title: 'Não foi possível excluir', message: err.message }) }
  }

  const selectedPetCount = selectedGuardian?.pets?.length || 0

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[#D94D91]"><MessageSquareQuote size={17} /><p className="text-xs font-bold uppercase tracking-[.16em]">Vozes do Recanto</p></div>
          <h1 className="text-2xl font-bold tracking-tight text-[#593A31] sm:text-3xl">Depoimentos</h1>
          <p className="mt-1 text-sm text-[#927B72]">Cadastre, revise e publique histórias das famílias — sempre destacando os pets.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { loadTestimonials(); loadGuardians() }} className="inline-flex items-center gap-2 rounded-xl border border-[#EADBD3] bg-white px-4 py-2.5 text-sm font-semibold text-[#593A31] hover:bg-[#FFFBF8]"><RefreshCw size={16} />Atualizar</button>
          <button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-[#593A31] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#765044]"><Plus size={17} />Novo depoimento</button>
        </div>
      </header>

      {showForm && <section className="overflow-hidden rounded-3xl border border-[#F1E5DF] bg-white shadow-sm">
        <div className="border-b border-[#F1E5DF] bg-[#FFF8F3] px-5 py-4 sm:px-6"><h2 className="font-bold text-[#593A31]">Cadastrar depoimento</h2><p className="mt-1 text-xs text-[#927B72]">O depoimento será salvo como pendente. A publicação depende de aprovação.</p></div>
        <form onSubmit={handleCreate} className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-[#593A31]">Tutor responsável *</span><select required value={form.guardianId} onChange={(e) => setForm((current) => ({ ...current, guardianId: e.target.value }))} disabled={guardiansLoading} className="w-full rounded-xl border border-[#EADBD3] bg-white px-4 py-3 text-sm text-[#593A31] outline-none focus:border-[#D94D91] focus:ring-4 focus:ring-[#FCE2ED] disabled:bg-slate-50"><option value="">{guardiansLoading ? 'Carregando tutores...' : 'Selecione um tutor'}</option>{guardians.map((guardian) => <option key={guardian._id} value={guardian._id}>{guardian.name} · {guardian.pets.length} {guardian.pets.length === 1 ? 'pet aprovado' : 'pets aprovados'}</option>)}</select><span className="mt-1.5 block text-xs text-[#A18D85]">Somente tutores com pets aprovados são exibidos.</span></label>
            <div><span className="mb-2 block text-sm font-semibold text-[#593A31]">Avaliação *</span><div className="flex h-[46px] items-center gap-1 rounded-xl border border-[#EADBD3] px-3">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setForm((current) => ({ ...current, rating: value }))} aria-label={`${value} estrelas`} className="rounded-md p-1"><Star size={22} className={value <= form.rating ? 'fill-[#D94D91] text-[#D94D91]' : 'text-[#E8C9D5]'} /></button>)}</div></div>
          </div>
          {selectedGuardian && <div className="rounded-2xl border border-[#F4C9DA] bg-[#FFF8F3] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#D94D91]">Pets elegíveis deste tutor</p><div className="mt-3 flex flex-wrap gap-3">{selectedGuardian.pets.map((pet) => <div key={pet._id} className="flex items-center gap-2 rounded-xl bg-white px-2.5 py-2"><PetAvatar pet={pet} size="h-9 w-9"/><div><p className="text-sm font-semibold text-[#593A31]">{pet.name}</p><p className="text-[11px] text-[#A18D85]">{pet.breed || 'Raça não informada'}</p></div></div>)}</div><p className="mt-3 text-xs text-[#806B63]">Ao salvar, o sistema escolherá aleatoriamente um pet aprovado e manterá essa escolha no depoimento.</p></div>}
          <label className="block"><span className="mb-2 block text-sm font-semibold text-[#593A31]">Relato autorizado *</span><textarea required minLength={10} maxLength={1200} rows={5} value={form.text} onChange={(e) => setForm((current) => ({ ...current, text: e.target.value }))} placeholder="Escreva o depoimento exatamente como foi autorizado pelo tutor..." className="w-full resize-y rounded-xl border border-[#EADBD3] px-4 py-3 text-sm leading-6 text-[#593A31] outline-none placeholder:text-[#B5A39B] focus:border-[#D94D91] focus:ring-4 focus:ring-[#FCE2ED]"/><div className="mt-1 text-right text-xs text-[#A18D85]">{form.text.length}/1200 caracteres</div></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold text-[#593A31]">Origem da autorização</span><select value={form.source} onChange={(e) => setForm((current) => ({ ...current, source: e.target.value }))} className="w-full rounded-xl border border-[#EADBD3] bg-white px-4 py-3 text-sm text-[#593A31] outline-none focus:border-[#D94D91]"><option value="whatsapp">WhatsApp</option><option value="written">Autorização por escrito</option><option value="admin_recorded">Registrada pela equipe</option><option value="other">Outra</option></select></label><label className="block"><span className="mb-2 block text-sm font-semibold text-[#593A31]">Observação da autorização</span><input value={form.notes} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} maxLength={500} placeholder="Ex.: mensagem recebida em 24/11" className="w-full rounded-xl border border-[#EADBD3] px-4 py-3 text-sm text-[#593A31] outline-none focus:border-[#D94D91]"/></label></div>
          <div className="rounded-2xl border border-[#F4C9DA] bg-[#FFF8F3] p-4"><div className="mb-3 flex items-center gap-2"><ShieldCheck size={19} className="text-[#D94D91]"/><p className="text-sm font-bold text-[#593A31]">Confirmação das autorizações *</p></div><label className="flex cursor-pointer items-start gap-3 text-sm text-[#806B63]"><input type="checkbox" checked={form.testimonial} onChange={(e) => setForm((current) => ({ ...current, testimonial: e.target.checked }))} className="mt-0.5 h-4 w-4 rounded border-[#D9B9AA] text-[#D94D91] focus:ring-[#D94D91]"/><span>O tutor autorizou expressamente a publicação deste depoimento no site do Recanto.</span></label><label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-[#806B63]"><input type="checkbox" checked={form.petImage} onChange={(e) => setForm((current) => ({ ...current, petImage: e.target.checked }))} className="mt-0.5 h-4 w-4 rounded border-[#D9B9AA] text-[#D94D91] focus:ring-[#D94D91]"/><span>O tutor autorizou expressamente a utilização da imagem do pet na publicação.</span></label></div>
          <div className="flex flex-col-reverse gap-2 border-t border-[#F1E5DF] pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => { setShowForm(false); resetForm() }} className="rounded-xl border border-[#EADBD3] px-5 py-3 text-sm font-semibold text-[#806B63] hover:bg-[#FFFBF8]">Cancelar</button><button type="submit" disabled={saving || guardiansLoading || !guardians.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D94D91] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C43E80] disabled:cursor-not-allowed disabled:opacity-50">{saving ? <RefreshCw size={16} className="animate-spin"/> : <Plus size={16}/>}Salvar como pendente</button></div>
        </form>
      </section>}

      <section className="rounded-2xl border border-[#F1E5DF] bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_210px_auto]"><label className="relative block"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A18D85]"/><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} onKeyDown={(e) => { if (e.key === 'Enter') loadTestimonials() }} placeholder="Buscar por pet, tutor ou texto..." className="w-full rounded-xl border border-[#EADBD3] bg-[#FFFBF8] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D94D91]"/></label><select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="rounded-xl border border-[#EADBD3] bg-[#FFFBF8] px-3.5 py-3 text-sm text-[#593A31] outline-none focus:border-[#D94D91]"><option value="">Todos os status</option><option value="pending">Pendentes</option><option value="approved">Publicados</option><option value="hidden">Ocultos</option></select><button type="button" onClick={() => { setPage(1); loadTestimonials() }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#593A31] px-5 py-3 text-sm font-semibold text-white hover:bg-[#765044]"><Filter size={16}/>Filtrar</button></div>
        <p className="mt-3 text-xs text-[#A18D85]">{pagination.total || 0} depoimento(s) encontrado(s)</p>
      </section>

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}<button onClick={loadTestimonials} className="font-semibold underline">Tentar novamente</button></div>}

      <section className="overflow-hidden rounded-3xl border border-[#F1E5DF] bg-white shadow-sm">
        <div className="border-b border-[#F1E5DF] px-5 py-4"><h2 className="font-bold text-[#593A31]">Depoimentos cadastrados</h2><p className="mt-1 text-xs text-[#A18D85]">O nome do tutor aparece somente nesta área administrativa.</p></div>
        {loading ? <LoadingState label="Carregando depoimentos..."/> : items.length === 0 ? <div className="px-6 py-14 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#FCE2ED] text-[#D94D91]"><MessageSquareQuote size={25}/></div><h3 className="mt-4 font-bold text-[#593A31]">Nenhum depoimento encontrado</h3><p className="mt-1 text-sm text-[#927B72]">Cadastre a primeira história para começar a preencher o carrossel.</p><button onClick={() => setShowForm(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#593A31] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16}/>Cadastrar primeiro depoimento</button></div> : <div className="divide-y divide-[#F1E5DF]">{items.map((item) => <article key={item._id} className="p-5 sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start"><div className="flex min-w-0 flex-1 gap-3"><PetAvatar pet={item.pet}/><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#593A31]">{item.pet?.name || 'Pet não identificado'}</h3><StatusPill status={item.status}/></div><p className="mt-0.5 text-xs text-[#927B72]">Tutor: {item.guardian?.name || '—'} · {item.pet?.breed || 'Raça não informada'}</p><div className="mt-2 flex items-center gap-1">{[1,2,3,4,5].map((value) => <Star key={value} size={14} className={value <= item.rating ? 'fill-[#D94D91] text-[#D94D91]' : 'text-[#E8C9D5]'}/>)}</div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#806B63]">“{item.text}”</p><div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#A18D85]"><span className="rounded-full bg-[#FFF8F3] px-2.5 py-1">Autorização do relato: {item.authorization?.testimonial ? 'Sim' : 'Não'}</span><span className="rounded-full bg-[#FFF8F3] px-2.5 py-1">Imagem autorizada: {item.authorization?.petImage ? 'Sim' : 'Não'}</span></div></div></div><div className="flex flex-wrap gap-2 lg:justify-end">{item.status !== 'approved' && <button onClick={() => changeStatus(item, 'approved')} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"><Check size={14}/>Aprovar</button>}{item.status !== 'hidden' && <button onClick={() => changeStatus(item, 'hidden')} className="inline-flex items-center gap-1.5 rounded-lg border border-[#EADBD3] px-3 py-2 text-xs font-semibold text-[#806B63] hover:bg-[#FFF8F3]"><EyeOff size={14}/>Ocultar</button>}{item.status === 'hidden' && <button onClick={() => changeStatus(item, 'pending')} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"><Eye size={14}/>Voltar para pendente</button>}<button onClick={() => deleteItem(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"><Trash2 size={14}/>Excluir</button></div></div></article>)}</div>}
        {!loading && items.length > 0 && <div className="flex flex-col gap-3 border-t border-[#F1E5DF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[#A18D85]">Página {pagination.page || page} de {Math.max(1, pagination.totalPages || 1)} · {pagination.total || 0} registros</p><div className="flex items-center gap-2"><button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex items-center gap-1 rounded-lg border border-[#EADBD3] px-3 py-2 text-xs font-semibold text-[#806B63] disabled:opacity-40"><ChevronLeft size={15}/>Anterior</button><button disabled={page >= (pagination.totalPages || 1)} onClick={() => setPage((value) => value + 1)} className="inline-flex items-center gap-1 rounded-lg border border-[#EADBD3] px-3 py-2 text-xs font-semibold text-[#806B63] disabled:opacity-40">Próxima<ChevronRight size={15}/></button></div></div>}
      </section>
      <div className="flex items-start gap-3 rounded-2xl border border-[#F4C9DA] bg-[#FFF8F3] p-4"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#D94D91]"/><p className="text-xs leading-relaxed text-[#806B63]">A publicação exige autorização expressa para o depoimento e para a imagem do pet. Somente depoimentos aprovados são enviados pela API pública da landing page.</p></div>
    </div>
  )
}
