import { useState } from 'react'
import { Bell, CheckCheck, PawPrint } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminNotifications } from '../contexts/AdminNotificationContext'

function timeAgo(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markRead, markAllRead } = useAdminNotifications()
  const navigate = useNavigate()

  async function openNotification(item) {
    await markRead(item._id)
    setOpen(false)
    navigate(item.link || '/admin/notificacoes')
  }

  return <div className="relative">
    <button type="button" title="Abrir central de notificações" aria-label={`Notificações: ${unreadCount} não lidas`} onClick={() => setOpen((value) => !value)} className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
      <Bell size={19}/>
      {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
    </button>
    {open && <>
      <button aria-label="Fechar notificações" className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)}/>
      <div className="absolute right-0 z-40 mt-3 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/15">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4"><div><p className="font-bold text-slate-800">Notificações</p><p className="mt-0.5 text-xs text-slate-400">{unreadCount} não lidas</p></div><button type="button" title="Marcar todas como lidas" onClick={() => markAllRead().catch(() => {})} className="inline-flex items-center gap-1 text-xs font-semibold text-[#286247] hover:underline"><CheckCheck size={14}/>Ler todas</button></div>
        <div className="max-h-[390px] overflow-y-auto">
          {notifications.length === 0 ? <div className="px-5 py-10 text-center"><Bell className="mx-auto text-slate-300" size={26}/><p className="mt-3 text-sm font-semibold text-slate-600">Tudo em dia!</p><p className="mt-1 text-xs text-slate-400">Novos avisos aparecerão aqui.</p></div> : notifications.slice(0, 7).map((item) => <button key={item._id} type="button" onClick={() => openNotification(item)} className={`flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50 ${!item.readAt ? 'bg-emerald-50/40' : ''}`}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#edf4ef] text-[#286247]"><PawPrint size={17}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-800">{item.title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.message}</span><span className="mt-1 block text-[10px] text-slate-400">{timeAgo(item.createdAt)}</span></span>{!item.readAt && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500"/>}</button>)}
        </div>
        <Link to="/admin/notificacoes" onClick={() => setOpen(false)} className="block bg-slate-50 px-4 py-3 text-center text-xs font-bold text-[#286247] hover:bg-emerald-50">Ver todas as notificações</Link>
      </div>
    </>}
  </div>
}
