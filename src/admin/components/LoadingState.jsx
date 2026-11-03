import { LoaderCircle } from 'lucide-react'

export default function LoadingState({ label = 'Carregando informações...' }) {
  return <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-sm text-slate-500"><LoaderCircle className="animate-spin text-[#286247]" size={28} /><span>{label}</span></div>
}
