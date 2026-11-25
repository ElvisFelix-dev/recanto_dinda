
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  HeartPulse,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'

import { adminApi } from '../../services/api'
import StatusBadge from '../components/StatusBadge'
import LoadingState from '../components/LoadingState'
import { useToast } from '../contexts/ToastContext'
import Tooltip from '../components/Tooltip'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
  }).format(date)
}

function YesNo({ value }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
        value ? 'text-[#A63C70]' : 'text-[#A18D85]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          value ? 'bg-[#D94D91]' : 'bg-[#D8C9C2]'
        }`}
      />
      {value ? 'Sim' : 'Não'}
    </span>
  )
}

function Info({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[#A18D85]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#593A31]">
        {value === null || value === undefined || value === ''
          ? '—'
          : String(value)}
      </p>
    </div>
  )
}

function Section({ title, icon: Icon, children, action }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#f0e3dd] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#f0e3dd] bg-[#FFFCFA] px-5 py-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
            <Icon size={19} />
          </div>

          <h2 className="font-bold text-[#593A31]">
            {title}
          </h2>
        </div>

        {action}
      </div>

      <div className="p-5 md:p-6">
        {children}
      </div>
    </section>
  )
}

function StatusActionModal({ mode, onClose, onConfirm, saving }) {
  const [notes, setNotes] = useState('')

  const rejected = mode === 'rejected'

  const title = rejected
    ? 'Rejeitar cadastro'
    : 'Aprovar cadastro'

  const canSubmit = !saving && (!rejected || notes.trim().length > 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#39231f]/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !saving) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
        className="w-full max-w-lg rounded-2xl border border-[#f0e3dd] bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className={`grid h-12 w-12 place-items-center rounded-2xl ${
                rejected
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-[#FCE2ED] text-[#D94D91]'
              }`}
            >
              {rejected ? (
                <AlertCircle size={23} />
              ) : (
                <CheckCircle2 size={23} />
              )}
            </div>

            <h2
              id="status-modal-title"
              className="mt-4 text-xl font-bold text-[#593A31]"
            >
              {title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#927B72]">
              {rejected
                ? 'Informe o motivo para registrar a decisão no histórico.'
                : 'Confirme a aprovação deste cadastro.'}
            </p>
          </div>

          <button
            type="button"
            title="Fechar janela sem salvar"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar"
            className="rounded-xl p-2 text-[#A18D85] transition hover:bg-[#FFF8F3] hover:text-[#593A31] disabled:opacity-40"
          >
            <X size={19} />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold text-[#593A31]">
            {rejected
              ? 'Motivo da rejeição *'
              : 'Observações (opcional)'}
          </span>

          <textarea
            value={notes}
            onChange={event => setNotes(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder={
              rejected
                ? 'Descreva o motivo da rejeição...'
                : 'Adicione uma observação sobre a aprovação...'
            }
            className="w-full resize-y rounded-xl border border-[#eadbd5] bg-white px-4 py-3 text-sm text-[#593A31] outline-none transition placeholder:text-[#b5a19a] focus:border-[#D94D91] focus:ring-4 focus:ring-[#F4C9DA]/40"
          />
        </label>

        <div className="mt-2 text-right text-xs text-[#A18D85]">
          {notes.length}/2000 caracteres
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            title="Cancelar alteração de status"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-[#eadbd5] px-4 py-2.5 text-sm font-semibold text-[#806B63] transition hover:bg-[#FFF8F3] disabled:opacity-40"
          >
            Cancelar
          </button>

          <button
            type="button"
            title={
              rejected
                ? 'Confirmar rejeição e registrar o motivo'
                : 'Confirmar aprovação do cadastro'
            }
            onClick={() =>
              onConfirm({
                status: mode,
                notes: notes.trim(),
              })
            }
            disabled={!canSubmit}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
              rejected
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#D94D91] hover:bg-[#bd3d7b]'
            }`}
          >
            {saving ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}

            {saving
              ? 'Salvando...'
              : rejected
                ? 'Confirmar rejeição'
                : 'Confirmar aprovação'}
          </button>
        </div>
      </div>
    </div>
  )
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

  useEffect(() => {
    loadPet()
  }, [loadPet])

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast({
        type: 'warning',
        title: 'Formato não permitido',
        message: 'Escolha uma imagem JPG, PNG ou WebP.',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: 'warning',
        title: 'Imagem muito grande',
        message: 'A foto deve ter no máximo 5 MB.',
      })
      return
    }

    setAvatarFile(file)
  }

  async function handleSaveAvatar() {
    if (!avatarFile) return

    setAvatarSaving(true)

    try {
      await adminApi.updatePetAvatar(id, avatarFile)

      showToast({
        type: 'success',
        title: 'Foto atualizada!',
        message: `O avatar de ${pet?.name || 'seu pet'} foi salvo.`,
      })

      setAvatarFile(null)
      await loadPet()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Não foi possível atualizar a foto',
        message: error.message,
      })
    } finally {
      setAvatarSaving(false)
    }
  }

  async function handleRemoveAvatar() {
    if (!pet?.avatar?.url) return

    setAvatarSaving(true)

    try {
      await adminApi.removePetAvatar(id)
      setAvatarFile(null)

      showToast({
        type: 'success',
        title: 'Foto removida',
        message: `O avatar de ${pet?.name || 'seu pet'} foi removido.`,
      })

      await loadPet()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Não foi possível remover a foto',
        message: error.message,
      })
    } finally {
      setAvatarSaving(false)
    }
  }

  function handleWhatsAppApprovalMessage() {
    const digits = String(guardian.phone || '').replace(/\D/g, '')

    if (!digits) {
      showToast({
        type: 'warning',
        title: 'Telefone não informado',
        message:
          'Cadastre um telefone para o tutor antes de abrir o WhatsApp.',
      })
      return
    }

    const phone = digits.startsWith('55') ? digits : `55${digits}`

    const message = `Olá, ${guardian.name || 'tudo bem'}! 🐾

Temos uma ótima notícia! O cadastro do ${pet.name || 'seu pet'} foi aprovado pela equipe do Recanto da Dinda! 💗

Estamos muito felizes em recebê-lo em nossa família!

Em breve, nossa equipe poderá entrar em contato para orientar sobre os próximos passos.

Com carinho,
Equipe Recanto da Dinda.`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleStatusChange(payload) {
    setSaving(true)

    try {
      await adminApi.updateRegistrationStatus(id, payload)
      setModalMode('')

      showToast(
        payload.status === 'approved'
          ? {
              type: 'success',
              title: `${pet?.name || 'Pet'} aprovado!`,
              message:
                'O cadastro foi aprovado e o histórico administrativo foi atualizado.',
            }
          : {
              type: 'warning',
              title: 'Reprovação registrada',
              message: `O cadastro de ${pet?.name || 'pet'} foi rejeitado e o motivo foi salvo no histórico.`,
            }
      )

      await loadPet()
    } catch (err) {
      const message =
        err.message || 'Não foi possível atualizar o status.'

      showToast({
        type: 'error',
        title: 'Não foi possível salvar a decisão',
        message,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingState label="Carregando ficha do pet..." />
  }

  if (error || !pet) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/cadastros"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#A63C70] transition hover:text-[#593A31]"
        >
          <ArrowLeft size={16} />
          Voltar aos cadastros
        </Link>

        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700"
        >
          {error || 'Cadastro não encontrado.'}
        </div>
      </div>
    )
  }

  const guardian = pet.guardian || {}

  const vaccines = [
    ['Polivalente', pet.vaccines?.polyvalent],
    ['Antirrábica', pet.vaccines?.rabies],
    ['Giárdia', pet.vaccines?.giardia],
    ['Gripe canina', pet.vaccines?.canineFlu],
  ]

  const cards = Array.isArray(pet.vaccinationCards)
    ? pet.vaccinationCards
    : []

  const history = Array.isArray(pet.statusHistory)
    ? [...pet.statusHistory].reverse()
    : []

  const declarations = [
    ['Informações verdadeiras', pet.declarations?.truthfulInformation],
    ['Saúde adequada', pet.declarations?.adequateHealth],
    ['Vacinas obrigatórias', pet.declarations?.requiredVaccines],
    ['Riscos de socialização', pet.declarations?.socializationRisks],
    ['Medidas emergenciais', pet.declarations?.emergencyMeasures],
    ['Despesas veterinárias', pet.declarations?.veterinaryExpenses],
  ]

  return (
    <div className="min-h-full space-y-6">

      {/* Cabeçalho e identificação */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <Link
            title="Voltar para a lista de cadastros"
            to="/admin/cadastros"
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#A63C70] transition hover:text-[#593A31]"
          >
            <ArrowLeft size={16} />
            Voltar aos cadastros
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#593A31] sm:text-3xl">
              Ficha de {pet.name || 'pet'}
            </h1>

            <StatusBadge status={pet.status} />
          </div>

          <p className="mt-2 text-sm text-[#927B72]">
            Cadastro recebido em {formatDate(pet.createdAt)}
          </p>

          {/* Avatar e ações da foto */}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#f0e3dd] bg-[#FFF8F3] shadow-sm">
              {avatarPreview || pet.avatar?.url ? (
                <img
                  src={avatarPreview || pet.avatar.url}
                  alt={`Pré-visualização da foto de ${pet.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-[#D94D91]">
                  <PawPrint size={34} />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-wrap gap-2">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                title="Selecionar ou trocar a foto do pet"
                disabled={avatarSaving}
                onClick={() => avatarInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#F4C9DA] bg-white px-3 py-2 text-xs font-bold text-[#A63C70] transition hover:bg-[#FCE2ED] disabled:opacity-50"
              >
                <Camera size={15} />
                {avatarFile
                  ? 'Escolher outra'
                  : pet.avatar?.url
                    ? 'Trocar foto'
                    : 'Adicionar foto'}
              </button>

              {avatarFile && (
                <>
                  <button
                    type="button"
                    title="Salvar a pré-visualização como avatar do pet"
                    disabled={avatarSaving}
                    onClick={handleSaveAvatar}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#D94D91] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#bd3d7b] disabled:opacity-50"
                  >
                    {avatarSaving && (
                      <LoaderCircle size={14} className="animate-spin" />
                    )}
                    {avatarSaving ? 'Salvando...' : 'Salvar foto'}
                  </button>

                  <button
                    type="button"
                    title="Cancelar a foto selecionada"
                    disabled={avatarSaving}
                    onClick={() => setAvatarFile(null)}
                    className="rounded-xl border border-[#eadbd5] px-3 py-2 text-xs font-semibold text-[#806B63] transition hover:bg-[#FFF8F3]"
                  >
                    Cancelar
                  </button>
                </>
              )}

              {pet.avatar?.url && !avatarFile && (
                <button
                  type="button"
                  title="Remover a foto atual do pet"
                  disabled={avatarSaving}
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Remover
                </button>
              )}

              <p className="w-full text-xs text-[#A18D85]">
                JPG, PNG ou WebP · até 5 MB
              </p>
            </div>
          </div>
        </div>

        {/* Ações administrativas */}
        <div className="flex flex-wrap gap-2">
          {pet.status === 'approved' && (
            <Tooltip content="Abrir o WhatsApp com uma mensagem pronta para avisar o tutor da aprovação">
              <button
                type="button"
                title="Enviar mensagem de aprovação ao tutor pelo WhatsApp"
                onClick={handleWhatsAppApprovalMessage}
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1da851]"
              >
                <MessageCircle size={16} />
                Avisar tutor pelo WhatsApp
              </button>
            </Tooltip>
          )}

          {pet.status !== 'approved' && (
            <Tooltip content="Aprovar este cadastro após conferir os dados e documentos">
              <button
                type="button"
                title="Aprovar este cadastro após a análise"
                onClick={() => setModalMode('approved')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D94D91] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#bd3d7b]"
              >
                <CheckCircle2 size={16} />
                Aprovar
              </button>
            </Tooltip>
          )}

          {pet.status !== 'rejected' && (
            <Tooltip content="Rejeitar o cadastro e registrar uma justificativa obrigatória">
              <button
                type="button"
                title="Rejeitar este cadastro e informar o motivo"
                onClick={() => setModalMode('rejected')}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
              >
                <X size={16} />
                Rejeitar
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

        <div className="min-w-0 space-y-6">

          {/* Informações do pet */}
          <Section title="Informações do pet" icon={PawPrint}>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Nome" value={pet.name} />
              <Info label="Raça" value={pet.breed} />

              <Info
                label="Sexo"
                value={
                  pet.sex === 'female'
                    ? 'Fêmea'
                    : pet.sex === 'male'
                      ? 'Macho'
                      : '—'
                }
              />

              <div>
                <p className="text-xs font-medium text-[#A18D85]">
                  Castrado(a)
                </p>
                <div className="mt-1">
                  <YesNo value={pet.neutered} />
                </div>
              </div>

              <Info
                label="Cadastro criado em"
                value={formatDate(pet.createdAt)}
              />

              <Info
                label="Última atualização"
                value={formatDate(pet.updatedAt)}
              />
            </div>
          </Section>

          {/* Saúde */}
          <Section title="Saúde e vacinação" icon={HeartPulse}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-bold text-[#593A31]">
                  Vacinas obrigatórias
                </p>

                <div className="space-y-3">
                  {vaccines.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 border-b border-[#f4ebe6] pb-2.5"
                    >
                      <span className="text-sm text-[#806B63]">
                        {label}
                      </span>

                      <YesNo value={value} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <Info
                  label="Última vermifugação"
                  value={formatDate(pet.lastDewormingDate)}
                />

                <Info
                  label="Produto antipulgas"
                  value={pet.fleaTreatmentProduct}
                />

                <Info
                  label="Último antipulgas"
                  value={formatDate(pet.lastFleaTreatmentDate)}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-5 border-t border-[#f0e3dd] pt-5 sm:grid-cols-2">
              <div>
                <p className="text-sm font-bold text-[#593A31]">
                  Possui alergias?
                </p>

                <div className="mt-2">
                  <YesNo value={pet.hasAllergies} />
                </div>

                {pet.hasAllergies && (
                  <p className="mt-3 whitespace-pre-wrap rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
                    {pet.allergyDetails || 'Detalhes não informados.'}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-[#593A31]">
                  Faz uso de medicamentos?
                </p>

                <div className="mt-2">
                  <YesNo value={pet.takesMedication} />
                </div>

                {pet.takesMedication && (
                  <p className="mt-3 whitespace-pre-wrap rounded-xl border border-sky-100 bg-sky-50 p-3 text-sm leading-6 text-sky-800">
                    {pet.medicationDetails || 'Detalhes não informados.'}
                  </p>
                )}
              </div>
            </div>
          </Section>

          {/* Documentos */}
          <Section title="Documentos de vacinação" icon={FileText}>
            <p className="mb-5 text-sm leading-6 text-[#927B72]">
              Pré-visualize os arquivos enviados pelo tutor. Clique em um
              documento para abri-lo em tamanho completo.
            </p>

            {cards.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#eadbd5] bg-[#FFFCFA] px-4 py-10 text-center">
                <FileText
                  size={28}
                  className="mx-auto text-[#D8B8AA]"
                />

                <p className="mt-3 text-sm font-semibold text-[#806B63]">
                  Nenhum documento anexado.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((card, index) => {
                  const isPdf =
                    card.mimeType === 'application/pdf' ||
                    card.resourceType === 'raw' ||
                    card.originalName?.toLowerCase().endsWith('.pdf')

                  return (
                    <a
                      title={`Visualizar ${
                        card.originalName || `documento ${index + 1}`
                      } em nova aba`}
                      key={`${card.publicId || card.url}-${index}`}
                      href={card.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group min-w-0 overflow-hidden rounded-2xl border border-[#f0e3dd] bg-white transition hover:-translate-y-0.5 hover:border-[#D94D91]/50 hover:shadow-md"
                    >
                      {isPdf ? (
                        <div className="flex h-44 flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#FFF1F6] to-[#FFF8F3] text-[#D94D91]">
                          <FileText size={44} strokeWidth={1.4} />

                          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#A63C70]">
                            DOCUMENTO PDF
                          </span>
                        </div>
                      ) : (
                        <div className="h-44 overflow-hidden bg-[#FFF8F3]">
                          <img
                            src={card.url}
                            alt={`Pré-visualização de ${
                              card.originalName || `documento ${index + 1}`
                            }`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="flex min-w-0 items-center justify-between gap-3 p-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#593A31]">
                            {card.originalName || `Documento ${index + 1}`}
                          </p>

                          <p className="mt-1 text-xs text-[#A18D85]">
                            {isPdf ? 'PDF' : 'Imagem'}
                            {card.size
                              ? ` · ${(card.size / 1024 / 1024).toFixed(1)} MB`
                              : ''}
                          </p>
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#FCE2ED] px-2.5 py-2 text-xs font-bold text-[#A63C70]">
                          <ExternalLink size={14} />
                          Abrir
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </Section>

          {/* Veterinário */}
          <Section title="Informações veterinárias" icon={Stethoscope}>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Info
                label="Clínica veterinária"
                value={pet.veterinarian?.clinic}
              />

              <Info
                label="Veterinário(a)"
                value={pet.veterinarian?.name}
              />

              <Info
                label="Telefone"
                value={pet.veterinarian?.phone}
              />
            </div>
          </Section>

          {/* Declarações */}
          <Section title="Autorizações e declarações" icon={ShieldCheck}>
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#F4C9DA]/70 bg-[#FFF1F6] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#593A31]">
                  Autorização para emergência
                </p>

                <p className="mt-1 text-xs text-[#927B72]">
                  Permissão registrada pelo responsável.
                </p>
              </div>

              <YesNo value={pet.emergencyAuthorization} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {declarations.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#f0e3dd] px-3 py-3"
                >
                  <span className="text-sm text-[#806B63]">
                    {label}
                  </span>

                  <YesNo value={value} />
                </div>
              ))}
            </div>
          </Section>

          {/* Histórico */}
          <Section title="Histórico administrativo" icon={ClipboardList}>
            <div className="mb-5 rounded-xl bg-[#FFF8F3] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#A18D85]">
                Observação administrativa atual
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#593A31]">
                {pet.adminNotes || 'Nenhuma observação registrada.'}
              </p>
            </div>

            {history.length === 0 ? (
              <p className="border-t border-[#f0e3dd] pt-4 text-sm text-[#A18D85]">
                Ainda não há alterações registradas.
              </p>
            ) : (
              <div className="space-y-5 border-t border-[#f0e3dd] pt-5">
                {history.map((entry, index) => (
                  <div
                    key={`${entry.changedAt || index}-${index}`}
                    className="relative pl-6 before:absolute before:bottom-0 before:left-1 before:top-1 before:w-px before:bg-[#eadbd5] last:before:hidden"
                  >
                    <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[#D94D91] ring-4 ring-[#FCE2ED]" />

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={entry.status} />

                      <span className="text-xs text-[#A18D85]">
                        {formatDate(entry.changedAt)}
                      </span>
                    </div>

                    {entry.notes && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#806B63]">
                        {entry.notes}
                      </p>
                    )}

                    <p className="mt-2 text-xs font-medium text-[#A18D85]">
                      {entry.changedBy?.name || 'Administrador'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Coluna lateral */}
        <aside className="space-y-6">

          {/* Tutor */}
          <Section title="Tutor responsável" icon={UserRound}>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-bold text-[#593A31]">
                  {guardian.name || 'Tutor não informado'}
                </p>

                <p className="mt-1 text-xs text-[#A18D85]">
                  Responsável pelo cadastro
                </p>
              </div>

              <div className="space-y-4 border-t border-[#f0e3dd] pt-4">
                <div className="flex items-start gap-3">
                  <Mail
                    size={17}
                    className="mt-0.5 shrink-0 text-[#D94D91]"
                  />

                  <p className="break-all text-sm text-[#806B63]">
                    {guardian.email || '—'}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={17}
                    className="mt-0.5 shrink-0 text-[#D94D91]"
                  />

                  <p className="text-sm text-[#806B63]">
                    {guardian.phone || '—'}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#D94D91]"
                  />

                  <p className="text-sm leading-6 text-[#806B63]">
                    {guardian.address || '—'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[#f0e3dd] pt-4">
                <Info label="CPF" value={guardian.cpf} />
                <Info label="RG" value={guardian.rg} />
              </div>

              <Link
                title={`Consultar os pets de ${guardian.name || 'este tutor'}`}
                to={`/admin/tutores/${guardian._id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#F4C9DA] px-4 py-2.5 text-sm font-bold text-[#A63C70] transition hover:bg-[#FCE2ED]"
              >
                Ver pets deste tutor
                <ExternalLink size={15} />
              </Link>
            </div>
          </Section>

          {/* Resumo da análise */}
          <Section title="Resumo da análise" icon={ClipboardList}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-[#927B72]">
                  Status atual
                </span>

                <StatusBadge status={pet.status} />
              </div>

              <div className="border-t border-[#f0e3dd] pt-4">
                <Info
                  label="Analisado em"
                  value={formatDate(pet.reviewedAt)}
                />
              </div>

              <div className="border-t border-[#f0e3dd] pt-4">
                <Info
                  label="Responsável pela análise"
                  value={pet.reviewedBy?.name}
                />
              </div>
            </div>
          </Section>

          {/* Aviso de pendência */}
          {pet.status === 'pending_review' && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-amber-700"
                />

                <div>
                  <p className="text-sm font-bold text-amber-900">
                    Cadastro aguardando avaliação
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    Confira as informações de saúde e os documentos
                    antes de aprovar o cadastro.
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Modal de aprovação/rejeição */}
      {modalMode && (
        <StatusActionModal
          mode={modalMode}
          onClose={() => !saving && setModalMode('')}
          onConfirm={handleStatusChange}
          saving={saving}
        />
      )}
    </div>
  )
}
