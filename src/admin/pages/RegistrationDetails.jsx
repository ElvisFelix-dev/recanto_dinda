import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Camera, Check, CheckCircle2, ClipboardList, ExternalLink, FileText, HeartPulse, LoaderCircle, Mail, MapPin, PawPrint, Phone, ShieldCheck, Stethoscope, Syringe, Trash2, UserRound, X } from 'lucide-react'
import { adminApi } from '../../services/api'
import StatusBadge from '../components/StatusBadge'
import LoadingState from '../components/LoadingState'
import { useToast } from '../contexts/ToastContext'
import Tooltip from '../components/Tooltip'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date)
}

function YesNo({ value }) {
  return <span className={`inline-flex items-center gap-1 text-sm font-medium ${value ? 'text-emerald-700' : 'text-slate-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${value ? 'bg-emerald-500' : 'bg-slate-300'}`} />{value ? 'Sim' : 'Não'}</span>
}

function Info({ label, value }) {
  return <div className="min-w-0"><p className="text-xs font-medium text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-medium text-slate-700">{value === null || value === undefined || value === '' ? '—' : String(value)}</p></div>
}

function Section({ title, icon: Icon, children, action }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/30"><div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 md:px-6"><div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf4ef] text-[#54816b]"><Icon size={18} /></div><h2 className="font-bold text-slate-800">{title}</h2></div>{action}</div><div className="p-5 md:p-6">{children}</div></section>
}

function StatusActionModal({ mode, onClose, onConfirm, saving }) {
  const [notes, setNotes] = useState('')
  const rejected = mode === 'rejected'
  const title = rejected ? 'Rejeitar cadastro' : 'Aprovar cadastro'
  const canSubmit = !saving && (!rejected || notes.trim().length > 0)
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !saving) onClose() }}><div role="dialog" aria-modal="true" aria-labelledby="status-modal-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><div className={`grid h-11 w-11 place-items-center rounded-xl ${rejected ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>{rejected ? <AlertCircle size={22} /> : <CheckCircle2 size={22} />}</div><h2 id="status-modal-title" className="mt-4 text-xl font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{rejected ? 'Informe o motivo para registrar a decisão no histórico.' : 'Confirme a aprovação deste cadastro.'}</p></div><button title="Fechar janela sem salvar" onClick={onClose} disabled={saving} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40" aria-label="Fechar"><X size={19} /></button></div><label className="mt-5 block"><span className="mb-2 block text-sm font-semibold text-slate-700">{rejected ? 'Motivo da rejeição *' : 'Observações (opcional)'}</span><textarea value={notes} onChange={event => setNotes(event.target.value)} maxLength={2000} rows={4} placeholder={rejected ? 'Descreva o motivo da rejeição...' : 'Adicione uma observação sobre a aprovação...'} className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6b9a7d] focus:ring-4 focus:ring-emerald-50" /></label><div className="mt-2 text-right text-xs text-slate-400">{notes.length}/2000 caracteres</div><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button title="Cancelar alteração de status" onClick={onClose} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button><button title={rejected ? "Confirmar rejeição e registrar o motivo" : "Confirmar aprovação do cadastro"} onClick={() => onConfirm({ status: mode, notes: notes.trim() })} disabled={!canSubmit} className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${rejected ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#286247] hover:bg-[#1d4e37]'}`}>{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{saving ? 'Salvando...' : rejected ? 'Confirmar rejeição' : 'Confirmar aprovação'}</button></div></div></div>
}

