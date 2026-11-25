
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PawPrint,
  LogIn,
  CalendarDays,
  Dog,
  LogOut,
  Home,
  Heart,
  Menu,
  X,
  ArrowUpRight,
  Clock3,
  Search,
  CheckCircle2,
  Timer,
  CalendarCheck,
  Star,
  Send,
  MessageSquareText,
} from 'lucide-react'
import { guardianApi } from '../services/api'

import imgLogo from "../assets/imgLogo.png";

const input =
  'w-full rounded-xl border border-[#eadbd3] bg-white px-4 py-3 text-sm text-[#593a31] outline-none transition focus:border-[#d94d91] focus:ring-2 focus:ring-[#d94d91]/10'

function formatAttendanceDate(date) {
  if (!date) return 'Data não informada'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Data não informada'
  }

  return parsedDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatAttendanceTime(date) {
  if (!date) return '--:--'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '--:--'
  }

  return parsedDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getAttendanceDuration(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null

  const start = new Date(checkIn).getTime()
  const end = new Date(checkOut).getTime()

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    end < start
  ) {
    return null
  }

  const totalMinutes = Math.floor((end - start) / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}min`

  return `${hours}h ${String(minutes).padStart(2, '0')}min`
}

function Navbar({ loggedIn = false, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#f0e2da] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
            <img
                          src={imgLogo}
                          alt="Recanto da Dinda"
                          className="h-9 w-9 object-contain"
                        />
          </div>

          <div>
            <span className="block text-lg font-black leading-tight text-[#593a31]">
              Recanto da Dinda
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d94d91]">
              Amor em cada cuidado
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-[#80665c] transition hover:text-[#d94d91]"
          >
            Início
          </Link>

          <Link
            to="/#sobre"
            className="text-sm font-semibold text-[#80665c] transition hover:text-[#d94d91]"
          >
            Sobre nós
          </Link>

          <Link
            to="/#servicos"
            className="text-sm font-semibold text-[#80665c] transition hover:text-[#d94d91]"
          >
            Serviços
          </Link>

          <Link
            to="/hotel"
            className="text-sm font-semibold text-[#80665c] transition hover:text-[#d94d91]"
          >
            Hospedagem
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-xl border border-[#eadbd3] px-4 py-2.5 text-sm font-bold text-[#593a31] transition hover:border-[#d94d91] hover:text-[#d94d91]"
            >
              <LogOut size={17} />
              Sair da conta
            </button>
          ) : (
            <Link
              to="/area-do-tutor"
              className="flex items-center gap-2 rounded-xl bg-[#d94d91] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#d94d91]/20 transition hover:bg-[#bd3d7b]"
            >
              <LogIn size={17} />
              Área do Tutor
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl bg-[#fff8f3] p-2.5 text-[#593a31] md:hidden"
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#f0e2da] bg-white px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              onClick={() => setMenuOpen(false)}
              to="/"
              className="text-sm font-semibold text-[#593a31]"
            >
              Início
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/#sobre"
              className="text-sm font-semibold text-[#593a31]"
            >
              Sobre nós
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/#servicos"
              className="text-sm font-semibold text-[#593a31]"
            >
              Serviços
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/hotel"
              className="text-sm font-semibold text-[#593a31]"
            >
              Hospedagem
            </Link>

            {loggedIn ? (
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onLogout()
                }}
                className="flex items-center gap-2 rounded-xl bg-[#fce2ed] px-4 py-3 text-sm font-bold text-[#b63b78]"
              >
                <LogOut size={17} />
                Sair da conta
              </button>
            ) : (
              <Link
                onClick={() => setMenuOpen(false)}
                to="/area-do-tutor"
                className="rounded-xl bg-[#d94d91] px-4 py-3 text-center text-sm font-bold text-white"
              >
                Acessar minha conta
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-auto bg-[#593a31] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#f5a9cb]">
              <img
                            src={imgLogo}
                            alt="Recanto da Dinda"
                            className="h-9 w-9 object-contain"
                          />
            </div>

            <div>
              <h3 className="font-black">Recanto da Dinda</h3>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5a9cb]">
                Amor em cada cuidado
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            Um espaço de carinho, diversão e cuidado para quem faz parte da sua família.
          </p>
        </div>

        <div>
          <h4 className="font-bold">Links rápidos</h4>

          <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
            <Link to="/" className="transition hover:text-[#f5a9cb]">
              Página inicial
            </Link>

            <Link to="/hotel" className="transition hover:text-[#f5a9cb]">
              Solicitar hospedagem
            </Link>

            <Link to="/area-do-tutor" className="transition hover:text-[#f5a9cb]">
              Área do Tutor
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold">Conte com a gente</h4>

          <p className="mt-5 text-sm leading-relaxed text-white/65">
            Estamos aqui para cuidar do seu melhor amigo com todo o carinho e atenção.
          </p>

          <Link
            to="/#contato"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#f5a9cb] transition hover:text-white"
          >
            Entre em contato <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-5 py-5 text-xs text-white/45 sm:flex-row lg:px-8">
          <span>
            © {new Date().getFullYear()} Recanto da Dinda. Todos os direitos reservados.
          </span>

          <span>
            Feito com carinho para os pets e suas famílias{' '}
            <Heart size={12} className="inline text-[#f5a9cb]" />
          </span>
        </div>
      </div>
    </footer>
  )
}

function EmptyState({ children }) {
  return (
    <div className="mt-4 rounded-2xl bg-[#fff8f3] p-6 text-center">
      <PawPrint size={28} className="mx-auto text-[#d94d91]" />

      <p className="mt-3 text-sm leading-relaxed text-[#98796d]">
        {children}
      </p>
    </div>
  )
}

function DashboardCard({
  title,
  icon: Icon,
  children,
  className = '',
}) {
  return (
    <section
      className={`rounded-3xl border border-[#f0e2da] bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <h2 className="flex items-center gap-2 font-bold text-[#593a31]">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fce2ed] text-[#d94d91]">
          <Icon size={19} />
        </span>

        {title}
      </h2>

      {children}
    </section>
  )
}

