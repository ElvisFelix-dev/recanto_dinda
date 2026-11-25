
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { hotelApi } from '../../services/api'
import {
  CalendarDays,
  RefreshCw,
  Check,
  X,
  Hotel,
  PawPrint,
  Clock,
  ArrowRight,
  CalendarPlus,
  AlertCircle,
  CheckCircle2,
  UserRound,
} from 'lucide-react'

const STATUS = [
  { value: 'pending', label: 'Pendentes' },
  { value: 'approved', label: 'Aprovadas' },
  { value: 'rejected', label: 'Recusadas' },
  { value: 'completed', label: 'Concluídas' },
  { value: 'cancelled', label: 'Canceladas' },
]

const statusLabels = {
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Recusada',
  completed: 'Concluída',
  cancelled: 'Cancelada',
}

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 border-rose-100',
  completed: 'bg-[#fce2ed] text-[#b63b78] border-[#f4c9da]',
  cancelled: 'bg-stone-100 text-stone-600 border-stone-200',
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function toDateInput(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getNextDay(value) {
  const input = toDateInput(value)
  if (!input) return ''

  const [year, month, day] = input.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  date.setDate(date.getDate() + 1)

  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')
  const nextDay = String(date.getDate()).padStart(2, '0')

  return `${nextYear}-${nextMonth}-${nextDay}`
}

/**
 * Verifica se a data/hora de checkout já passou.
 * Para campos recebidos apenas como YYYY-MM-DD,
 * considera o final daquele dia como limite.
 */
function hasCheckoutExpired(value) {
  if (!value) return false

  let deadline

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    deadline = new Date(year, month - 1, day, 23, 59, 59, 999)
  } else {
    deadline = new Date(value)
  }

  if (Number.isNaN(deadline.getTime())) return false

  return deadline.getTime() < Date.now()
}

function getBookingName(booking) {
  return booking.petSnapshot?.name || 'Pet não identificado'
}

