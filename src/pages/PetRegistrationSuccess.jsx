import { Link, useLocation } from "react-router-dom";
import {
  PawPrint,
  Heart,
  ClipboardCheck,
  MessageCircle,
  Home,
  Sparkles,
  PartyPopper,
  ShieldCheck,
} from "lucide-react";

export default function PetRegistrationSuccess() {
  const location = useLocation();
  const petName = location.state?.petName;
  const tutorName = location.state?.tutorName;

  const whatsappUrl =
    "https://wa.me/5511925755222?text=" +
    encodeURIComponent(
      `Olá! Acabei de enviar o cadastro${petName ? ` do ${petName}` : " do meu pet"} e gostaria de falar com a equipe.`
    );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-4 py-8 text-stone-800 sm:px-6 sm:py-12">
      {/* Formas decorativas */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-64 h-72 w-72 rounded-full bg-orange-100/80 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-orange-700">
            <PawPrint size={27} />
          </span>
          <div className="leading-tight">
            <p className="text-xl font-black tracking-tight text-emerald-950">
              Recanto da Dinda
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-800">
              Cuidado, diversão e bem-estar.
            </p>
          </div>
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-emerald-950/5 bg-white shadow-2xl shadow-emerald-950/10">
          {/* Hero divertido */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-950 px-6 pb-12 pt-10 text-center text-white sm:px-12 sm:pt-14">
            <div className="absolute -left-8 top-8 h-28 w-28 rounded-full border border-white/10" />
            <div className="absolute -right-10 bottom-2 h-40 w-40 rounded-full border border-white/10" />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-50">
                <PartyPopper size={15} />
                Missão cumprida!
              </span>

              <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
                Cadastro recebido
                <span className="mt-1 block text-orange-200">
                  com sucesso! 🐾
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/90 sm:text-base">
                {tutorName ? `Obrigado, ${tutorName}! ` : "Obrigado por escolher o Recanto da Dinda! "}
                {petName
                  ? `O cadastro do(a) ${petName} chegou direitinho por aqui.`
                  : "O cadastro do seu melhor amigo chegou direitinho por aqui."}
              </p>

              {/* Ilustração leve com emojis: não depende de imagens externas */}
              <div className="mt-8 flex items-end justify-center gap-3 sm:gap-7" aria-label="Cachorrinhos brincando">
                <span className="animate-bounce text-5xl [animation-delay:120ms] sm:text-7xl" role="img" aria-label="Cachorro">
                  🐕
                </span>
                <span className="animate-bounce text-6xl sm:text-8xl" role="img" aria-label="Cachorro brincando">
                  🐶
                </span>
                <span className="animate-bounce text-5xl [animation-delay:240ms] sm:text-7xl" role="img" aria-label="Cachorro">
                  🐕‍🦺
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold text-emerald-100/80">
                Já estamos imaginando a bagunça boa por aqui! 😄
              </p>
            </div>
          </div>

          <div className="px-5 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ShieldCheck size={30} />
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-emerald-950 sm:text-3xl">
                E agora, o que acontece?
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Só mais um pouquinho! Nossa equipe vai conferir as informações e os documentos enviados.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-stone-100 bg-[#fffdf8] p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                  <ClipboardCheck size={21} />
                </span>
                <h3 className="mt-4 font-extrabold text-emerald-950">
                  1. Conferência
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Vamos analisar o cadastro e a carteira de vacinação do seu pet.
                </p>
              </article>

              <article className="rounded-2xl border border-stone-100 bg-[#fffdf8] p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-orange-700">
                  <MessageCircle size={21} />
                </span>
                <h3 className="mt-4 font-extrabold text-emerald-950">
                  2. Retorno da equipe
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Se precisarmos de alguma informação, entraremos em contato pelos dados informados.
                </p>
              </article>

              <article className="rounded-2xl border border-stone-100 bg-[#fffdf8] p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-100 text-rose-700">
                  <Heart size={21} />
                </span>
                <h3 className="mt-4 font-extrabold text-emerald-950">
                  3. Próximos passos
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Após a confirmação da equipe, combinaremos os detalhes para receber seu melhor amigo.
                </p>
              </article>
            </div>

            <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50/80 p-5 text-center">
              <div className="flex items-center justify-center gap-2 font-extrabold text-emerald-950">
                <Sparkles size={18} className="text-orange-600" />
                Enquanto isso, pode ficar tranquilo(a)!
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Seu cadastro foi recebido. Aguarde nosso contato antes de considerar a admissão confirmada.
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-800 px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                <Home size={17} />
                Voltar para o início
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-7 py-3 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
              >
                <MessageCircle size={17} />
                Falar com a equipe
              </a>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-stone-400">
          Recanto da Dinda · Um lugar feliz para os melhores amigos.
        </p>
      </div>
    </main>
  );
}
