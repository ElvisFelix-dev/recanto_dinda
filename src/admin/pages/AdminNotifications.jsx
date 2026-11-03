import { useEffect } from 'react'
import { Bell, BellOff, CheckCheck, ExternalLink, LoaderCircle, PawPrint, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminNotifications } from '../contexts/AdminNotificationContext'
import { useToast } from '../contexts/ToastContext'

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export default function AdminNotifications() {
  const { notifications, unreadCount, loading, refresh, markRead, markAllRead, pushEnabled, pushSupported, enablePush, disablePush } = useAdminNotifications()
  const { showToast } = useToast()

  useEffect(() => { refresh().catch((error) => showToast({ type: 'error', title: 'Falha ao carregar notificações', message: error.message })) }, [refresh])

  async function handlePushToggle() {
    try {
      if (pushEnabled) {
        await disablePush()
        showToast({ type: 'success', title: 'Notificações desativadas', message: 'Este dispositivo não receberá mais alertas push.' })
      } else {
        await enablePush()
        showToast({ type: 'success', title: 'Notificações ativadas!', message: 'Você será avisado quando novos pets chegarem para análise.' })
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Não foi possível configurar o push', message: error.message })
    }
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-[#54816b]">ACOMPANHAMENTO DA EQUIPE</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Central de notificações</h1><p className="mt-2 text-sm text-slate-500">Acompanhe novos cadastros e atualizações do Recanto da Dinda.</p></div><button type="button" onClick={() => markAllRead().then(() => showToast({ type: 'success', title: 'Tudo marcado como lido' })).catch((error) => showToast({ type: 'error', title: 'Não foi possível atualizar', message: error.message }))} disabled={!unreadCount} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><CheckCheck size={16}/>Marcar todas como lidas</button></div>

    <section className="flex flex-col gap-4 rounded-2xl border border-[#dce9df] bg-gradient-to-r from-[#edf5ef] to-white p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#286247] shadow-sm"><Smartphone size={21}/></span><div><h2 className="font-bold text-slate-800">Notificações push neste dispositivo</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Receba um alerta mesmo quando o painel não estiver aberto. É necessário permitir notificações no navegador.</p>{!pushSupported && <p className="mt-2 text-xs font-medium text-amber-700">Este navegador ou dispositivo não oferece suporte a Web Push.</p>}</div></div><button type="button" onClick={handlePushToggle} disabled={!pushSupported} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${pushEnabled ? 'border border-rose-200 bg-white text-rose-600 hover:bg-rose-50' : 'bg-[#286247] text-white hover:bg-[#1d4e37]'}`}>{pushEnabled ? <><BellOff size={16}/>Desativar push</> : <><Bell size={16}/>Ativar notificações</>}</button></section>

    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-800">Todas as notificações</h2><p className="mt-1 text-xs text-slate-400">{unreadCount} não lidas</p></div><button type="button" title="Atualizar notificações" onClick={() => refresh().catch(() => {})} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><LoaderCircle size={17} className={loading ? 'animate-spin' : ''}/></button></div>
      {loading && notifications.length === 0 ? <div className="p-10 text-center text-sm text-slate-400">Carregando notificações...</div> : notifications.length === 0 ? <div className="p-12 text-center"><Bell className="mx-auto text-slate-300" size={30}/><p className="mt-3 font-semibold text-slate-700">Nenhuma notificação por enquanto</p><p className="mt-1 text-sm text-slate-400">Quando um tutor cadastrar um pet, você receberá um aviso aqui.</p></div> : <div className="divide-y divide-slate-100">{notifications.map((item) => <div key={item._id} className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center ${!item.readAt ? 'bg-emerald-50/30' : ''}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf4ef] text-[#286247]"><PawPrint size={18}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-slate-800">{item.title}</h3>{!item.readAt && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">NOVA</span>}</div><p className="mt-1 text-sm text-slate-500">{item.message}</p><p className="mt-1 text-xs text-slate-400">{formatDate(item.createdAt)}</p></div><div className="flex shrink-0 flex-wrap gap-2">{!item.readAt && <button type="button" onClick={() => markRead(item._id)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-white">Marcar como lida</button>}{item.link && <Link to={item.link} onClick={() => markRead(item._id)} className="inline-flex items-center gap-1 rounded-lg bg-[#edf4ef] px-3 py-2 text-xs font-bold text-[#286247] hover:bg-[#dcebe0]">Abrir <ExternalLink size={13}/></Link>}</div></div>)}</div>}
    </section>
  </div>
}
