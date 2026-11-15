import { useEffect, useMemo, useState } from 'react'
import {
  RefreshCw,
  LogIn,
  LogOut,
  CalendarDays,
  Search,
  CheckCircle2,
  Clock3,
  PawPrint,
  Users,
  CircleAlert,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  UserRound,
  CalendarCheck,
} from 'lucide-react'
import { hotelApi } from '../../services/api'

const dateTime = (value) =>
  value
    ? new Date(value).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

const timeOnly = (value) =>
  value
    ? new Date(value).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

const dateKey = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dateFromKey = (key) => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

const formatLongDate = (key) =>
  dateFromKey(key).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

const getActorName = (actor) => {
  if (!actor) return 'Não identificado'
  if (typeof actor === 'string') return 'Usuário registrado'
  return actor.name || actor.email || 'Não identificado'
}

const getDuration = (start, end) => {
  if (!start || !end) return null
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) return null
  const minutes = Math.floor((endMs - startMs) / 60000)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours ? `${hours}h ${String(rest).padStart(2, '0')}min` : `${rest}min`
}

const monthLabel = (date) =>
  date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

function CalendarPanel({ items, month, setMonth, selectedDate, setSelectedDate }) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstWeekday = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const offset = (firstWeekday + 6) % 7
  const todayKey = dateKey(new Date())

  const recordsByDay = useMemo(() => {
    const map = new Map()
    items.forEach((item) => {
      const key = dateKey(item.checkInAt)
      if (!key) return
      map.set(key, (map.get(key) || 0) + 1)
    })
    return map
  }, [items])

  const cells = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  const moveMonth = (amount) => {
    setMonth(new Date(year, monthIndex + amount, 1))
  }

  return (
    <section className="rounded-2xl border border-[#f0e2da] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-[#593a31]">
            <CalendarDays size={19} className="text-[#d94d91]" />
            Calendário de frequência
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Selecione um dia para consultar os pets e os horários.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="rounded-lg border border-[#eadbd3] p-2 text-[#593a31] hover:bg-[#fff8f3]"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="rounded-lg border border-[#eadbd3] p-2 text-[#593a31] hover:bg-[#fff8f3]"
            aria-label="Próximo mês"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-lg font-black capitalize text-[#593a31]">
          {monthLabel(month)}
        </h3>
        <button
          type="button"
          onClick={() => {
            const now = new Date()
            setMonth(new Date(now.getFullYear(), now.getMonth(), 1))
            setSelectedDate(todayKey)
          }}
          className="text-xs font-bold text-[#d94d91] hover:underline"
        >
          Hoje
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="py-2 text-[11px] font-bold uppercase text-stone-400">
            {day}
          </div>
        ))}

        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="min-h-11" />
          const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const count = recordsByDay.get(key) || 0
          const selected = selectedDate === key
          const isToday = todayKey === key

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDate(key)}
              className={`relative flex min-h-11 flex-col items-center justify-center rounded-xl text-sm transition ${
                selected
                  ? 'bg-[#d94d91] font-black text-white shadow-md shadow-[#d94d91]/20'
                  : isToday
                    ? 'border border-[#d94d91] font-bold text-[#b63b78] hover:bg-[#fff8f3]'
                    : 'text-[#593a31] hover:bg-[#fff8f3]'
              }`}
              aria-label={`${day} de ${monthLabel(month)}${count ? `, ${count} registros` : ''}`}
              aria-pressed={selected}
            >
              <span>{day}</span>
              {count > 0 && (
                <span
                  className={`mt-0.5 h-1.5 min-w-1.5 rounded-full px-1 text-[8px] leading-[6px] ${
                    selected ? 'bg-white' : 'bg-[#d94d91]'
                  }`}
                  title={`${count} registro(s)`}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#f4eae5] pt-4 text-xs text-stone-500">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#d94d91]" />
          Dia com frequência registrada
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full border border-[#d94d91]" />
          Hoje
        </span>
      </div>
    </section>
  )
}

function AuditPerson({ label, person }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[#98796d]">
        <UserRound size={15} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-stone-400">
          {label}
        </span>
        <span className="block truncate text-xs font-semibold text-[#593a31]">
          {getActorName(person)}
        </span>
      </span>
    </div>
  )
}

function AttendanceDayList({ items, selectedDate, search }) {
  const dayItems = items
    .filter((item) => dateKey(item.checkInAt) === selectedDate)
    .filter((item) => {
      const normalized = search.trim().toLocaleLowerCase('pt-BR')
      if (!normalized) return true
      return [
        item.pet?.name,
        item.pet?.breed,
        item.guardian?.name,
      ]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalized))
    })
    .sort((a, b) => new Date(a.checkInAt) - new Date(b.checkInAt))

  const present = dayItems.filter((item) => !item.checkOutAt).length
  const finished = dayItems.length - present

  return (
    <section className="overflow-hidden rounded-2xl border border-[#f0e2da] bg-white shadow-sm">
      <div className="border-b border-[#f4eae5] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d94d91]">
              Detalhamento do dia
            </p>
            <h2 className="mt-1 text-lg font-black capitalize text-[#593a31]">
              {formatLongDate(selectedDate)}
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Pets com entrada registrada nesta data.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              {present} presente(s)
            </span>
            <span className="rounded-full bg-[#fce2ed] px-3 py-1.5 text-xs font-bold text-[#b63b78]">
              {finished} finalizado(s)
            </span>
          </div>
        </div>

      </div>

      {dayItems.length === 0 ? (
        <div className="p-10 text-center">
          <CalendarDays size={32} className="mx-auto text-[#d9b9c8]" />
          <p className="mt-3 font-semibold text-[#593a31]">
            Nenhum pet com entrada registrada nesta data.
          </p>
          <p className="mt-1 text-sm text-stone-500">
            Escolha outro dia no calendário para consultar a frequência.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#f4eae5]">
          {dayItems.map((attendance) => {
            const isPresent = !attendance.checkOutAt
            const duration = getDuration(attendance.checkInAt, attendance.checkOutAt)

            return (
              <article key={attendance._id} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
                      <PawPrint size={21} />
                    </span>
                    <div>
                      <h3 className="font-bold text-[#593a31]">
                        {attendance.pet?.name || 'Pet não identificado'}
                      </h3>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {attendance.pet?.breed || 'Raça não informada'}
                        {' · Tutor: '}
                        {attendance.guardian?.name || '—'}
                      </p>
                    </div>
                  </div>

                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    isPresent
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-[#fce2ed] text-[#b63b78]'
                  }`}>
                    {isPresent ? 'Ainda na creche' : 'Saída registrada'}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <LogIn size={17} />
                      <span className="text-xs font-bold uppercase tracking-wide">Entrada</span>
                    </div>
                    <p className="mt-2 text-2xl font-black text-emerald-800">
                      {timeOnly(attendance.checkInAt)}
                    </p>
                    <p className="mt-1 text-xs text-emerald-700">
                      {dateTime(attendance.checkInAt)}
                    </p>
                    <div className="mt-3 border-t border-emerald-200/70 pt-3">
                      <AuditPerson label="Registrado por" person={attendance.checkedInBy} />
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#fff8f3] p-4">
                    <div className="flex items-center gap-2 text-[#98796d]">
                      <LogOut size={17} />
                      <span className="text-xs font-bold uppercase tracking-wide">Saída</span>
                    </div>
                    {attendance.checkOutAt ? (
                      <>
                        <p className="mt-2 text-2xl font-black text-[#593a31]">
                          {timeOnly(attendance.checkOutAt)}
                        </p>
                        <p className="mt-1 text-xs text-[#98796d]">
                          {dateTime(attendance.checkOutAt)}
                        </p>
                        <div className="mt-3 border-t border-[#eadbd3] pt-3">
                          <AuditPerson label="Registrado por" person={attendance.checkedOutBy} />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mt-2 text-lg font-bold text-[#98796d]">Pendente</p>
                        <p className="mt-1 text-xs text-[#98796d]">
                          Aguardando o registro de saída.
                        </p>
                        <div className="mt-3 border-t border-[#eadbd3] pt-3">
                          <AuditPerson label="Registrado por" person={null} />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#f0e2da] px-4 py-3">
                  <span className="text-xs font-semibold text-stone-500">
                    Tempo de permanência
                  </span>
                  <span className="text-sm font-black text-[#593a31]">
                    {duration || (isPresent ? 'Em andamento' : 'Não calculado')}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default function Attendance() {
  const [items, setItems] = useState([])
  const [roster, setRoster] = useState([])
  const [activeTab, setActiveTab] = useState('checkin')
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState('')
  const [historySearch, setHistorySearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()))

  const load = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    try {
      const [attendanceResponse, rosterResponse] = await Promise.all([
        hotelApi.getAttendance(),
        hotelApi.getAttendanceRoster(),
      ])
      setItems(attendanceResponse.data || [])
      setRoster(rosterResponse.data || [])
      setError('')
    } catch (e) {
      setError(e.message || 'Não foi possível carregar a frequência.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const presentCount = roster.filter((pet) => pet.activeAttendance).length
  const pendingPets = roster.filter((pet) => !pet.activeAttendance)
  const presentPets = roster.filter((pet) => pet.activeAttendance)

  const visiblePets = useMemo(() => {
    const source = activeTab === 'checkin' ? pendingPets : presentPets
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
    if (!normalizedSearch) return source
    return source.filter((pet) =>
      [pet.name, pet.breed, pet.guardian?.name]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalizedSearch)),
    )
  }, [activeTab, pendingPets, presentPets, search])

  const togglePet = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const allVisibleSelected =
    visiblePets.length > 0 && visiblePets.every((pet) => selectedIds.includes(String(pet._id)))

  const toggleAllVisible = () => {
    const visibleIds = visiblePets.map((pet) => String(pet._id))
    if (allVisibleSelected) {
      setSelectedIds((current) => current.filter((id) => !visibleIds.includes(id)))
    } else {
      setSelectedIds((current) => [...new Set([...current, ...visibleIds])])
    }
  }

  const changeTab = (tab) => {
    setActiveTab(tab)
    setSelectedIds([])
    setSearch('')
    setNotice('')
    setError('')
  }

  const handleBatchAction = async () => {
    if (!selectedIds.length) {
      setError('Selecione pelo menos um pet para continuar.')
      return
    }

    setBusy(true)
    setError('')
    setNotice('')

    try {
      let response
      if (activeTab === 'checkin') {
        response = await hotelApi.checkInBatch(selectedIds)
      } else {
        const attendanceIds = presentPets
          .filter((pet) => selectedIds.includes(String(pet._id)))
          .map((pet) => String(pet.activeAttendance._id))
        response = await hotelApi.checkOutBatch(attendanceIds)
      }

      const result = response.data
      const failures = (result?.results || []).filter((item) => !item.success)
      const succeeded = result?.succeeded ?? 0
      setNotice(`${succeeded} de ${result?.results?.length || 0} registro(s) concluído(s).`)

      if (failures.length) {
        setError(failures.map((item) => `${item.petName || 'Pet'}: ${item.message}`).join(' • '))
      }

      setSelectedIds([])
      await load(false)
    } catch (e) {
      setError(e.message || 'Não foi possível concluir os registros selecionados.')
    } finally {
      setBusy(false)
    }
  }

  const selectedCount = selectedIds.filter((id) =>
    visiblePets.some((pet) => String(pet._id) === id),
  ).length

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#d94d91]">
            Rotina da creche
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#593a31]">
            Frequência dos pets
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Registre entradas e saídas em lote e consulte o histórico por dia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading || busy}
          className="inline-flex items-center gap-2 rounded-xl border border-[#eadbd3] bg-white px-4 py-3 text-sm font-bold text-[#593a31] transition hover:border-[#d94d91] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Atualizar lista
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#f0e2da] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">Pets aprovados</span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fce2ed] text-[#d94d91]"><PawPrint size={20} /></span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#593a31]">{roster.length}</p>
        </div>
        <div className="rounded-2xl border border-[#f0e2da] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">Presentes agora</span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Users size={20} /></span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#593a31]">{presentCount}</p>
        </div>
        <div className="rounded-2xl border border-[#f0e2da] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">Aguardando entrada</span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><Clock3 size={20} /></span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#593a31]">{pendingPets.length}</p>
        </div>
      </section>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#f0e2da] bg-white shadow-sm">
        <div className="border-b border-[#f4eae5] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#593a31]">Controle de presença</h2>
              <p className="mt-1 text-xs text-stone-500">
                A lista considera somente pets com cadastro aprovado.
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-[#fff8f3] p-1">
              <button
                type="button"
                onClick={() => changeTab('checkin')}
                className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${activeTab === 'checkin' ? 'bg-white text-[#593a31] shadow-sm' : 'text-stone-500 hover:text-[#593a31]'}`}
              >
                Para entrada ({pendingPets.length})
              </button>
              <button
                type="button"
                onClick={() => changeTab('checkout')}
                className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${activeTab === 'checkout' ? 'bg-white text-[#593a31] shadow-sm' : 'text-stone-500 hover:text-[#593a31]'}`}
              >
                Presentes ({presentPets.length})
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar pelo nome, raça ou tutor..."
                className="w-full rounded-xl border border-[#eadbd3] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#d94d91] focus:ring-2 focus:ring-[#d94d91]/10"
              />
            </label>
            <button
              type="button"
              onClick={toggleAllVisible}
              disabled={!visiblePets.length || loading || busy}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadbd3] px-4 py-3 text-sm font-bold text-[#593a31] transition hover:border-[#d94d91] disabled:opacity-50"
            >
              {allVisibleSelected ? <CheckSquare size={17} /> : <Square size={17} />}
              {allVisibleSelected ? 'Desmarcar todos' : 'Selecionar todos'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-stone-500">Carregando pets...</div>
        ) : visiblePets.length === 0 ? (
          <div className="p-12 text-center">
            <PawPrint size={30} className="mx-auto text-[#d9b9c8]" />
            <p className="mt-3 font-semibold text-[#593a31]">
              {activeTab === 'checkin' ? 'Nenhum pet aguardando entrada.' : 'Nenhum pet presente no momento.'}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              {search ? 'Tente alterar sua busca.' : 'Os pets aparecerão aqui conforme os registros forem realizados.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f4eae5]">
            {visiblePets.map((pet) => {
              const id = String(pet._id)
              const checked = selectedIds.includes(id)
              const avatarUrl = pet.avatar?.url || pet.avatar || ''
              return (
                <label
                  key={id}
                  className={`flex cursor-pointer items-center gap-3 px-5 py-4 transition hover:bg-[#fffaf7] sm:px-6 ${checked ? 'bg-[#fff8fb]' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePet(id)}
                    disabled={busy}
                    className="h-5 w-5 rounded border-[#d8c5bb] text-[#d94d91] focus:ring-[#d94d91]"
                  />
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                  ) : (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
                      <PawPrint size={22} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-[#593a31]">{pet.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-stone-500">
                      {pet.breed || 'Raça não informada'} · Tutor: {pet.guardian?.name || '—'}
                    </span>
                    {pet.activeAttendance && (
                      <span className="mt-1 block text-xs text-emerald-700">
                        Entrada às {dateTime(pet.activeAttendance.checkInAt)}
                      </span>
                    )}
                  </span>
                  <span className={`hidden rounded-full px-3 py-1.5 text-xs font-bold sm:inline-flex ${activeTab === 'checkout' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {activeTab === 'checkout' ? 'Presente' : 'Aguardando'}
                  </span>
                </label>
              )
            })}
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-[#f4eae5] bg-[#fffdfb] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-stone-500">
            <strong className="text-[#593a31]">{selectedCount}</strong> pet(s) selecionado(s)
          </p>
          <button
            type="button"
            onClick={handleBatchAction}
            disabled={!selectedCount || busy || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${activeTab === 'checkin' ? 'bg-[#593a31] hover:bg-[#70483d]' : 'bg-[#d94d91] hover:bg-[#bd3d7b]'}`}
          >
            {activeTab === 'checkin' ? <LogIn size={17} /> : <LogOut size={17} />}
            {busy
              ? 'Registrando...'
              : activeTab === 'checkin'
                ? `Registrar entrada (${selectedCount})`
                : `Registrar saída (${selectedCount})`}
          </button>
        </div>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.4fr)]">
        <CalendarPanel
          items={items}
          month={month}
          setMonth={setMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <AttendanceDayList
          items={items}
          selectedDate={selectedDate}
          search={historySearch}
        />
      </section>

      <div className="flex flex-col gap-2 rounded-xl border border-[#f0e2da] bg-[#fffdfb] p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-stone-500">
          O histórico apresenta até 200 registros recentes. Os nomes dos responsáveis aparecem quando o usuário está associado ao registro de entrada ou saída.
        </p>
        <label className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={historySearch}
            onChange={(event) => setHistorySearch(event.target.value)}
            placeholder="Filtrar pets do dia..."
            className="w-full rounded-lg border border-[#eadbd3] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#d94d91]"
          />
        </label>
      </div>
    </div>
  )
}
