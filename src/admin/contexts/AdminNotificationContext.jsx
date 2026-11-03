import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { API_URL, adminApi } from '../../services/api'
import { useAdminAuth } from './AdminAuthContext'
import { useToast } from './ToastContext'

const AdminNotificationContext = createContext(null)
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '')

function decodeVapidKey(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)))
}

export function AdminNotificationProvider({ children }) {
  const { token, admin } = useAdminAuth()
  const { showToast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushSupported] = useState(() => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window)

  const refresh = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const response = await adminApi.getNotifications({ limit: 30 })
      setNotifications(response.data || [])
      setUnreadCount(response.unreadCount || 0)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!token || !admin) {
      setNotifications([])
      setUnreadCount(0)
      return undefined
    }

    refresh().catch((error) => console.error('[NOTIFICATIONS]', error))
    const socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket', 'polling'] })
    socket.on('admin:notification', (notification) => {
      setNotifications((current) => [notification, ...current.filter((item) => item._id !== notification._id)].slice(0, 30))
      if (!notification.readAt) setUnreadCount((current) => current + 1)
      if (notification.type === 'new_pet') {
        showToast({ type: 'info', title: notification.title, message: notification.message, duration: 6000 })
      }
    })
    socket.on('connect_error', (error) => console.warn('[SOCKET] Notificações em tempo real indisponíveis:', error.message))

    return () => socket.disconnect()
  }, [token, admin, refresh, showToast])

  useEffect(() => {
    if (!pushSupported || !token) return
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setPushEnabled(Boolean(subscription)))
      .catch((error) => console.warn('[PUSH] Não foi possível verificar a inscrição:', error.message))
  }, [pushSupported, token])

  const markRead = useCallback(async (id) => {
    const item = notifications.find((notification) => notification._id === id)
    if (!item || item.readAt) return
    setNotifications((current) => current.map((notification) => notification._id === id ? { ...notification, readAt: new Date().toISOString() } : notification))
    setUnreadCount((current) => Math.max(0, current - 1))
    try { await adminApi.markNotificationRead(id) } catch { refresh().catch(() => {}) }
  }, [notifications, refresh])

  const markAllRead = useCallback(async () => {
    setNotifications((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })))
    setUnreadCount(0)
    await adminApi.markAllNotificationsRead()
  }, [])

  const enablePush = useCallback(async () => {
    if (!pushSupported) throw new Error('Este navegador não oferece suporte a notificações push.')
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') throw new Error('Permissão de notificações não concedida pelo navegador.')

    const keyResponse = await adminApi.getPushPublicKey()
    const publicKey = keyResponse.data?.publicKey
    if (!publicKey) throw new Error('As chaves VAPID ainda não foram configuradas no backend.')

    const registration = await navigator.serviceWorker.register('/sw.js')
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(publicKey),
    })
    await adminApi.savePushSubscription(subscription.toJSON())
    setPushEnabled(true)
    return true
  }, [pushSupported])

  const disablePush = useCallback(async () => {
    if (!pushSupported) return
    const registration = await navigator.serviceWorker.getRegistration('/sw.js')
    const subscription = await registration?.pushManager.getSubscription()
    if (subscription) {
      await adminApi.removePushSubscription(subscription.endpoint)
      await subscription.unsubscribe()
    }
    setPushEnabled(false)
  }, [pushSupported])

  const value = useMemo(() => ({
    notifications, unreadCount, loading, pushEnabled, pushSupported,
    refresh, markRead, markAllRead, enablePush, disablePush,
  }), [notifications, unreadCount, loading, pushEnabled, pushSupported, refresh, markRead, markAllRead, enablePush, disablePush])

  return <AdminNotificationContext.Provider value={value}>{children}</AdminNotificationContext.Provider>
}

export function useAdminNotifications() {
  const context = useContext(AdminNotificationContext)
  if (!context) throw new Error('useAdminNotifications deve ser usado dentro de AdminNotificationProvider.')
  return context
}