export default function RegistrationDetails() {
  const { id } = useParams()
  const { showToast } = useToast()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalMode, setModalMode] = useState('')
  const [saving, setSaving] = useState(false)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const avatarInputRef = useRef(null)

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('')
      return undefined
    }
    const previewUrl = URL.createObjectURL(avatarFile)
    setAvatarPreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [avatarFile])

  const loadPet = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await adminApi.getRegistration(id)
      setPet(result.data || null)
    } catch (err) {
      setError(err.message || 'Não foi possível carregar o cadastro.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { loadPet() }, [loadPet])

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast({ type: 'warning', title: 'Formato não permitido', message: 'Escolha uma imagem JPG, PNG ou WebP.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast({ type: 'warning', title: 'Imagem muito grande', message: 'A foto deve ter no máximo 5 MB.' })
      return
    }
    setAvatarFile(file)
  }

  async function handleSaveAvatar() {
    if (!avatarFile) return
    setAvatarSaving(true)
    try {
      await adminApi.updatePetAvatar(id, avatarFile)
      showToast({ type: 'success', title: 'Foto atualizada!', message: `O avatar de ${pet?.name || 'seu pet'} foi salvo.` })
      setAvatarFile(null)
      await loadPet()
    } catch (error) {
      showToast({ type: 'error', title: 'Não foi possível atualizar a foto', message: error.message })
    } finally { setAvatarSaving(false) }
  }

  async function handleRemoveAvatar() {
    if (!pet?.avatar?.url) return
    setAvatarSaving(true)
    try {
      await adminApi.removePetAvatar(id)
      setAvatarFile(null)
      showToast({ type: 'success', title: 'Foto removida', message: `O avatar de ${pet?.name || 'seu pet'} foi removido.` })
      await loadPet()
    } catch (error) {
      showToast({ type: 'error', title: 'Não foi possível remover a foto', message: error.message })
    } finally { setAvatarSaving(false) }
  }

  async function handleStatusChange(payload) {
    setSaving(true)
    try {
      await adminApi.updateRegistrationStatus(id, payload)
      setModalMode('')
      showToast(payload.status === 'approved'
        ? { type: 'success', title: `${pet?.name || 'Pet'} aprovado!`, message: 'O cadastro foi aprovado e o histórico administrativo foi atualizado.' }
        : { type: 'warning', title: 'Reprovação registrada', message: `O cadastro de ${pet?.name || 'pet'} foi rejeitado e o motivo foi salvo no histórico.` })
      await loadPet()
    } catch (err) {
      const message = err.message || 'Não foi possível atualizar o status.'
      showToast({ type: 'error', title: 'Não foi possível salvar a decisão', message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Carregando ficha do pet..." />
  if (error || !pet) return <div className="space-y-4"><Link to="/admin/cadastros" className="inline-flex items-center gap-2 text-sm font-semibold text-[#286247]"><ArrowLeft size={16} />Voltar aos cadastros</Link><div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error || 'Cadastro não encontrado.'}</div></div>

  const guardian = pet.guardian || {}
  const vaccines = [
    ['Polivalente', pet.vaccines?.polyvalent], ['Antirrábica', pet.vaccines?.rabies], ['Giárdia', pet.vaccines?.giardia], ['Gripe canina', pet.vaccines?.canineFlu],
  ]
  const cards = Array.isArray(pet.vaccinationCards) ? pet.vaccinationCards : []
  const history = Array.isArray(pet.statusHistory) ? [...pet.statusHistory].reverse() : []
  const declarations = [
    ['Informações verdadeiras', pet.declarations?.truthfulInformation], ['Saúde adequada', pet.declarations?.adequateHealth], ['Vacinas obrigatórias', pet.declarations?.requiredVaccines], ['Riscos de socialização', pet.declarations?.socializationRisks], ['Medidas emergenciais', pet.declarations?.emergencyMeasures], ['Despesas veterinárias', pet.declarations?.veterinaryExpenses],
  ]

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><Link title="Voltar para a lista de cadastros" to="/admin/cadastros" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#54816b] transition hover:text-[#173f32]"><ArrowLeft size={16} />Voltar aos cadastros</Link><div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold tracking-tight text-slate-900">Ficha de {pet.name || 'pet'}</h1><StatusBadge status={pet.status} /></div><p className="mt-2 text-sm text-slate-500">Cadastro recebido em {formatDate(pet.createdAt)}</p><div className="mt-4 flex flex-wrap items-center gap-3"><div className="h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-[#edf4ef]">{avatarPreview || pet.avatar?.url ? <img src={avatarPreview || pet.avatar.url} alt={`Pré-visualização da foto de ${pet.name}`} className="h-full w-full object-cover"/> : <div className="grid h-full w-full place-items-center text-[#54816b]"><PawPrint size={30}/></div>}</div><div className="flex flex-wrap gap-2"><input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange}/><button type="button" title="Selecionar ou trocar a foto do pet" disabled={avatarSaving} onClick={() => avatarInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-[#d7e5db] bg-white px-3 py-2 text-xs font-semibold text-[#286247] hover:bg-[#edf4ef] disabled:opacity-50"><Camera size={15}/>{avatarFile ? 'Escolher outra' : pet.avatar?.url ? 'Trocar foto' : 'Adicionar foto'}</button>{avatarFile && <><button type="button" title="Salvar a pré-visualização como avatar do pet" disabled={avatarSaving} onClick={handleSaveAvatar} className="inline-flex items-center gap-2 rounded-xl bg-[#286247] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1d4e37] disabled:opacity-50">{avatarSaving ? 'Salvando...' : 'Salvar foto'}</button><button type="button" title="Cancelar a foto selecionada" disabled={avatarSaving} onClick={() => setAvatarFile(null)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button></>}{pet.avatar?.url && !avatarFile && <button type="button" title="Remover a foto atual do pet" disabled={avatarSaving} onClick={handleRemoveAvatar} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"><Trash2 size={15}/>Remover</button>}</div><p className="w-full text-xs text-slate-400">JPG, PNG ou WebP · até 5 MB</p></div></div><div className="flex flex-wrap gap-2">{pet.status !== 'approved' && <Tooltip content="Aprovar este cadastro após conferir os dados e documentos"><button title="Aprovar este cadastro após a análise" onClick={() => setModalMode('approved')} className="inline-flex items-center gap-2 rounded-xl bg-[#286247] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4e37]"><CheckCircle2 size={16} />Aprovar</button></Tooltip>}{pet.status !== 'rejected' && <Tooltip content="Rejeitar o cadastro e registrar uma justificativa obrigatória"><button title="Rejeitar este cadastro e informar o motivo" onClick={() => setModalMode('rejected')} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"><X size={16} />Rejeitar</button></Tooltip>}</div></div>


    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <Section title="Informações do pet" icon={PawPrint}><div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><Info label="Nome" value={pet.name} /><Info label="Raça" value={pet.breed} /><Info label="Sexo" value={pet.sex === 'female' ? 'Fêmea' : pet.sex === 'male' ? 'Macho' : '—'} /><div><p className="text-xs font-medium text-slate-400">Castrado(a)</p><div className="mt-1"><YesNo value={pet.neutered} /></div></div><Info label="Cadastro criado em" value={formatDate(pet.createdAt)} /><Info label="Última atualização" value={formatDate(pet.updatedAt)} /></div></Section>

        <Section title="Saúde e vacinação" icon={HeartPulse}><div className="grid gap-5 sm:grid-cols-2"><div><p className="mb-3 text-sm font-semibold text-slate-700">Vacinas obrigatórias</p><div className="space-y-3">{vaccines.map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-slate-50 pb-2"><span className="text-sm text-slate-600">{label}</span><YesNo value={value} /></div>)}</div></div><div className="space-y-4"><Info label="Última vermifugação" value={formatDate(pet.lastDewormingDate)} /><Info label="Produto antipulgas" value={pet.fleaTreatmentProduct} /><Info label="Último antipulgas" value={formatDate(pet.lastFleaTreatmentDate)} /></div></div><div className="mt-6 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2"><div><p className="text-sm font-semibold text-slate-700">Possui alergias?</p><div className="mt-2"><YesNo value={pet.hasAllergies} /></div>{pet.hasAllergies && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{pet.allergyDetails || 'Detalhes não informados.'}</p>}</div><div><p className="text-sm font-semibold text-slate-700">Faz uso de medicamentos?</p><div className="mt-2"><YesNo value={pet.takesMedication} /></div>{pet.takesMedication && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-sky-50 p-3 text-sm text-sky-800">{pet.medicationDetails || 'Detalhes não informados.'}</p>}</div></div></Section>

        <Section title="Documentos de vacinação" icon={FileText}><p className="mb-4 text-sm text-slate-500">Pré-visualize os arquivos enviados pelo tutor. Clique em um documento para abri-lo em tamanho completo.</p>{cards.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">Nenhum documento anexado.</div> : <div className="grid gap-4 sm:grid-cols-2">{cards.map((card, index) => { const isPdf = card.mimeType === 'application/pdf' || card.resourceType === 'raw' || card.originalName?.toLowerCase().endsWith('.pdf'); return <a title={`Visualizar ${card.originalName || `documento ${index + 1}`} em nova aba`} key={`${card.publicId || card.url}-${index}`} href={card.url} target="_blank" rel="noreferrer" className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-[#a8c6b0] hover:shadow-md">{isPdf ? <div className="flex h-44 flex-col items-center justify-center gap-3 bg-gradient-to-br from-rose-50 to-stone-100 text-rose-600"><FileText size={44} strokeWidth={1.4} /><span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold tracking-wider">DOCUMENTO PDF</span></div> : <div className="h-44 overflow-hidden bg-slate-100"><img src={card.url} alt={`Pré-visualização de ${card.originalName || `documento ${index + 1}`}`} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /></div>}<div className="flex min-w-0 items-center justify-between gap-3 p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-700">{card.originalName || `Documento ${index + 1}`}</p><p className="mt-1 text-xs text-slate-400">{isPdf ? 'PDF' : 'Imagem'}{card.size ? ` · ${(card.size / 1024 / 1024).toFixed(1)} MB` : ''}</p></div><span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#edf4ef] px-2.5 py-2 text-xs font-semibold text-[#286247]"><ExternalLink size={14} />Abrir</span></div></a> })}</div>}</Section>

        <Section title="Informações veterinárias" icon={Stethoscope}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Info label="Clínica veterinária" value={pet.veterinarian?.clinic} /><Info label="Veterinário(a)" value={pet.veterinarian?.name} /><Info label="Telefone" value={pet.veterinarian?.phone} /></div></Section>

        <Section title="Autorizações e declarações" icon={ShieldCheck}><div className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-[#f5f8f5] p-4"><div><p className="text-sm font-semibold text-slate-700">Autorização para emergência</p><p className="mt-1 text-xs text-slate-500">Permissão registrada pelo responsável.</p></div><YesNo value={pet.emergencyAuthorization} /></div><div className="grid gap-3 sm:grid-cols-2">{declarations.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5"><span className="text-sm text-slate-600">{label}</span><YesNo value={value} /></div>)}</div></Section>

        <Section title="Histórico administrativo" icon={ClipboardList}><div className="mb-4"><p className="text-xs font-medium text-slate-400">Observação administrativa atual</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{pet.adminNotes || 'Nenhuma observação registrada.'}</p></div>{history.length === 0 ? <p className="border-t border-slate-100 pt-4 text-sm text-slate-400">Ainda não há alterações registradas.</p> : <div className="space-y-4 border-t border-slate-100 pt-4">{history.map((entry, index) => <div key={`${entry.changedAt || index}-${index}`} className="relative pl-5 before:absolute before:bottom-0 before:left-1 before:top-1 before:w-px before:bg-slate-200 last:before:hidden"><span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[#6b9a7d] ring-4 ring-[#edf4ef]" /><div className="flex flex-wrap items-center gap-2"><StatusBadge status={entry.status} /><span className="text-xs text-slate-400">{formatDate(entry.changedAt)}</span></div>{entry.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{entry.notes}</p>}<p className="mt-1 text-xs text-slate-400">{entry.changedBy?.name || 'Administrador'}</p></div>)}</div>}</Section>
      </div>

      <aside className="space-y-6">
        <Section title="Tutor responsável" icon={UserRound}><div className="space-y-4"><div><p className="text-lg font-bold text-slate-800">{guardian.name || 'Tutor não informado'}</p><p className="mt-1 text-xs text-slate-400">Responsável pelo cadastro</p></div><div className="space-y-3 border-t border-slate-100 pt-4"><div className="flex items-start gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-[#54816b]" /><p className="break-all text-sm text-slate-600">{guardian.email || '—'}</p></div><div className="flex items-start gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-[#54816b]" /><p className="text-sm text-slate-600">{guardian.phone || '—'}</p></div><div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-[#54816b]" /><p className="text-sm text-slate-600">{guardian.address || '—'}</p></div></div><div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4"><Info label="CPF" value={guardian.cpf} /><Info label="RG" value={guardian.rg} /></div><Link title={`Consultar os pets de ${guardian.name || 'este tutor'}`} to={`/admin/tutores/${guardian._id}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d7e5db] px-4 py-2.5 text-sm font-semibold text-[#286247] transition hover:bg-[#edf4ef]">Ver pets deste tutor <ExternalLink size={15} /></Link></div></Section>
        <Section title="Resumo da análise" icon={ClipboardList}><div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Status atual</span><StatusBadge status={pet.status} /></div><Info label="Analisado em" value={formatDate(pet.reviewedAt)} /><Info label="Responsável pela análise" value={pet.reviewedBy?.name} /></div></Section>
        {pet.status === 'pending_review' && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="flex items-start gap-2.5"><AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-700" /><div><p className="text-sm font-bold text-amber-900">Cadastro aguardando avaliação</p><p className="mt-1 text-xs leading-5 text-amber-800">Confira as informações de saúde e os documentos antes de aprovar o cadastro.</p></div></div></div>}
      </aside>
    </div>
    {modalMode && <StatusActionModal mode={modalMode} onClose={() => !saving && setModalMode('')} onConfirm={handleStatusChange} saving={saving} />}
  </div>
}
