import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, PawPrint, Phone, UserRound } from 'lucide-react'
import { adminApi } from '../../services/api'
import LoadingState from '../components/LoadingState'
import StatusBadge from '../components/StatusBadge'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date)
}

export default function GuardianDetails() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await adminApi.getGuardianPets(id)
      setResult(response.data || null)
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os dados do tutor.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState label="Carregando dados do tutor..." />
  if (error || !result) return <div className="space-y-4"><Link title="Voltar para a lista geral de cadastros" to="/admin/cadastros" className="inline-flex items-center gap-2 text-sm font-semibold text-[#286247]"><ArrowLeft size={16} />Voltar aos cadastros</Link><div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error || 'Tutor não encontrado.'}</div></div>

  const { guardian, pets = [] } = result
  return <div className="space-y-6"><div><Link title="Voltar para a lista geral de cadastros" to="/admin/cadastros" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#54816b]"><ArrowLeft size={16} />Voltar aos cadastros</Link><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#54816b]">RELACIONAMENTO COM TUTORES</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Perfil do tutor</h1></div>
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/30"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#edf4ef] text-[#54816b]"><UserRound size={30} /></div><div className="min-w-0 flex-1"><h2 className="text-xl font-bold text-slate-900">{guardian?.name || 'Tutor'}</h2><p className="mt-1 text-sm text-slate-500">CPF: {guardian?.cpf || '—'}</p></div><div className="rounded-xl bg-[#f5f8f5] px-4 py-3"><p className="text-xs text-slate-400">Pets cadastrados</p><p className="mt-1 text-2xl font-bold text-[#286247]">{pets.length}</p></div></div><div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2"><div className="flex items-center gap-3 text-sm text-slate-600"><Mail size={17} className="text-[#54816b]" />{guardian?.email || '—'}</div><div className="flex items-center gap-3 text-sm text-slate-600"><Phone size={17} className="text-[#54816b]" />{guardian?.phone || '—'}</div></div></section>
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/30"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Pets vinculados</h2><p className="mt-1 text-xs text-slate-400">Animais cadastrados por este responsável</p></div>{pets.length === 0 ? <div className="p-10 text-center text-sm text-slate-400">Este tutor ainda não possui pets cadastrados.</div> : <div className="divide-y divide-slate-100">{pets.map(pet => <div key={pet._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#edf4ef] text-[#54816b]">{pet.avatar?.url ? <img src={pet.avatar.url} alt={`Foto de ${pet.name}`} className="h-full w-full object-cover"/> : <div className="grid h-full w-full place-items-center"><PawPrint size={18}/></div>}</div><div><p className="font-semibold text-slate-800">{pet.name}</p><p className="mt-0.5 text-xs text-slate-400">{pet.breed || 'Raça não informada'} · Cadastro em {formatDate(pet.createdAt)}</p></div></div><div className="flex items-center gap-3"><StatusBadge status={pet.status} /><Link title={`Abrir ficha de ${pet.name || 'pet'}`} to={`/admin/cadastros/${pet._id}`} className="text-sm font-semibold text-[#286247] hover:underline">Abrir ficha</Link></div></div>)}</div>}</section>
  </div>
}
