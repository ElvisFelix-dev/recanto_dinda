
import {
  PawPrint,
  Heart,
  Trees,
  MessageCircle,
  ArrowUpRight,
  CalendarDays,
  Leaf,
} from "lucide-react";

export default function Hero({ photos, whatsappLink }) {
  return (
    <section id="inicio" className="relative isolate scroll-mt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-100 via-[#fffdf8] to-emerald-50" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-8 lg:py-20">
        {/* TEXTO */}
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-800 shadow-sm">
            <PawPrint size={15} />
            Creche e hotel para cães
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
            Um segundo lar para o seu{" "}
            <span className="relative inline-block text-emerald-700">
              melhor amigo
              <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-orange-300/70" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
            No Recanto da Dinda, seu cão encontra espaço para brincar,
            liberdade para explorar e carinho em um ambiente acolhedor,
            com muito verde e cuidado.
          </p>

          {/* AÇÕES */}
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
            <a
              href={whatsappLink(
                "Olá! Gostaria de agendar uma visita ao Recanto da Dinda."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              <MessageCircle size={18} />
              Agendar uma visita
              <ArrowUpRight size={16} />
            </a>

            <a
              href={whatsappLink(
                "Olá! Gostaria de saber como funciona o cadastro e a avaliação para meu cão."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-800/25 bg-white/70 px-6 py-3.5 text-sm font-extrabold text-emerald-900 transition hover:border-emerald-700 hover:bg-emerald-50"
            >
              <CalendarDays size={18} />
              Quero saber mais
            </a>
          </div>

          {/* DESTAQUES */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-stone-600">
            <span className="inline-flex items-center gap-2">
              <Trees size={17} className="text-emerald-700" />
              Cerca de 500 m² de área verde
            </span>

            <span className="inline-flex items-center gap-2">
              <Heart size={17} className="text-orange-500" />
              Cuidado com carinho
            </span>
          </div>
        </div>

        {/* IMAGEM */}
        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute -right-3 -top-4 h-28 w-28 rounded-full bg-orange-200/70 blur-2xl sm:-right-5 sm:h-40 sm:w-40" />

          <div className="absolute -bottom-5 -left-4 h-32 w-32 rounded-full bg-emerald-200/80 blur-2xl sm:-left-8 sm:h-44 sm:w-44" />

          <div className="relative overflow-hidden rounded-[2rem] rounded-bl-[5rem] border-[7px] border-white shadow-2xl shadow-emerald-950/10 sm:rounded-[2.5rem] sm:rounded-bl-[7rem]">
            <img
              src={photos.hero}
              alt="Cachorro feliz em um ambiente ao ar livre"
              className="h-[340px] w-full object-cover sm:h-[460px] lg:h-[520px]"
              fetchPriority="high"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/25 to-transparent p-6 pt-20 sm:p-8 sm:pt-24">
              <p className="max-w-sm text-2xl font-black leading-tight text-white sm:text-3xl">
                Aqui, cada cão é recebido como parte da família.
              </p>

              <p className="mt-2 text-sm font-medium text-white/85">
                Liberdade, natureza e cuidado todos os dias.
              </p>
            </div>
          </div>

          {/* SELO SUPERIOR */}
          <div className="absolute -left-2 top-7 hidden items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-xl sm:flex">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
              <Leaf size={21} />
            </span>

            <span>
              <strong className="block text-sm text-emerald-950">
                Mais espaço
              </strong>
              <span className="text-xs text-stone-500">
                para ser cachorro
              </span>
            </span>
          </div>

          {/* SELO INFERIOR */}
          <div className="absolute -bottom-5 right-4 flex items-center gap-2 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl sm:right-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-700">
              <Heart size={21} />
            </span>

            <span>
              <strong className="block text-sm text-emerald-950">
                Muito carinho
              </strong>
              <span className="text-xs text-stone-500">
                em cada momento
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
