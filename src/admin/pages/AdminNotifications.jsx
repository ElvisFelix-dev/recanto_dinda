
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  BellOff,
  CheckCheck,
  ExternalLink,
  LoaderCircle,
  PawPrint,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Clock3,
} from 'lucide-react'

import { useAdminNotifications } from '../contexts/AdminNotificationContext'
import { useToast } from '../contexts/ToastContext'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function AdminNotifications() {
  const {
    notifications,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead,
    pushEnabled,
    pushSupported,
    enablePush,
    disablePush,
  } = useAdminNotifications()

  const { showToast } = useToast()

  useEffect(() => {
    refresh().catch((error) =>
      showToast({
        type: 'error',
        title: 'Falha ao carregar notificações',
        message: error.message,
      })
    )
  }, [refresh, showToast])

  async function handlePushToggle() {
    try {
      if (pushEnabled) {
        await disablePush()

        showToast({
          type: 'success',
          title: 'Notificações desativadas',
          message: 'Este dispositivo não receberá mais alertas push.',
        })
      } else {
        await enablePush()

        showToast({
          type: 'success',
          title: 'Notificações ativadas!',
          message: 'Você receberá alertas importantes do Recanto da Dinda.',
        })
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Não foi possível configurar o push',
        message: error.message,
      })
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead()

      showToast({
        type: 'success',
        title: 'Tudo marcado como lido',
        message: 'Sua central de notificações está atualizada.',
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Não foi possível atualizar',
        message: error.message,
      })
    }
  }

  async function handleRefresh() {
    try {
      await refresh()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Falha ao atualizar',
        message: error.message,
      })
    }
  }

  async function handleMarkRead(id) {
    try {
      await markRead(id)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Não foi possível marcar como lida',
        message: error.message,
      })
    }
  }

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fce2ed] px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#b63b78]">
            <Sparkles size={14} />
            Acompanhamento da equipe
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#593a31]">
            Central de notificações
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#927b72]">
            Acompanhe novos cadastros, atualizações e acontecimentos
            importantes do Recanto da Dinda.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={!unreadCount}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadbd3] bg-white px-4 py-3 text-sm font-bold text-[#593a31] shadow-sm transition hover:border-[#f4c9da] hover:bg-[#fff0f6] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCheck size={17} />
          Marcar todas como lidas
        </button>
      </header>

      {/* INDICADORES */}
      <section className="grid gap-3 sm:grid-cols-2">

        <div className="flex items-center gap-4 rounded-2xl border border-[#f0e2da] bg-white p-5 shadow-sm">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
            <Bell size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#927b72]">
              Notificações não lidas
            </p>

            <p className="mt-1 text-2xl font-black text-[#593a31]">
              {unreadCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#f0e2da] bg-white p-5 shadow-sm">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f7eee9] text-[#8b5a49]">
            <PawPrint size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#927b72]">
              Total de notificações
            </p>

            <p className="mt-1 text-2xl font-black text-[#593a31]">
              {notifications.length}
            </p>
          </div>
        </div>
      </section>

      {/* CONFIGURAÇÃO PUSH */}
      <section className="relative overflow-hidden rounded-2xl border border-[#f0d5e1] bg-gradient-to-br from-[#fff0f6] via-[#fff8f3] to-white p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#f4c9da]/30 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#d94d91] shadow-sm">
              <Smartphone size={23} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-[#593a31]">
                  Notificações neste dispositivo
                </h2>

                {pushEnabled && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    ATIVADAS
                  </span>
                )}
              </div>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#927b72]">
                Receba alertas importantes mesmo quando não estiver
                utilizando o painel administrativo. Permita notificações
                no navegador para utilizar esse recurso.
              </p>

              {!pushSupported && (
                <p className="mt-2 text-xs font-semibold text-amber-700">
                  Este navegador ou dispositivo não oferece suporte a Web Push.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handlePushToggle}
            disabled={!pushSupported}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
              pushEnabled
                ? 'border border-[#f4c9da] bg-white text-[#b63b78] hover:bg-[#fff0f6]'
                : 'bg-[#d94d91] text-white shadow-md shadow-[#d94d91]/15 hover:-translate-y-0.5 hover:bg-[#bf3d7d]'
            }`}
          >
            {pushEnabled ? (
              <>
                <BellOff size={17} />
                Desativar push
              </>
            ) : (
              <>
                <Bell size={17} />
                Ativar notificações
              </>
            )}
          </button>
        </div>
      </section>

      {/* LISTAGEM */}
      <section className="overflow-hidden rounded-2xl border border-[#f0e2da] bg-white shadow-sm">

        {/* CABEÇALHO DA LISTAGEM */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f4eae5] px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-black text-[#593a31]">
              Todas as notificações
            </h2>

            <p className="mt-1 text-xs text-[#927b72]">
              {unreadCount === 0
                ? 'Você está em dia com suas notificações.'
                : `${unreadCount} notificação(ões) aguardando leitura.`}
            </p>
          </div>

          <button
            type="button"
            title="Atualizar notificações"
            onClick={handleRefresh}
            disabled={loading}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#eadbd3] bg-white text-[#8b5a49] transition hover:border-[#f4c9da] hover:bg-[#fff0f6] hover:text-[#d94d91] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
          </button>
        </div>

        {/* CARREGAMENTO */}
        {loading && notifications.length === 0 ? (
          <div className="p-12 text-center">
            <LoaderCircle
              size={27}
              className="mx-auto animate-spin text-[#d94d91]"
            />

            <p className="mt-3 text-sm font-medium text-[#927b72]">
              Carregando notificações...
            </p>
          </div>

        ) : notifications.length === 0 ? (

          /* ESTADO VAZIO */
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#fff0f6] text-[#d94d91]">
              <Bell size={29} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#593a31]">
              Tudo tranquilo por aqui!
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#927b72]">
              Nenhuma notificação por enquanto. Quando houver novos
              cadastros ou atualizações, você receberá um aviso aqui.
            </p>
          </div>

        ) : (

          /* NOTIFICAÇÕES */
          <div className="divide-y divide-[#f4eae5]">
            {notifications.map((item) => (
              <article
                key={item._id}
                className={`relative flex flex-col gap-4 p-5 transition-colors sm:flex-row sm:items-start sm:px-6 ${
                  !item.readAt
                    ? 'bg-[#fff8fb] hover:bg-[#fff3f8]'
                    : 'bg-white hover:bg-[#fffdfa]'
                }`}
              >
                {/* INDICADOR DE NÃO LIDA */}
                {!item.readAt && (
                  <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#d94d91]" />
                )}

                {/* ÍCONE */}
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                  !item.readAt
                    ? 'bg-[#fce2ed] text-[#d94d91]'
                    : 'bg-[#f7eee9] text-[#8b5a49]'
                }`}>
                  <PawPrint size={20} />
                </div>

                {/* CONTEÚDO */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-[#593a31]">
                      {item.title}
                    </h3>

                    {!item.readAt && (
                      <span className="rounded-full bg-[#fce2ed] px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#b63b78]">
                        NOVA
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-sm leading-6 text-[#806c64]">
                    {item.message}
                  </p>

                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#ae9a91]">
                    <Clock3 size={13} />
                    {formatDate(item.createdAt)}
                  </p>
                </div>

                {/* AÇÕES */}
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                  {!item.readAt && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(item._id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#eadbd3] bg-white px-3 py-2.5 text-xs font-bold text-[#806c64] transition hover:border-[#f4c9da] hover:bg-[#fff0f6] hover:text-[#b63b78]"
                    >
                      <CheckCircle2 size={14} />
                      Marcar como lida
                    </button>
                  )}

                  {item.link && (
                    <Link
                      to={item.link}
                      onClick={() => handleMarkRead(item._id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#593a31] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#765044]"
                    >
                      Abrir
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* RODAPÉ */}
        {notifications.length > 0 && (
          <div className="border-t border-[#f4eae5] bg-[#fffdfa] px-5 py-3.5 sm:px-6">
            <p className="text-xs text-[#a18c83]">
              Exibindo {notifications.length} notificação(ões).
              As atualizações são sincronizadas com o painel administrativo.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
