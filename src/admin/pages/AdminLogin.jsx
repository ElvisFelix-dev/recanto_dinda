
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  PawPrint,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'

import imgLogo from '../../assets/imgLogo.png'

const BRAND = {
  brown: '#593A31',
  pink: '#D94D91',
  lightPink: '#F4C9DA',
  cream: '#FFF8F3',
}

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })

      navigate(location.state?.from?.pathname || '/admin', {
        replace: true,
      })
    } catch (err) {
      setError(
        err.message || 'Não foi possível entrar. Verifique seus dados.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[#eadbd5] bg-white py-3.5 pl-11 pr-4 text-sm text-[#593A31] outline-none transition placeholder:text-[#b49b91] focus:border-[#D94D91] focus:ring-4 focus:ring-[#D94D91]/10'

  return (
    <main className="grid min-h-screen bg-[#FFF8F3] lg:grid-cols-2">

      {/* PAINEL INSTITUCIONAL */}
      <section className="relative hidden overflow-hidden bg-[#593A31] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">

        {/* Elementos decorativos */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-20 top-1/3 h-40 w-40 rounded-full bg-[#D94D91]/10 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-black/10">
            <img
              src={imgLogo}
              alt="Logo Recanto da Dinda"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight">
              Recanto da Dinda
            </p>
            <p className="mt-1 text-sm text-[#F4C9DA]/80">
              Cuidado, carinho e confiança
            </p>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="relative max-w-lg">

          <div className="mb-5 mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-[#F4C9DA]">
            <PawPrint size={15} />
            AMBIENTE ADMINISTRATIVO
          </div>

          <h1 className="text-3xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
            Cuidado em cada detalhe.
            <span className="mt-2 block text-[#F4A9CB]">
              Gestão em um só lugar.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-white/70">
            Acompanhe os pets, organize hospedagens, gerencie o daycare
            e mantenha todas as informações do Recanto da Dinda sempre
            acessíveis.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck size={21} className="text-[#F4A9CB]" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                Ambiente seguro
              </p>
              <p className="text-xs text-white/50">
                Acesso exclusivo para equipe autorizada
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} Recanto da Dinda. Todos os direitos reservados.
        </p>
      </section>

      {/* FORMULÁRIO DE LOGIN */}
      <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">

        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="mb-10 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-white p-2 shadow-md shadow-[#593A31]/10">
              <img
                src={imgLogo}
                alt="Logo Recanto da Dinda"
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-xl font-bold text-[#593A31]">
              Recanto da Dinda
            </h1>

            <p className="mt-1 text-sm text-[#9B8178]">
              Painel administrativo
            </p>
          </div>

          {/* Cabeçalho */}
          <div className="mb-9">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F4C9DA]/40 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#B43D79]">
              <PawPrint size={14} />
              Bem-vindo de volta
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#593A31] sm:text-4xl">
              Acesse sua conta
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#927B72]">
              Entre com seu e-mail e senha para acessar o painel
              administrativo.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#593A31]"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B49B91]"
                />

                <input
                  title="Informe o e-mail cadastrado para acesso administrativo"
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#593A31]"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B49B91]"
                />

                <input
                  title="Informe sua senha administrativa"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  className={`${inputClass} pr-12`}
                />

                <button
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B49B91] transition hover:text-[#D94D91]"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              title="Entrar no painel administrativo"
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#D94D91] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#D94D91]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#BF3D7D] hover:shadow-xl hover:shadow-[#D94D91]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar no painel
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Rodapé */}
          <div className="mt-9 border-t border-[#eadbd5] pt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-[#9B8178]">
              <ShieldCheck size={15} />
              <p className="text-xs font-medium">
                Acesso restrito à equipe autorizada
              </p>
            </div>

            <p className="mt-3 text-[11px] text-[#B49B91]">
              Recanto da Dinda © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
