import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, PawPrint } from 'lucide-react'
export default function HotelBookingSuccess() {
  const { state } = useLocation()
  return <main className="grid min-h-screen place-items-center bg-[#fff8f3] px-4"><section className="w-full max-w-lg rounded-3xl border border-[#f0e2da] bg-white p-8 text-center shadow-xl"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]"><CheckCircle2 size={32}/></div><h1 className="mt-5 text-2xl font-black text-[#593a31]">Solicitação recebida!</h1><p className="mt-3 text-sm leading-6 text-[#98796d]">A equipe do Recanto da Dinda recebeu os dados e vai analisar a disponibilidade para o período solicitado. A hospedagem ainda não está confirmada.</p>{state?.bookingId&&<p className="mt-4 rounded-xl bg-[#fff8f3] p-3 text-xs text-[#8b5a49]">Protocolo: {state.bookingId}</p>}<Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#593a31] px-5 py-3 text-sm font-bold text-white"><PawPrint size={16}/>Voltar ao site</Link></section></main>
}
