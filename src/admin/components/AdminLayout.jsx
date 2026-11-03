import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PawPrint, LogOut, Menu, X, Dog, Users, Activity, FileBarChart2, Bell } from 'lucide-react'
import { useState } from 'react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { ToastProvider } from '../contexts/ToastContext'
import { AdminNotificationProvider } from '../contexts/AdminNotificationContext'
import NotificationBell from './NotificationBell'

function AdminLayoutContent() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = [
    { to: '/admin', label: 'Visão geral', icon: LayoutDashboard, end: true },
    { to: '/admin/cadastros', label: 'Cadastros de pets', icon: PawPrint },
    { to: '/admin/relatorios', label: 'Relatórios', icon: FileBarChart2 },
    { to: '/admin/notificacoes', label: 'Notificações', icon: Bell },
    ...(admin?.role === 'admin' ? [
      { to: '/admin/equipe', label: 'Equipe e acessos', icon: Users },
      { to: '/admin/atividades', label: 'Histórico de atividades', icon: Activity },
    ] : []),
  ]

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
      <div className="min-h-screen bg-[#f5f7f3] text-slate-800">
        {mobileOpen && (
          <button
            title="Fechar menu"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          />
        )}

        {/* O menu fica preso à altura da janela, independentemente do scroll da página. */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex h-dvh max-h-dvh w-72 flex-col overflow-hidden bg-[#173f32] text-white shadow-2xl shadow-slate-950/10 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex h-24 shrink-0 items-center gap-3 border-b border-white/10 px-7">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e9a45b] text-[#173f32]"><Dog size={27} /></div>
            <div className="min-w-0"><p className="truncate text-lg font-bold tracking-tight">Recanto da Dinda</p><p className="text-xs text-emerald-100/70">Painel administrativo</p></div>
            <button title="Fechar menu lateral" onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-1 hover:bg-white/10 lg:hidden" aria-label="Fechar menu"><X /></button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-8 [scrollbar-color:rgba(255,255,255,.2)_transparent] [scrollbar-width:thin]">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-emerald-100/50">Gestão</p>
            <nav className="space-y-1">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  title={`Abrir ${label.toLowerCase()}`}
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-white text-[#173f32] shadow-lg shadow-black/10' : 'text-emerald-50/80 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={18} />{label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#173f32] p-5">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e9a45b] font-bold text-[#173f32]">{admin?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
              <div className="min-w-0"><p className="truncate text-sm font-semibold">{admin?.name || 'Administrador'}</p><p className="truncate text-xs text-emerald-100/60">{admin?.role === 'admin' ? 'Administrador' : 'Gerente'}</p></div>
            </div>
            <button title="Encerrar sessão administrativa" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-emerald-50/75 transition hover:bg-white/10 hover:text-white"><LogOut size={18} />Sair do painel</button>
          </div>
        </aside>

        {/* O conteúdo reserva o espaço do sidebar no desktop; o menu não acompanha a altura do conteúdo. */}
        <div className="min-h-screen min-w-0 lg:ml-72">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur md:px-8">
            <div className="flex items-center gap-3"><button title="Abrir menu de navegação" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Abrir menu"><Menu /></button><div><p className="text-xs font-medium text-slate-400">RECANTO DA DINDA / ADMINISTRAÇÃO</p><p className="font-semibold text-slate-800">Central de gestão</p></div></div>
            <div className="flex items-center gap-3"><NotificationBell /><div className="hidden items-center gap-2 rounded-full bg-[#edf4ef] px-3 py-2 text-xs font-semibold text-[#286247] sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" />{admin?.role === 'admin' ? 'Administrador' : 'Gerente'}</div></div>
          </header>
          <main className="mx-auto w-full max-w-[1500px] p-5 md:p-8"><Outlet /></main>
        </div>
      </div>
  )
}

export default function AdminLayout() {
  return (
    <ToastProvider>
      <AdminNotificationProvider>
        <AdminLayoutContent />
      </AdminNotificationProvider>
    </ToastProvider>
  )
}
