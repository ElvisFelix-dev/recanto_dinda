import { useCallback, useEffect, useState } from 'react'
import { KeyRound, Pencil, Plus, RefreshCw, Search, ShieldCheck, UserRound, Users, UserX, X } from 'lucide-react'
import { adminApi } from '../../services/api'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { useToast } from '../contexts/ToastContext'
import LoadingState from '../components/LoadingState'

const initialForm = { name: '', email: '', role: 'manager', password: '' }

function Field({ label, children }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</label>
}
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#6b9a7d] focus:ring-4 focus:ring-emerald-50'

export default function AdminUsers() {
  const { admin: currentAdmin } = useAdminAuth()
  const { showToast } = useToast()
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '' })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.getUsers({ ...filters, page, limit: 20 })
      setUsers(response.data || [])
      setPagination(response.pagination || { page, totalPages: 1, total: 0 })
    } catch (error) {
      showToast({ type: 'error', title: 'Não foi possível carregar a equipe', message: error.message })
    } finally { setLoading(false) }
  }, [filters, page, showToast])

  useEffect(() => { loadUsers() }, [loadUsers])

  function openCreate() {
    setSelected(null)
    setForm(initialForm)
    setModal('user')
  }
  function openEdit(user) {
    setSelected(user)
    setForm({ name: user.name || '', email: user.email || '', role: user.role || 'manager', password: '' })
    setModal('user')
  }
  function openPassword(user) {
    setSelected(user)
    setForm({ password: '' })
    setModal('password')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    try {
      if (modal === 'password') {
        await adminApi.changeUserPassword(selected._id, form.password)
        showToast({ type: 'success', title: 'Senha atualizada', message: `A nova senha de ${selected.name} foi salva.` })
      } else if (selected) {
        await adminApi.updateUser(selected._id, { name: form.name, email: form.email, role: form.role })
        showToast({ type: 'success', title: 'Usuário atualizado', message: `${form.name} teve os dados atualizados.` })
      } else {
        await adminApi.createUser(form)
        showToast({ type: 'success', title: 'Acesso criado com sucesso', message: `${form.name} já pode acessar o painel administrativo.` })
      }
      setModal('')
      await loadUsers()
    } catch (error) {
      showToast({ type: 'error', title: 'Não foi possível salvar', message: error.message })
    } finally { setSaving(false) }
  }

  async function toggleActive(user) {
    const next = !user.isActive
    try {
      await adminApi.updateUser(user._id, { isActive: next })
      showToast({
        type: next ? 'success' : 'warning',
        title: next ? 'Acesso reativado' : 'Acesso desativado',
        message: `${user.name} ${next ? 'voltou a ter acesso' : 'não poderá mais acessar'} ao painel.`,
      })
      await loadUsers()
    } catch (error) {
      showToast({ type: 'error', title: 'Não foi possível alterar o acesso', message: error.message })
    }
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#54816b]">Administração</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Equipe e acessos</h1><p className="mt-2 text-sm text-slate-500">Gerencie quem pode acessar o painel do Recanto da Dinda.</p></div>
      <button title="Cadastrar novo usuário administrativo" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#286247] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4e37]"><Plus size={17}/>Novo usuário</button>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-100 bg-white p-5"><Users className="text-[#54816b]" size={20}/><p className="mt-3 text-2xl font-bold text-slate-900">{pagination.total}</p><p className="text-xs text-slate-500">Usuários encontrados</p></div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5"><ShieldCheck className="text-emerald-600" size={20}/><p className="mt-3 text-2xl font-bold text-slate-900">{users.filter(user => user.role === 'admin').length}</p><p className="text-xs text-slate-500">Administradores nesta página</p></div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5"><UserRound className="text-sky-600" size={20}/><p className="mt-3 text-2xl font-bold text-slate-900">{users.filter(user => user.isActive).length}</p><p className="text-xs text-slate-500">Acessos ativos nesta página</p></div>
    </div>

    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 lg:flex-row">
        <div className="relative flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input aria-label="Pesquisar usuários" value={filters.search} onChange={event => { setPage(1); setFilters(current => ({ ...current, search: event.target.value })) }} placeholder="Pesquisar por nome ou e-mail..." className={`${inputClass} pl-10`}/></div>
        <select aria-label="Filtrar por perfil" value={filters.role} onChange={event => { setPage(1); setFilters(current => ({ ...current, role: event.target.value })) }} className={inputClass + ' lg:w-44'}><option value="">Todos os perfis</option><option value="admin">Administrador</option><option value="manager">Gerente</option></select>
        <select aria-label="Filtrar por situação" value={filters.isActive} onChange={event => { setPage(1); setFilters(current => ({ ...current, isActive: event.target.value })) }} className={inputClass + ' lg:w-44'}><option value="">Todas as situações</option><option value="true">Ativos</option><option value="false">Inativos</option></select>
        <button title="Atualizar lista de usuários" onClick={loadUsers} className="rounded-xl border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50"><RefreshCw size={17}/></button>
      </div>
      {loading ? <LoadingState label="Carregando equipe..."/> : users.length === 0 ? <div className="p-12 text-center"><Users className="mx-auto text-slate-300" size={32}/><p className="mt-3 font-semibold text-slate-600">Nenhum usuário encontrado</p><p className="mt-1 text-sm text-slate-400">Ajuste os filtros ou cadastre um novo acesso.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Usuário</th><th className="px-5 py-3">Perfil</th><th className="px-5 py-3">Situação</th><th className="px-5 py-3">Último acesso</th><th className="px-5 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map(user => <tr key={user._id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#edf4ef] font-bold text-[#286247]">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div><div><p className="font-semibold text-slate-800">{user.name}{String(user._id) === String(currentAdmin?.id) && <span className="ml-2 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">Você</span>}</p><p className="text-xs text-slate-400">{user.email}</p></div></div></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-violet-50 text-violet-700' : 'bg-sky-50 text-sky-700'}`}>{user.role === 'admin' ? 'Administrador' : 'Gerente'}</span></td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}/>{user.isActive ? 'Ativo' : 'Inativo'}</span></td><td className="px-5 py-4 text-xs text-slate-500">{user.lastLoginAt ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(user.lastLoginAt)) : 'Ainda não acessou'}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button title={`Editar ${user.name}`} onClick={() => openEdit(user)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#286247]"><Pencil size={16}/></button><button title={`Alterar senha de ${user.name}`} onClick={() => openPassword(user)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#286247]"><KeyRound size={16}/></button><button title={user.isActive ? `Desativar ${user.name}` : `Reativar ${user.name}`} disabled={String(user._id) === String(currentAdmin?.id)} onClick={() => toggleActive(user)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30">{user.isActive ? <UserX size={16}/> : <ShieldCheck size={16}/>}</button></div></td></tr>)}</tbody></table></div>}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4"><p className="text-xs text-slate-400">{pagination.total} usuário(s)</p><div className="flex items-center gap-3"><button disabled={page <= 1 || loading} onClick={() => setPage(value => value - 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40">Anterior</button><span className="text-xs text-slate-500">Página {page} de {Math.max(1, pagination.totalPages || 1)}</span><button disabled={page >= (pagination.totalPages || 1) || loading} onClick={() => setPage(value => value + 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40">Próxima</button></div></div>
    </section>

    {modal && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !saving) setModal('') }}><form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#54816b]">{modal === 'password' ? 'Segurança da conta' : 'Equipe'}</p><h2 className="mt-1 text-xl font-bold text-slate-900">{modal === 'password' ? `Alterar senha` : selected ? 'Editar usuário' : 'Novo usuário'}</h2><p className="mt-1 text-sm text-slate-500">{modal === 'password' ? `Defina uma nova senha para ${selected?.name}.` : 'Preencha os dados de acesso ao painel.'}</p></div><button type="button" title="Fechar janela" onClick={() => setModal('')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18}/></button></div>
      {modal === 'password' ? <Field label="Nova senha (mínimo de 12 caracteres)"><input required minLength={12} type="password" autoComplete="new-password" value={form.password || ''} onChange={event => setForm(current => ({ ...current, password: event.target.value }))} className={inputClass}/></Field> : <div className="space-y-4"><Field label="Nome completo"><input required minLength={3} maxLength={120} value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} className={inputClass}/></Field><Field label="E-mail"><input required type="email" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} className={inputClass}/></Field><Field label="Perfil de acesso"><select value={form.role} onChange={event => setForm(current => ({ ...current, role: event.target.value }))} className={inputClass}><option value="manager">Gerente</option><option value="admin">Administrador</option></select></Field>{!selected && <Field label="Senha inicial (mínimo de 12 caracteres)"><input required minLength={12} type="password" autoComplete="new-password" value={form.password} onChange={event => setForm(current => ({ ...current, password: event.target.value }))} className={inputClass}/></Field>}</div>}
      <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal('')} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancelar</button><button disabled={saving} className="rounded-xl bg-[#286247] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Salvando...' : 'Salvar alterações'}</button></div>
    </form></div>}
  </div>
}
