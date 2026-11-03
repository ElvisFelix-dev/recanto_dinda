import { createContext, useCallback, useContext, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

const ToastContext = createContext(null)
const icons = { success: CheckCircle2, error: AlertCircle, warning: AlertCircle, info: Info }
const styles = {
  success: 'border-emerald-200 bg-white text-emerald-900',
  error: 'border-rose-200 bg-white text-rose-900',
  warning: 'border-amber-200 bg-white text-amber-950',
  info: 'border-sky-200 bg-white text-sky-900',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts(current => current.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts(current => [...current, { id, type, title, message }].slice(-4))
    if (duration > 0) window.setTimeout(() => dismissToast(id), duration)
  }, [dismissToast])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3" aria-live="polite" aria-atomic="false">
        {toasts.map(toast => {
          const Icon = icons[toast.type] || Info
          return (
            <div key={toast.id} role={toast.type === 'error' ? 'alert' : 'status'} className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-slate-900/10 ${styles[toast.type] || styles.info}`}>
              <Icon size={21} className={toast.type === 'success' ? 'text-emerald-600' : toast.type === 'error' ? 'text-rose-600' : toast.type === 'warning' ? 'text-amber-600' : 'text-sky-600'} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{toast.title}</p>
                {toast.message && <p className="mt-1 text-xs leading-5 opacity-75">{toast.message}</p>}
              </div>
              <button type="button" onClick={() => dismissToast(toast.id)} title="Fechar notificação" aria-label="Fechar notificação" className="rounded-lg p-1 opacity-60 transition hover:bg-slate-100 hover:opacity-100"><X size={16} /></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider.')
  return context
}
