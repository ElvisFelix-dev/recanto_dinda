
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  PawPrint,
  Phone,
  RefreshCw,
  UserRound,
  Users,
} from 'lucide-react'

import { adminApi } from '../../services/api'
import LoadingState from '../components/LoadingState'
import StatusBadge from '../components/StatusBadge'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
      }).format(date)
}

function ContactCard({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#F1E5DF] bg-[#FFFBF8] p-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#A18D85]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-[#593A31]">
          {value || 'Não informado'}
        </p>
      </div>
    </div>
  )
}

export default function GuardianDetails() {
  const { id } = useParams()

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setError('')

    try {
      const response = await adminApi.getGuardianPets(id)
      setResult(response.data || null)
    } catch (err) {
      setError(
        err.message || 'Não foi possível carregar os dados do tutor.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <LoadingState label="Carregando dados do tutor..." />
  }

  if (error || !result) {
    return (
      <div className="space-y-5">
        <Link
          title="Voltar para a lista geral de cadastros"
          to="/admin/cadastros"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B5A49] transition hover:text-[#D94D91]"
        >
          <ArrowLeft size={17} />
          Voltar aos cadastros
        </Link>

        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-6"
        >
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-rose-500">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="font-bold text-rose-800">
                Não foi possível carregar o perfil
              </h2>

              <p className="mt-1 text-sm text-rose-700">
                {error || 'Tutor não encontrado.'}
              </p>

              <button
                type="button"
                onClick={() => load()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#593A31] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#765044]"
              >
                <RefreshCw size={15} />
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { guardian, pets = [] } = result

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <header>
        <Link
          title="Voltar para a lista geral de cadastros"
          to="/admin/cadastros"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8B5A49] transition hover:text-[#D94D91]"
        >
          <ArrowLeft size={17} />
          Voltar aos cadastros
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#D94D91]">
              <Users size={17} />

              <p className="text-xs font-bold uppercase tracking-[.16em]">
                Relacionamento com tutores
              </p>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#593A31] sm:text-3xl">
              Perfil do tutor
            </h1>

            <p className="mt-1 text-sm text-[#927B72]">
              Consulte os dados do responsável e seus pets cadastrados.
            </p>
          </div>

          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#EADBD3] bg-white px-4 py-2.5 text-sm font-semibold text-[#593A31] shadow-sm transition hover:bg-[#FFFBF8] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={refreshing ? 'animate-spin' : ''}
            />
            Atualizar
          </button>
        </div>
      </header>

      {/* Perfil do tutor */}
      <section className="overflow-hidden rounded-3xl border border-[#F1E5DF] bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-[#D94D91] via-[#E9A5C3] to-[#F4C9DA]" />

        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-[#F4C9DA] bg-[#FCE2ED] text-[#D94D91]">
              <UserRound size={36} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-[#D94D91]">
                Responsável cadastrado
              </p>

              <h2 className="mt-1 break-words text-xl font-bold text-[#593A31] sm:text-2xl">
                {guardian?.name || 'Tutor'}
              </h2>

              <p className="mt-1 text-sm text-[#927B72]">
                CPF: {guardian?.cpf || 'Não informado'}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#F4C9DA] bg-[#FFF8F3] px-5 py-4 sm:min-w-[150px]">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
                <PawPrint size={21} />
              </div>

              <div>
                <p className="text-xs font-medium text-[#927B72]">
                  Pets cadastrados
                </p>

                <p className="mt-0.5 text-2xl font-bold tabular-nums text-[#593A31]">
                  {pets.length}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3 border-t border-[#F1E5DF] pt-6 sm:grid-cols-2">
            <ContactCard
              icon={Mail}
              label="E-mail"
              value={guardian?.email}
            />

            <ContactCard
              icon={Phone}
              label="Telefone"
              value={guardian?.phone}
            />
          </div>
        </div>
      </section>

      {/* Pets vinculados */}
      <section className="overflow-hidden rounded-3xl border border-[#F1E5DF] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#F1E5DF] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FCE2ED] text-[#D94D91]">
                <PawPrint size={19} />
              </div>

              <h2 className="font-bold text-[#593A31]">
                Pets vinculados
              </h2>
            </div>

            <p className="mt-2 text-xs text-[#A18D85]">
              Animais cadastrados por este responsável.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-[#F4C9DA] bg-[#FFF8F3] px-3 py-1.5 text-xs font-bold text-[#8B5A49]">
            {pets.length} {pets.length === 1 ? 'pet' : 'pets'}
          </span>
        </div>

        {pets.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#FFF8F3] text-[#D9B9AA]">
              <PawPrint size={30} />
            </div>

            <h3 className="mt-4 font-bold text-[#593A31]">
              Nenhum pet cadastrado
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#A18D85]">
              Este tutor ainda não possui pets vinculados ao seu cadastro.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F1E5DF]">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FFFBF8] sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#F4C9DA] bg-[#FCE2ED] text-[#D94D91]">
                    {pet.avatar?.url ? (
                      <img
                        src={pet.avatar.url}
                        alt={`Foto de ${pet.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center">
                        <PawPrint size={23} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[#593A31]">
                      {pet.name || 'Pet sem nome'}
                    </h3>

                    <p className="mt-1 text-sm text-[#927B72]">
                      {pet.breed || 'Raça não informada'}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#A18D85]">
                      <CalendarDays size={13} />
                      Cadastro em {formatDate(pet.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <StatusBadge status={pet.status} />

                  <Link
                    title={`Abrir ficha de ${pet.name || 'pet'}`}
                    to={`/admin/cadastros/${pet._id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#593A31] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#765044]"
                  >
                    Abrir ficha
                    <ArrowLeft
                      size={14}
                      className="rotate-180"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rodapé informativo */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#F4C9DA] bg-[#FFF8F3] p-4">
        <PawPrint
          size={19}
          className="mt-0.5 shrink-0 text-[#D94D91]"
        />

        <p className="text-xs leading-relaxed text-[#806B63]">
          As informações exibidas correspondem aos dados cadastrados pelo
          responsável. Para consultar ou atualizar os dados de um animal,
          acesse a ficha individual do pet.
        </p>
      </div>
    </div>
  )
}