function AttendanceCard({ attendance }) {
  const petName = attendance.pet?.name || 'Pet'
  const isPresent = !attendance.checkOutAt

  const duration = getAttendanceDuration(
    attendance.checkInAt,
    attendance.checkOutAt
  )

  return (
    <article className="overflow-hidden rounded-2xl border border-[#f0e2da] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fff8f3] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fce2ed] text-[#d94d91]">
            <Dog size={22} />
          </div>

          <div>
            <p className="font-bold text-[#593a31]">
              {petName}
            </p>

            <p className="mt-1 text-xs capitalize text-[#98796d]">
              {formatAttendanceDate(attendance.checkInAt)}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            isPresent
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-[#fce2ed] text-[#b63b78]'
          }`}
        >
          {isPresent ? 'Na creche agora' : 'Visita finalizada'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="rounded-xl bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <LogIn size={17} />

            <span className="text-xs font-bold">
              ENTRADA
            </span>
          </div>

          <p className="mt-3 text-2xl font-black text-emerald-800">
            {formatAttendanceTime(attendance.checkInAt)}
          </p>

          <p className="mt-1 text-xs text-emerald-700">
            Horário de chegada
          </p>
        </div>

        <div className="rounded-xl bg-[#fff8f3] p-4">
          <div className="flex items-center gap-2 text-[#98796d]">
            <LogOut size={17} />

            <span className="text-xs font-bold">
              SAÍDA
            </span>
          </div>

          {attendance.checkOutAt ? (
            <>
              <p className="mt-3 text-2xl font-black text-[#593a31]">
                {formatAttendanceTime(attendance.checkOutAt)}
              </p>

              <p className="mt-1 text-xs text-[#98796d]">
                Horário de retirada
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-lg font-bold text-[#98796d]">
                Pendente
              </p>

              <p className="mt-1 text-xs text-[#98796d]">
                Aguardando retirada
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0e2da] px-4 py-4">
        <div>
          <p className="text-xs text-[#98796d]">
            {isPresent
              ? 'Situação atual'
              : 'Tempo de permanência'}
          </p>

          <p className="mt-1 text-sm font-bold text-[#593a31]">
            {isPresent
              ? 'Seu pet está aproveitando a creche!'
              : duration || 'Duração indisponível'}
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#98796d]">
          <Clock3 size={15} />
          Registro individual
        </span>
      </div>
    </article>
  )
}

export default function GuardianPortal() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [code, setCode] = useState('')
  const [accessStep, setAccessStep] = useState(1)
  const [password, setPassword] = useState('')

  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const [attendanceSearch, setAttendanceSearch] = useState('')
  const [attendanceFilter, setAttendanceFilter] = useState('all')

  // Depoimentos enviados pelo tutor
  const [testimonials, setTestimonials] = useState([])
  const [testimonialPetId, setTestimonialPetId] = useState('')
  const [testimonialText, setTestimonialText] = useState('')
  const [testimonialRating, setTestimonialRating] = useState(5)
  const [authorizeText, setAuthorizeText] = useState(false)
  const [authorizeImage, setAuthorizeImage] = useState(false)
  const [testimonialBusy, setTestimonialBusy] = useState(false)
  const [testimonialLoading, setTestimonialLoading] = useState(false)
  const [testimonialError, setTestimonialError] = useState('')
  const [testimonialSuccess, setTestimonialSuccess] = useState('')


  const loadGuardianTestimonials = async () => {
    setTestimonialLoading(true)
    setTestimonialError('')

    try {
      const response = await guardianApi.getTestimonials()
      const items = response?.data?.testimonials || response?.testimonials || response?.data || []
      setTestimonials(Array.isArray(items) ? items : [])
    } catch (e) {
      setTestimonials([])
      setTestimonialError(e.message || 'Não foi possível carregar seus depoimentos.')
    } finally {
      setTestimonialLoading(false)
    }
  }

  const submitTestimonial = async (e) => {
    e.preventDefault()
    setTestimonialError('')
    setTestimonialSuccess('')

    if (!testimonialPetId) {
      setTestimonialError('Selecione o pet que representará seu depoimento.')
      return
    }

    if (!testimonialText.trim()) {
      setTestimonialError('Escreva seu depoimento antes de enviar.')
      return
    }

    if (!authorizeText || !authorizeImage) {
      setTestimonialError('Confirme as duas autorizações para continuar.')
      return
    }

    setTestimonialBusy(true)

    try {
      await guardianApi.createTestimonial({
        petId: testimonialPetId,
        text: testimonialText.trim(),
        rating: testimonialRating,
        authorization: {
          testimonial: authorizeText,
          petImage: authorizeImage,
          source: 'guardian_portal',
        },
      })

      setTestimonialText('')
      setTestimonialRating(5)
      setAuthorizeText(false)
      setAuthorizeImage(false)
      setTestimonialSuccess('Depoimento enviado! Ele ficará aguardando a aprovação da equipe.')
      await loadGuardianTestimonials()
    } catch (e) {
      setTestimonialError(e.message || 'Não foi possível enviar seu depoimento.')
    } finally {
      setTestimonialBusy(false)
    }
  }

  const load = async () => {
    try {
      const response = await guardianApi.me()

      setData(response.data)
      setError('')
      loadGuardianTestimonials()
    } catch (e) {
      localStorage.removeItem('guardianToken')
      setData(null)
      setError(e.message || 'Não foi possível carregar sua conta.')
    } finally {
      setCheckingSession(false)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('guardianToken')) {
      load()
    } else {
      setCheckingSession(false)
    }
  }, [])

  const submit = async (e) => {
    e.preventDefault()

    setBusy(true)
    setError('')

    try {
      if (mode === 'login') {
        const response = await guardianApi.login({
          cpf,
          email,
          password,
        })

        localStorage.setItem('guardianToken', response.data.token)

        await load()
      } else if (accessStep === 1) {
        await guardianApi.requestAccessCode({
          cpf,
          email,
        })

        setAccessStep(2)
      } else {
        const response = await guardianApi.confirmAccess({
          cpf,
          email,
          code,
          password,
        })

        localStorage.setItem('guardianToken', response.data.token)

        await load()
      }
    } catch (e) {
      setError(e.message || 'Não foi possível realizar o acesso.')
    } finally {
      setBusy(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('guardianToken')

    setData(null)
    setPassword('')
    setCode('')
    setAccessStep(1)
    setError('')
    setMode('login')
    setCheckingSession(false)
  }

  const attendance = data?.attendance || []

  const filteredAttendance = attendance.filter((item) => {
    const name = item.pet?.name || 'Pet'

    const matchesSearch = name
      .toLowerCase()
      .includes(attendanceSearch.toLowerCase())

    const isPresent = !item.checkOutAt

    const matchesFilter =
      attendanceFilter === 'all' ||
      (attendanceFilter === 'present' && isPresent) ||
      (attendanceFilter === 'finished' && !isPresent)

    return matchesSearch && matchesFilter
  })

  const presentCount = attendance.filter(
    (item) => !item.checkOutAt
  ).length

  const finishedCount = attendance.filter(
    (item) => Boolean(item.checkOutAt)
  ).length

  if (checkingSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fff8f3]">
        <div className="text-center">
          <PawPrint
            size={36}
            className="mx-auto animate-pulse text-[#d94d91]"
          />

          <p className="mt-3 text-sm font-semibold text-[#80665c]">
            Preparando seu espaço...
          </p>
        </div>
      </div>
    )
  }

  if (data) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fff8f3] text-[#593a31]">
        <Navbar loggedIn onLogout={logout} />

        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 lg:px-8">
          {/* Boas-vindas */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#593a31] to-[#80594d] p-6 text-white shadow-lg sm:p-9">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5a9cb]">
                  Área exclusiva do tutor
                </p>

                <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                  Olá, {data.guardian?.name?.split(' ')[0] || 'Tutor'}!
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
                  Que bom ter você por aqui. Acompanhe os momentos,
                  a rotina e os cuidados do seu melhor amigo.
                </p>
              </div>

              <div className="hidden h-24 w-24 shrink-0 place-items-center rounded-3xl bg-white/10 text-[#f5a9cb] sm:grid">
                <PawPrint size={48} />
              </div>
            </div>
          </div>

          {/* Pets e hospedagens */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <DashboardCard title="Meus pets" icon={Dog}>
              {data.pets?.length ? (
                data.pets.map((pet) => (
                  <div
                    key={pet._id}
                    className="mt-4 flex items-center gap-4 rounded-2xl bg-[#fff8f3] p-4"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
                      <Dog size={24} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold">{pet.name}</p>

                      <p className="mt-1 text-xs text-[#98796d]">
                        {pet.breed || 'Raça não informada'}
                        {' · '}
                        {pet.status || 'Cadastrado'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState>
                  Nenhum pet cadastrado ainda.
                </EmptyState>
              )}
            </DashboardCard>

            <DashboardCard title="Hospedagens" icon={Home}>
              {data.bookings?.length ? (
                data.bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="mt-4 rounded-2xl bg-[#fff8f3] p-4"
                  >
                    <p className="font-bold">
                      {booking.petSnapshot?.name || 'Pet'}
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-xs text-[#98796d]">
                      <CalendarDays size={14} />

                      {new Date(
                        booking.requestedCheckIn
                      ).toLocaleDateString('pt-BR')}

                      {' até '}

                      {new Date(
                        booking.requestedCheckOut
                      ).toLocaleDateString('pt-BR')}
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-[#fce2ed] px-3 py-1.5 text-xs font-bold text-[#b63b78]">
                      {booking.status}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState>
                  Nenhuma solicitação de hospedagem.
                </EmptyState>
              )}
            </DashboardCard>
          </div>

          {/* Frequência detalhada */}
          <section className="mt-8 rounded-3xl border border-[#f0e2da] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#593a31]">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fce2ed] text-[#d94d91]">
                    <CalendarCheck size={21} />
                  </span>

                  Frequência dos meus pets
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#98796d]">
                  Acompanhe os dias em que seu pet esteve na creche,
                  o horário em que chegou e o horário em que foi retirado.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#fff8f3] px-4 py-3 text-sm text-[#80665c]">
                <CalendarDays size={17} className="text-[#d94d91]" />
                Histórico de presença
              </div>
            </div>

            {/* Indicadores */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#fff8f3] p-4">
                <div className="flex items-center gap-2 text-[#98796d]">
                  <CalendarDays size={17} />
                  <span className="text-xs font-semibold">
                    Registros
                  </span>
                </div>

                <p className="mt-2 text-2xl font-black text-[#593a31]">
                  {attendance.length}
                </p>

                <p className="mt-1 text-xs text-[#98796d]">
                  Visitas registradas
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Dog size={17} />
                  <span className="text-xs font-semibold">
                    Na creche
                  </span>
                </div>

                <p className="mt-2 text-2xl font-black text-emerald-800">
                  {presentCount}
                </p>

                <p className="mt-1 text-xs text-emerald-700">
                  Registros em aberto
                </p>
              </div>

              <div className="col-span-2 rounded-2xl bg-[#fce2ed]/60 p-4 sm:col-span-1">
                <div className="flex items-center gap-2 text-[#b63b78]">
                  <CheckCircle2 size={17} />
                  <span className="text-xs font-semibold">
                    Finalizados
                  </span>
                </div>

                <p className="mt-2 text-2xl font-black text-[#b63b78]">
                  {finishedCount}
                </p>

                <p className="mt-1 text-xs text-[#b63b78]">
                  Saídas registradas
                </p>
              </div>
            </div>

            {/* Busca e filtros */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98796d]"
                />

                <input
                  value={attendanceSearch}
                  onChange={(e) => setAttendanceSearch(e.target.value)}
                  placeholder="Buscar pelo nome do pet..."
                  className={`${input} pl-11`}
                />
              </div>

              <div className="flex rounded-xl bg-[#fff8f3] p-1">
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('all')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    attendanceFilter === 'all'
                      ? 'bg-white text-[#593a31] shadow-sm'
                      : 'text-[#98796d]'
                  }`}
                >
                  Todos
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceFilter('present')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    attendanceFilter === 'present'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-[#98796d]'
                  }`}
                >
                  Na creche
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceFilter('finished')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    attendanceFilter === 'finished'
                      ? 'bg-white text-[#b63b78] shadow-sm'
                      : 'text-[#98796d]'
                  }`}
                >
                  Finalizados
                </button>
              </div>
            </div>

            {/* Lista de frequências */}
            {filteredAttendance.length ? (
              <div className="mt-6 space-y-4">
                {filteredAttendance.map((item) => (
                  <AttendanceCard
                    key={item._id}
                    attendance={item}
                  />
                ))}
              </div>
            ) : (
              <EmptyState>
                {attendance.length
                  ? 'Nenhum registro encontrado com os filtros selecionados.'
                  : 'Ainda não temos registros de frequência para seus pets. Assim que houver uma visita à creche, os horários de entrada e saída aparecerão aqui.'}
              </EmptyState>
            )}

            {attendance.length > 0 && (
              <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#fff8f3] p-4">
                <Timer
                  size={18}
                  className="mt-0.5 shrink-0 text-[#d94d91]"
                />

                <p className="text-xs leading-relaxed text-[#98796d]">
                  Os horários apresentados correspondem aos registros
                  realizados pela equipe do Recanto da Dinda.
                  Quando a saída ainda não foi registrada, o histórico
                  mostrará que seu pet permanece na creche.
                </p>
              </div>
            )}
          </section>

          {/* Depoimentos do tutor */}
          <section className="mt-8 rounded-3xl border border-[#f0e2da] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fce2ed] text-[#d94d91]">
                <MessageSquareText size={21} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#593a31]">Conte sua experiência</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#98796d]">
                  Seu carinho também pode inspirar outras famílias. Envie um depoimento e escolha
                  qual pet aparecerá junto à sua mensagem.
                </p>
              </div>
            </div>

            <form onSubmit={submitTestimonial} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-[#80665c]">
                  Pet que representará o depoimento
                </label>
                <select
                  value={testimonialPetId}
                  onChange={(e) => setTestimonialPetId(e.target.value)}
                  className={input}
                  required
                >
                  <option value="">Selecione um pet</option>
                  {(data.pets || []).filter((pet) => pet.status === 'approved').map((pet) => (
                    <option key={pet._id} value={pet._id}>{pet.name}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-[#98796d]">
                  Apenas pets aprovados no cadastro podem ser selecionados.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#80665c]">
                  Como foi sua experiência no Recanto?
                </label>
                <textarea
                  value={testimonialText}
                  onChange={(e) => setTestimonialText(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Conte um pouquinho sobre os cuidados, a equipe e os momentos do seu pet..."
                  className={input + ' resize-y'}
                  required
                />
                <p className="mt-1 text-right text-xs text-[#98796d]">
                  {testimonialText.length}/1000
                </p>
              </div>

              <div>
                <span className="mb-2 block text-xs font-bold text-[#80665c]">Sua avaliação</span>
                <div className="flex items-center gap-1" role="group" aria-label="Avaliação de 1 a 5 estrelas">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialRating(star)}
                      aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                      className="rounded-lg p-1 transition hover:scale-110"
                    >
                      <Star
                        size={27}
                        className={star <= testimonialRating ? 'fill-[#f4b740] text-[#f4b740]' : 'text-[#d9c9c1]'}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-[#80665c]">
                    {testimonialRating}/5
                  </span>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-[#fff8f3] p-4">
                <p className="text-xs font-bold text-[#593a31]">Autorizações de publicação</p>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#80665c]">
                  <input
                    type="checkbox"
                    checked={authorizeText}
                    onChange={(e) => setAuthorizeText(e.target.checked)}
                    className="mt-1 accent-[#d94d91]"
                  />
                  Autorizo a publicação do texto do meu depoimento no site do Recanto da Dinda.
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#80665c]">
                  <input
                    type="checkbox"
                    checked={authorizeImage}
                    onChange={(e) => setAuthorizeImage(e.target.checked)}
                    className="mt-1 accent-[#d94d91]"
                  />
                  Autorizo o uso da foto do pet selecionado junto ao depoimento.
                </label>
              </div>

              {testimonialError && (
                <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                  {testimonialError}
                </p>
              )}
              {testimonialSuccess && (
                <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                  {testimonialSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={testimonialBusy || !(data.pets || []).some((pet) => pet.status === 'approved')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d94d91] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#d94d91]/20 transition hover:bg-[#bd3d7b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Send size={17} />
                {testimonialBusy ? 'Enviando...' : 'Enviar depoimento'}
              </button>
            </form>

            <div className="mt-8 border-t border-[#f0e2da] pt-6">
              <h3 className="font-bold text-[#593a31]">Meus depoimentos</h3>
              {testimonialLoading ? (
                <p className="mt-3 text-sm text-[#98796d]">Carregando seus depoimentos...</p>
              ) : testimonials.length ? (
                <div className="mt-4 space-y-3">
                  {testimonials.map((item) => {
                    const pet = item.pet || item.petSnapshot || {}
                    const status = item.status || 'pending'
                    const statusLabel = {
                      pending: 'Aguardando aprovação',
                      approved: 'Aprovado',
                      rejected: 'Não aprovado',
                      hidden: 'Oculto',
                    }[status] || status

                    return (
                      <article key={item._id} className="rounded-2xl border border-[#f0e2da] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {pet.avatar?.url ? (
                              <img src={pet.avatar.url} alt={pet.name || 'Pet'} className="h-11 w-11 rounded-xl object-cover" />
                            ) : (
                              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fce2ed] text-[#d94d91]">
                                <Dog size={21} />
                              </span>
                            )}
                            <div>
                              <p className="font-bold text-[#593a31]">{pet.name || 'Meu pet'}</p>
                              <div className="mt-1 flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} size={12} className={star <= (item.rating || 5) ? 'fill-[#f4b740] text-[#f4b740]' : 'text-[#d9c9c1]'} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="rounded-full bg-[#fce2ed] px-3 py-1.5 text-xs font-bold text-[#b63b78]">
                            {statusLabel}
                          </span>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#80665c]">{item.text}</p>
                        {item.adminNote && (
                          <p className="mt-3 rounded-xl bg-[#fff8f3] p-3 text-xs text-[#80665c]">
                            <strong>Observação da equipe:</strong> {item.adminNote}
                          </p>
                        )}
                      </article>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-[#98796d]">
                  Você ainda não enviou nenhum depoimento. Quando enviar, poderá acompanhar a aprovação por aqui.
                </p>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    )
  }

  // Tela de login e primeiro acesso
  return (
    <div className="flex min-h-screen flex-col bg-[#fff8f3]">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#f0e2da] bg-white shadow-xl shadow-[#593a31]/5 lg:grid-cols-2">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#593a31] p-10 text-white lg:flex">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d94d91]/20 blur-2xl" />

            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#d94d91]/20 blur-2xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#f5a9cb]">
                <PawPrint size={15} />
                Recanto da Dinda
              </span>

              <h2 className="mt-10 text-4xl font-black leading-tight">
                Seu melhor amigo merece todo esse carinho.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
                Um espaço especial para acompanhar os cuidados,
                a rotina e os momentos do seu pet.
              </p>
            </div>

            <div className="relative mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
              <Heart className="mb-3 text-[#f5a9cb]" size={24} />

              <p className="text-sm font-semibold">
                Cuidado, carinho e diversão em cada momento.
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-10 lg:p-12">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
              <PawPrint size={30} />
            </div>

            <h1 className="mt-6 text-center text-3xl font-black text-[#593a31]">
              Área do Tutor
            </h1>

            <p className="mt-2 text-center text-sm text-[#98796d]">
              Acesse sua conta e acompanhe seu pet.
            </p>

            <div className="mt-8 grid grid-cols-2 rounded-xl bg-[#fff8f3] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setAccessStep(1)
                  setError('')
                }}
                className={`rounded-lg p-3 text-sm font-bold transition ${
                  mode === 'login'
                    ? 'bg-white text-[#593a31] shadow-sm'
                    : 'text-[#98796d]'
                }`}
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('create')
                  setAccessStep(1)
                  setCode('')
                  setError('')
                }}
                className={`rounded-lg p-3 text-sm font-bold transition ${
                  mode === 'create'
                    ? 'bg-white text-[#593a31] shadow-sm'
                    : 'text-[#98796d]'
                }`}
              >
                Primeiro acesso
              </button>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              {(mode === 'login' ||
                (mode === 'create' && accessStep === 1)) && (
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#80665c]">
                    CPF cadastrado
                  </label>

                  <input
                    className={input}
                    inputMode="numeric"
                    autoComplete="username"
                    placeholder="Digite seu CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold text-[#80665c]">
                  E-mail cadastrado
                </label>

                <input
                  className={input}
                  type="email"
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {mode === 'create' && accessStep === 2 && (
                <>
                  <div className="rounded-xl bg-[#fff8f3] p-3 text-sm leading-relaxed text-[#80665c]">
                    Se os dados corresponderem a um cadastro elegível,
                    enviaremos um código de seis dígitos para o e-mail
                    informado. Confira também sua caixa de spam.
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-[#80665c]">
                      Código recebido por e-mail
                    </label>

                    <input
                      className={input}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={(e) =>
                        setCode(
                          e.target.value.replace(/\D/g, '').slice(0, 6)
                        )
                      }
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>
                </>
              )}

              {(mode === 'login' ||
                (mode === 'create' && accessStep === 2)) && (
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#80665c]">
                    {mode === 'login' ? 'Senha' : 'Crie sua senha'}
                  </label>

                  <input
                    className={input}
                    type="password"
                    autoComplete={
                      mode === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                    minLength={8}
                    placeholder="Mínimo de 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
                >
                  {error}
                </p>
              )}

              <button
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d94d91] px-5 py-3.5 font-bold text-white shadow-lg shadow-[#d94d91]/20 transition hover:bg-[#bd3d7b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy
                  ? 'Aguarde...'
                  : mode === 'login'
                    ? 'Entrar na minha conta'
                    : accessStep === 1
                      ? 'Enviar código de acesso'
                      : 'Confirmar código e criar senha'}

                <LogIn size={18} />
              </button>

              {mode === 'create' && accessStep === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setAccessStep(1)
                    setCode('')
                    setPassword('')
                    setError('')
                  }}
                  className="w-full text-sm font-semibold text-[#8b5a49] transition hover:text-[#d94d91]"
                >
                  Voltar e corrigir os dados
                </button>
              )}
            </form>

            <div className="mt-7 border-t border-[#f0e2da] pt-5 text-center">
              <Link
                to="/"
                className="text-sm font-semibold text-[#8b5a49] transition hover:text-[#d94d91]"
              >
                Voltar para o site
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
