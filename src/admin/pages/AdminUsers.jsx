
import { useCallback, useEffect, useState } from 'react'
import {
  KeyRound,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  UserX,
  X,
  Mail,
  UserCheck,
  LockKeyhole,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

import { adminApi } from '../../services/api'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { useToast } from '../contexts/ToastContext'
import LoadingState from '../components/LoadingState'

const initialForm = {
  name: '',
  email: '',
  role: 'manager',
  password: '',
}

const inputClass =
  'w-full rounded-xl border border-[#eadbd3] bg-white px-3.5 py-3 text-sm text-[#593a31] outline-none transition placeholder:text-[#b49b91] focus:border-[#d94d91] focus:ring-4 focus:ring-[#d94d91]/10 disabled:bg-[#fff8f3]'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#593a31]">
        {label}
      </span>
      {children}
    </label>
  )
}

function formatLastLogin(value) {
  if (!value) return 'Ainda não acessou'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export default function AdminUsers() {
  const { admin: currentAdmin } = useAdminAuth()
  const { showToast } = useToast()

  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isActive: '',
  })

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)

    try {
      const response = await adminApi.getUsers({
        ...filters,
        page,
        limit: 20,
      })

      setUsers(response.data || [])

      setPagination(
        response.pagination || {
          page,
          totalPages: 1,
          total: 0,
        }
      )
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Não foi possível carregar a equipe',
        message: error.message,
      })
    } finally {
      setLoading(false)
    }
  }, [filters, page, showToast])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  function openCreate() {
    setSelected(null)
    setForm(initialForm)
    setModal('user')
  }

  function openEdit(user) {
    setSelected(user)

    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'manager',
      password: '',
    })

    setModal('user')
  }

  function openPassword(user) {
    setSelected(user)
    setForm({ password: '' })
    setModal('password')
  }

  function closeModal() {
    if (saving) return

    setModal('')
    setSelected(null)
    setForm(initialForm)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)

    try {
      if (modal === 'password') {
        await adminApi.changeUserPassword(
          selected._id,
          form.password
        )

        showToast({
          type: 'success',
          title: 'Senha atualizada',
          message: `A nova senha de ${selected.name} foi salva.`,
        })
      } else if (selected) {
        await adminApi.updateUser(selected._id, {
          name: form.name,
          email: form.email,
          role: form.role,
        })

        showToast({
          type: 'success',
          title: 'Usuário atualizado',
          message: `${form.name} teve os dados atualizados.`,
        })
      } else {
        await adminApi.createUser(form)

        showToast({
          type: 'success',
          title: 'Acesso criado com sucesso',
          message: `${form.name} já pode acessar o painel administrativo.`,
        })
      }

      setModal('')
      setSelected(null)
      await loadUsers()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Não foi possível salvar',
        message: error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(user) {
    const next = !user.isActive

    try {
      await adminApi.updateUser(user._id, {
        isActive: next,
      })

      showToast({
        type: next ? 'success' : 'warning',
        title: next ? 'Acesso reativado' : 'Acesso desativado',
        message: `${user.name} ${
          next
            ? 'voltou a ter acesso'
            : 'não poderá mais acessar'
        } ao painel.`,
      })

      await loadUsers()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Não foi possível alterar o acesso',
        message: error.message,
      })
    }
  }

  const adminCount = users.filter(
    (user) => user.role === 'admin'
  ).length

  const activeCount = users.filter(
    (user) => user.isActive
  ).length

  const managerCount = users.filter(
    (user) => user.role === 'manager'
  ).length

  const isCurrentUser = (user) =>
    String(user._id) === String(currentAdmin?.id)

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fce2ed] px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#b63b78]">
            <Sparkles size={14} />
            Administração
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#593a31]">
            Equipe e acessos
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#927b72]">
            Gerencie os usuários, permissões e acessos ao painel
            administrativo do Recanto da Dinda.
          </p>
        </div>

        <button
          type="button"
          title="Cadastrar novo usuário administrativo"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d94d91] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#d94d91]/15 transition hover:-translate-y-0.5 hover:bg-[#bf3d7d]"
        >
          <Plus size={18} />
          Novo usuário
        </button>
      </header>

      {/* INDICADORES */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-[#f0e2da] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]">
              <Users size={21} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b49b91]">
              Equipe
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-[#593a31]">
            {pagination.total}
          </p>

          <p className="mt-1 text-xs font-medium text-[#927b72]">
            Usuários encontrados
          </p>
        </div>

        <div className="rounded-2xl border border-[#f0e2da] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f7eee9] text-[#8b5a49]">
              <ShieldCheck size={21} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b49b91]">
              Segurança
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-[#593a31]">
            {adminCount}
          </p>

          <p className="mt-1 text-xs font-medium text-[#927b72]">
            Administradores nesta página
          </p>
        </div>

        <div className="rounded-2xl border border-[#f0e2da] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <UserCheck size={21} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b49b91]">
              Atividade
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-[#593a31]">
            {activeCount}
          </p>

          <p className="mt-1 text-xs font-medium text-[#927b72]">
            Acessos ativos nesta página
          </p>
        </div>

        <div className="rounded-2xl border border-[#f0e2da] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0f6] text-[#b63b78]">
              <UserRound size={21} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b49b91]">
              Gestão
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-[#593a31]">
            {managerCount}
          </p>

          <p className="mt-1 text-xs font-medium text-[#927b72]">
            Gerentes nesta página
          </p>
        </div>
      </section>

      {/* LISTAGEM */}
      <section className="overflow-hidden rounded-2xl border border-[#f0e2da] bg-white shadow-sm">

        {/* FILTROS */}
        <div className="flex flex-col gap-3 border-b border-[#f4eae5] p-5 lg:flex-row lg:items-center">

          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b49b91]"
            />

            <input
              aria-label="Pesquisar usuários"
              value={filters.search}
              onChange={(event) => {
                setPage(1)

                setFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }}
              placeholder="Pesquisar por nome ou e-mail..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            aria-label="Filtrar por perfil"
            value={filters.role}
            onChange={(event) => {
              setPage(1)

              setFilters((current) => ({
                ...current,
                role: event.target.value,
              }))
            }}
            className={`${inputClass} lg:w-48`}
          >
            <option value="">Todos os perfis</option>
            <option value="admin">Administrador</option>
            <option value="manager">Gerente</option>
          </select>

          <select
            aria-label="Filtrar por situação"
            value={filters.isActive}
            onChange={(event) => {
              setPage(1)

              setFilters((current) => ({
                ...current,
                isActive: event.target.value,
              }))
            }}
            className={`${inputClass} lg:w-48`}
          >
            <option value="">Todas as situações</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>

          <button
            type="button"
            title="Atualizar lista de usuários"
            onClick={loadUsers}
            disabled={loading}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#eadbd3] bg-white text-[#8b5a49] transition hover:border-[#f4c9da] hover:bg-[#fff0f6] hover:text-[#d94d91] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
          </button>
        </div>

        {/* CONTEÚDO */}
        {loading ? (
          <LoadingState label="Carregando equipe..." />
        ) : users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#fff0f6] text-[#d94d91]">
              <Users size={29} />
            </div>

            <h3 className="mt-4 font-bold text-[#593a31]">
              Nenhum usuário encontrado
            </h3>

            <p className="mt-1 text-sm text-[#927b72]">
              Ajuste os filtros ou cadastre um novo acesso.
            </p>

            <button
              type="button"
              onClick={openCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#d94d91] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#bf3d7d]"
            >
              <Plus size={16} />
              Novo usuário
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">

              <thead className="bg-[#fff8f3] text-[10px] font-bold uppercase tracking-[.12em] text-[#a18c83]">
                <tr>
                  <th className="px-5 py-4">Usuário</th>
                  <th className="px-5 py-4">Perfil</th>
                  <th className="px-5 py-4">Situação</th>
                  <th className="px-5 py-4">Último acesso</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f4eae5]">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-[#fffdfa]"
                  >

                    {/* USUÁRIO */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fce2ed] text-sm font-black text-[#b63b78]">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-[#593a31]">
                              {user.name}
                            </p>

                            {isCurrentUser(user) && (
                              <span className="rounded-full bg-[#fce2ed] px-2 py-0.5 text-[10px] font-bold text-[#b63b78]">
                                Você
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#a18c83]">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PERFIL */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                          user.role === 'admin'
                            ? 'border-[#ead6f5] bg-[#f7edfc] text-[#8050a0]'
                            : 'border-[#f0e2da] bg-[#f7eee9] text-[#8b5a49]'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <ShieldCheck size={13} />
                        ) : (
                          <UserRound size={13} />
                        )}

                        {user.role === 'admin'
                          ? 'Administrador'
                          : 'Gerente'}
                      </span>
                    </td>

                    {/* SITUAÇÃO */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                          user.isActive
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                            : 'border-[#eadbd3] bg-[#f7eee9] text-[#927b72]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isActive
                              ? 'bg-emerald-500'
                              : 'bg-[#b49b91]'
                          }`}
                        />

                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* ÚLTIMO ACESSO */}
                    <td className="px-5 py-4 text-xs font-medium text-[#927b72]">
                      {formatLastLogin(user.lastLoginAt)}
                    </td>

                    {/* AÇÕES */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">

                        <button
                          type="button"
                          title={`Editar ${user.name}`}
                          onClick={() => openEdit(user)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-[#927b72] transition hover:bg-[#fff0f6] hover:text-[#d94d91]"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title={`Alterar senha de ${user.name}`}
                          onClick={() => openPassword(user)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-[#927b72] transition hover:bg-[#fff0f6] hover:text-[#d94d91]"
                        >
                          <KeyRound size={16} />
                        </button>

                        <button
                          type="button"
                          title={
                            user.isActive
                              ? `Desativar ${user.name}`
                              : `Reativar ${user.name}`
                          }
                          disabled={isCurrentUser(user)}
                          onClick={() => toggleActive(user)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-[#927b72] transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          {user.isActive ? (
                            <UserX size={16} />
                          ) : (
                            <ShieldCheck size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINAÇÃO */}
        <div className="flex flex-col gap-3 border-t border-[#f4eae5] bg-[#fffdfa] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-[#a18c83]">
            {pagination.total} usuário(s) encontrados
          </p>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((value) => value - 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-[#eadbd3] bg-white px-3 py-2 text-xs font-bold text-[#593a31] transition hover:bg-[#fff0f6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
              Anterior
            </button>

            <span className="whitespace-nowrap text-xs font-semibold text-[#927b72]">
              Página {page} de {Math.max(1, pagination.totalPages || 1)}
            </span>

            <button
              type="button"
              disabled={
                page >= (pagination.totalPages || 1) || loading
              }
              onClick={() => setPage((value) => value + 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-[#eadbd3] bg-white px-3 py-2 text-xs font-bold text-[#593a31] transition hover:bg-[#fff0f6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {modal && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#33221e]/50 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeModal()
            }
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-[#f0e2da] bg-[#fff8f3] shadow-2xl"
          >

            {/* CABEÇALHO DO MODAL */}
            <div className="flex items-start justify-between gap-3 border-b border-[#f0e2da] p-6">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fce2ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#b63b78]">
                  {modal === 'password' ? (
                    <LockKeyhole size={13} />
                  ) : (
                    <Users size={13} />
                  )}

                  {modal === 'password'
                    ? 'Segurança da conta'
                    : 'Equipe do Recanto'}
                </div>

                <h2 className="text-xl font-black text-[#593a31]">
                  {modal === 'password'
                    ? 'Alterar senha'
                    : selected
                      ? 'Editar usuário'
                      : 'Novo usuário'}
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#927b72]">
                  {modal === 'password'
                    ? `Defina uma nova senha para ${selected?.name}.`
                    : 'Preencha os dados de acesso ao painel administrativo.'}
                </p>
              </div>

              <button
                type="button"
                title="Fechar janela"
                onClick={closeModal}
                disabled={saving}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#927b72] transition hover:bg-[#fce2ed] hover:text-[#b63b78] disabled:opacity-40"
              >
                <X size={19} />
              </button>
            </div>

            {/* CAMPOS */}
            <div className="space-y-4 p-6">

              {modal === 'password' ? (
                <Field label="Nova senha (mínimo de 12 caracteres)">
                  <input
                    required
                    minLength={12}
                    type="password"
                    autoComplete="new-password"
                    value={form.password || ''}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Digite a nova senha"
                    className={inputClass}
                  />
                </Field>
              ) : (
                <>
                  <Field label="Nome completo">
                    <input
                      required
                      minLength={3}
                      maxLength={120}
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Nome do colaborador"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="E-mail">
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      placeholder="email@exemplo.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Perfil de acesso">
                    <select
                      value={form.role}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          role: event.target.value,
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="manager">Gerente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </Field>

                  {!selected && (
                    <Field label="Senha inicial (mínimo de 12 caracteres)">
                      <input
                        required
                        minLength={12}
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                        placeholder="Crie uma senha inicial"
                        className={inputClass}
                      />
                    </Field>
                  )}
                </>
              )}
            </div>

            {/* RODAPÉ DO MODAL */}
            <div className="flex flex-col-reverse gap-2 border-t border-[#f0e2da] bg-white p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-[#eadbd3] bg-white px-5 py-3 text-sm font-bold text-[#593a31] transition hover:bg-[#fff0f6] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d94d91] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#bf3d7d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <RefreshCw size={16} className="animate-spin" />
                )}

                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