export default function HotelBookings() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [extensionBooking, setExtensionBooking] = useState(null)
  const [extensionDate, setExtensionDate] = useState('')
  const [savingExtension, setSavingExtension] = useState(false)

  /**
   * Busca as hospedagens aprovadas e verifica
   * se alguma já ultrapassou a data de saída.
   *
   * Depois, carrega a aba selecionada.
   */
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const approvedResponse = await hotelApi.getBookings({
        status: 'approved',
      })

      const approvedBookings = approvedResponse.data || []

      const expiredBookings = approvedBookings.filter((booking) =>
        hasCheckoutExpired(booking.requestedCheckOut)
      )

      if (expiredBookings.length > 0) {
        setProcessing(true)

        const results = await Promise.allSettled(
          expiredBookings.map((booking) =>
            hotelApi.updateBooking(booking._id, {
              status: 'completed',
            })
          )
        )

        const failures = results.filter(
          (result) => result.status === 'rejected'
        )

        if (failures.length > 0) {
          setError(
            'Algumas hospedagens expiradas não puderam ser finalizadas. Atualize novamente ou verifique o backend.'
          )
        } else {
          setSuccess(
            `${expiredBookings.length} hospedagem(ns) finalizada(s) automaticamente.`
          )
        }

        setProcessing(false)
      }

      const response = await hotelApi.getBookings({ status })
      setItems(response.data || [])
    } catch (err) {
      setError(err.message || 'Não foi possível carregar as hospedagens.')
    } finally {
      setLoading(false)
      setProcessing(false)
    }
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  /**
   * Atualização de status.
   */
  async function updateBooking(id, nextStatus) {
    setError('')
    setSuccess('')

    try {
      await hotelApi.updateBooking(id, {
        status: nextStatus,
      })

      setSuccess(
        nextStatus === 'approved'
          ? 'Hospedagem aprovada com sucesso!'
          : nextStatus === 'completed'
            ? 'Hospedagem finalizada com sucesso!'
            : 'Status atualizado com sucesso!'
      )

      await load()
    } catch (err) {
      setError(err.message || 'Não foi possível atualizar a hospedagem.')
    }
  }

  /**
   * Abre o formulário para estender a hospedagem.
   */
  function openExtension(booking) {
    setExtensionBooking(booking)
    setExtensionDate(getNextDay(booking.requestedCheckOut))
    setError('')
    setSuccess('')
  }

  function closeExtension() {
    if (savingExtension) return

    setExtensionBooking(null)
    setExtensionDate('')
  }

  /**
   * Atualiza a data de saída da hospedagem.
   */
  async function saveExtension(event) {
    event.preventDefault()

    if (!extensionBooking || !extensionDate) return

    const currentCheckout = toDateInput(
      extensionBooking.requestedCheckOut
    )

    if (extensionDate <= currentCheckout) {
      setError('A nova data de saída deve ser posterior à data atual.')
      return
    }

    setSavingExtension(true)
    setError('')

    try {
      await hotelApi.updateBooking(extensionBooking._id, {
        requestedCheckOut: extensionDate,
      })

      setExtensionBooking(null)
      setExtensionDate('')

      setSuccess(
        `Hospedagem de ${getBookingName(extensionBooking)} estendida com sucesso!`
      )

      await load()
    } catch (err) {
      setError(
        err.message || 'Não foi possível estender a hospedagem.'
      )
    } finally {
      setSavingExtension(false)
    }
  }

  const approvedCount = items.filter(
    (booking) => booking.status === 'approved'
  ).length

  const completedCount = items.filter(
    (booking) => booking.status === 'completed'
  ).length

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#d94d91]">
            <Hotel size={15} />
            Gestão de hospedagens
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#593a31]">
            Hotel
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#927b72]">
            Gerencie solicitações, acompanhe estadias, estenda períodos
            e consulte hospedagens concluídas.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd3] bg-white px-4 py-3 text-sm font-bold text-[#593a31] transition hover:bg-[#fff0f6] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Atualizar
        </button>
      </header>

      {/* AVISOS */}
      {processing && (
        <div className="flex items-center gap-3 rounded-xl border border-[#f4c9da] bg-[#fff0f6] p-4 text-sm text-[#8b3b65]">
          <RefreshCw size={18} className="animate-spin shrink-0" />
          Verificando hospedagens com prazo de saída vencido...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      {/* ABAS */}
      <section className="rounded-2xl border border-[#f0e2da] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {STATUS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatus(tab.value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                status === tab.value
                  ? 'bg-[#593a31] text-white shadow-sm'
                  : 'bg-[#fff8f3] text-[#8b6a5d] hover:bg-[#fce2ed] hover:text-[#b63b78]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* INDICADORES DA ABA */}
      {!loading && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-[#f0e2da] bg-white p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Hotel size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#927b72]">
                Hospedagens aprovadas nesta aba
              </p>
              <p className="text-2xl font-black text-[#593a31]">
                {approvedCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#f0e2da] bg-white p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#fce2ed] text-[#b63b78]">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#927b72]">
                Hospedagens concluídas nesta aba
              </p>
              <p className="text-2xl font-black text-[#593a31]">
                {completedCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LISTAGEM */}
      {loading ? (
        <div className="rounded-2xl border border-[#f0e2da] bg-white p-12 text-center">
          <RefreshCw
            size={25}
            className="mx-auto animate-spin text-[#d94d91]"
          />
          <p className="mt-3 text-sm font-medium text-[#927b72]">
            Carregando hospedagens...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[#f0e2da] bg-white p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
            <Hotel size={28} />
          </div>

          <p className="mt-4 font-bold text-[#593a31]">
            Nenhuma hospedagem encontrada
          </p>

          <p className="mt-1 text-sm text-[#927b72]">
            Não existem registros nesta categoria no momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-[#f0e2da] bg-white shadow-sm transition hover:shadow-md"
            >
              {/* TOPO DO CARD */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f4eae5] p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
                    <PawPrint size={23} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#593a31]">
                      {getBookingName(booking)}
                    </h2>

                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#927b72]">
                      <UserRound size={14} />
                      {booking.guardian?.name || 'Tutor não identificado'}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                    statusStyles[booking.status] || statusStyles.pending
                  }`}
                >
                  {statusLabels[booking.status] || booking.status}
                </span>
              </div>

              {/* INFORMAÇÕES */}
              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">

                <div className="flex items-start gap-3">
                  <CalendarDays size={18} className="mt-0.5 text-[#d94d91]" />
                  <div>
                    <p className="text-xs font-semibold text-[#927b72]">
                      Entrada prevista
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#593a31]">
                      {formatDate(booking.requestedCheckIn)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays size={18} className="mt-0.5 text-[#d94d91]" />
                  <div>
                    <p className="text-xs font-semibold text-[#927b72]">
                      Saída prevista
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#593a31]">
                      {formatDate(booking.requestedCheckOut)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 text-[#d94d91]" />
                  <div>
                    <p className="text-xs font-semibold text-[#927b72]">
                      Raça
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#593a31]">
                      {booking.petSnapshot?.breed || 'Não informado'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#927b72]">
                    Telefone do tutor
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#593a31]">
                    {booking.guardian?.phone || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#927b72]">
                    E-mail
                  </p>
                  <p className="mt-1 break-all text-sm font-bold text-[#593a31]">
                    {booking.guardian?.email || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#927b72]">
                    Vacinas em dia
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#593a31]">
                    {booking.healthInformation?.vaccinesUpToDate
                      ? 'Sim'
                      : 'Não'}
                  </p>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="text-xs font-semibold text-[#927b72]">
                    Tratamento antipulgas
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#593a31]">
                    {booking.healthInformation?.fleaTreatment || '—'}
                  </p>
                </div>
              </div>

              {/* CARTEIRAS E DETALHES */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f4eae5] bg-[#fffdfa] p-5">
                <div className="flex flex-wrap gap-2">
                  {booking.healthInformation?.vaccinationCards?.map(
                    (file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-[#eadbd3] bg-white px-3 py-2 text-xs font-semibold text-[#8b5a49] transition hover:bg-[#fce2ed]"
                      >
                        Carteira {index + 1}
                      </a>
                    )
                  )}
                </div>

                <Link
                  to={`/admin/hotel/${booking._id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd3] bg-white px-4 py-2.5 text-sm font-bold text-[#593a31] transition hover:bg-[#fff0f6]"
                >
                  Ver detalhes
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* AÇÕES */}
              <div className="flex flex-wrap gap-2 border-t border-[#f4eae5] p-5">

                {booking.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateBooking(booking._id, 'approved')}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#593a31] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#765044]"
                    >
                      <Check size={16} />
                      Aprovar hospedagem
                    </button>

                    <button
                      type="button"
                      onClick={() => updateBooking(booking._id, 'rejected')}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                    >
                      <X size={16} />
                      Recusar
                    </button>
                  </>
                )}

                {booking.status === 'approved' && (
                  <>
                    <button
                      type="button"
                      onClick={() => openExtension(booking)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#d94d91] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#bf3d7d]"
                    >
                      <CalendarPlus size={16} />
                      Estender hospedagem
                    </button>

                    <button
                      type="button"
                      onClick={() => updateBooking(booking._id, 'completed')}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd3] bg-white px-4 py-2.5 text-sm font-bold text-[#593a31] transition hover:bg-[#fff0f6]"
                    >
                      <CheckCircle2 size={16} />
                      Finalizar manualmente
                    </button>
                  </>
                )}

                {booking.status === 'completed' && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#b63b78]">
                    <CheckCircle2 size={17} />
                    Hospedagem concluída
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* MODAL DE EXTENSÃO */}
      {extensionBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#33221e]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeExtension()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="extension-title"
            className="my-auto w-full max-w-md rounded-3xl border border-[#f0e2da] bg-[#fff8f3] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
                  <CalendarPlus size={23} />
                </div>

                <h2
                  id="extension-title"
                  className="text-xl font-black text-[#593a31]"
                >
                  Estender hospedagem
                </h2>

                <p className="mt-1 text-sm text-[#927b72]">
                  Altere a data de saída de {getBookingName(extensionBooking)}.
                </p>
              </div>

              <button
                type="button"
                onClick={closeExtension}
                disabled={savingExtension}
                aria-label="Fechar"
                className="rounded-xl p-2 text-[#927b72] transition hover:bg-[#fce2ed] hover:text-[#593a31]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveExtension} className="mt-6 space-y-5">
              <div className="rounded-xl border border-[#eadbd3] bg-white p-4">
                <p className="text-xs font-semibold text-[#927b72]">
                  Saída atual
                </p>
                <p className="mt-1 font-bold text-[#593a31]">
                  {formatDate(extensionBooking.requestedCheckOut)}
                </p>
              </div>

              <div>
                <label
                  htmlFor="new-checkout"
                  className="mb-2 block text-sm font-bold text-[#593a31]"
                >
                  Nova data de saída
                </label>

                <input
                  id="new-checkout"
                  type="date"
                  required
                  min={getNextDay(extensionBooking.requestedCheckOut)}
                  value={extensionDate}
                  onChange={(event) => setExtensionDate(event.target.value)}
                  className="w-full rounded-xl border border-[#eadbd3] bg-white px-4 py-3 text-sm text-[#593a31] outline-none transition focus:border-[#d94d91] focus:ring-4 focus:ring-[#d94d91]/10"
                />

                <p className="mt-2 text-xs text-[#927b72]">
                  A nova data precisa ser posterior à saída atual.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closeExtension}
                  disabled={savingExtension}
                  className="flex-1 rounded-xl border border-[#eadbd3] bg-white px-4 py-3 text-sm font-bold text-[#593a31] transition hover:bg-[#fff0f6]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    savingExtension ||
                    !extensionDate ||
                    extensionDate <= toDateInput(
                      extensionBooking.requestedCheckOut
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d94d91] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#bf3d7d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingExtension ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Confirmar extensão
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
