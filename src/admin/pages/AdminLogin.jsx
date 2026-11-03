import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Dog, Eye, EyeOff, LockKeyhole, Mail, PawPrint } from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Não foi possível entrar. Verifique seus dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-[#f5f7f3] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#173f32] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" /><div className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full border border-white/10" />
        <div className="relative flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9a45b] text-[#173f32]"><Dog size={27} /></div><div><p className="text-xl font-bold">Recanto da Dinda</p><p className="text-xs text-emerald-100/65">Cuidado, carinho e confiança</p></div></div>
        <div className="relative max-w-lg"><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-emerald-50"><PawPrint size={14} /> AMBIENTE ADMINISTRATIVO</div><h1 className="text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">Um espaço de cuidado começa com uma boa gestão.</h1><p className="mt-6 max-w-md text-base leading-7 text-emerald-50/70">Acompanhe cadastros, conheça cada pet e mantenha as informações da creche organizadas em um só lugar.</p></div>
        <p className="relative text-xs text-emerald-100/45">© {new Date().getFullYear()} Recanto da Dinda. Todos os direitos reservados.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:hidden"><div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[#173f32] text-[#e9a45b]"><Dog size={30} /></div><p className="text-xl font-bold text-[#173f32]">Recanto da Dinda</p><p className="text-sm text-slate-500">Painel administrativo</p></div>
          <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#54816b]">Bem-vindo de volta</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Acesse sua conta</h2><p className="mt-2 text-sm leading-6 text-slate-500">Entre com seu e-mail e senha de administrador.</p></div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">E-mail</label><div className="relative"><Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input title="Informe o e-mail cadastrado para acesso administrativo" id="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#54816b] focus:ring-4 focus:ring-[#54816b]/10" /></div></div>
            <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Senha</label><div className="relative"><LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input title="Informe sua senha administrativa" id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Digite sua senha" className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#54816b] focus:ring-4 focus:ring-[#54816b]/10" /><button title={showPassword ? "Ocultar senha" : "Mostrar senha"} type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button title="Entrar no painel administrativo" type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d503d] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1d503d]/15 transition hover:bg-[#173f32] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Entrando...' : 'Entrar no painel'}</button>
          </form>
          <p className="mt-8 text-center text-xs leading-5 text-slate-400">Acesso restrito à equipe autorizada do Recanto da Dinda.</p>
        </div>
      </section>
    </div>
  )
}
