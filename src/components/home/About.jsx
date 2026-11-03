
import { PawPrint, ArrowUpRight } from "lucide-react";

export default function About({ photos, whatsappLink }) {
  return (
    <section
      id="quem-somos"
      className="scroll-mt-24 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* IMAGEM */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-3 -top-3 h-24 w-24 rounded-full border-2 border-dashed border-orange-300 sm:-left-5 sm:-top-5 sm:h-32 sm:w-32" />

          <img
            src={photos.smallDog}
            alt="Cão de pequeno porte aproveitando o espaço verde"
            loading="lazy"
            className="relative h-[320px] w-full rounded-[2rem] rounded-tr-[5rem] object-cover shadow-xl sm:h-[430px] sm:rounded-[2.5rem] sm:rounded-tr-[7rem]"
          />

          <div className="absolute -bottom-5 right-3 rounded-2xl border border-white bg-white p-4 shadow-xl sm:right-7 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-orange-700">
                <PawPrint size={23} />
              </span>

              <span>
                <strong className="block text-lg font-black text-emerald-950">
                  Um lugar especial
                </strong>
                <span className="text-xs text-stone-500">
                  para seu melhor amigo
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="pt-5 lg:pt-0">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-emerald-800">
            Quem somos
          </p>

          <h2 className="text-3xl font-black leading-tight tracking-tight text-emerald-950 sm:text-4xl">
            Mais que uma creche, um recanto para o seu pet.
          </h2>

          <span className="mt-5 block h-1 w-14 rounded-full bg-orange-400" />

          <p className="mt-6 text-base leading-8 text-stone-600">
            O Recanto da Dinda é um espaço dedicado ao bem-estar de cães de
            pequeno e médio porte, com uma proposta de convivência, liberdade
            e carinho.
          </p>

          <p className="mt-4 text-base leading-8 text-stone-600">
            Com cerca de 500 m² de área verde, árvores e espaço ao ar livre,
            queremos proporcionar momentos de brincadeira, socialização e
            descanso em um ambiente acolhedor, sem baías, gaiolas ou canis.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {[
              "Ambiente acolhedor",
              "Área ao ar livre",
              "Cuidado com carinho",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900"
              >
                <PawPrint size={14} />
                {tag}
              </span>
            ))}
          </div>

          <a
            href={whatsappLink(
              "Olá! Gostaria de conhecer o Recanto da Dinda e saber sobre a avaliação para admissão."
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-extrabold text-emerald-800 transition hover:text-orange-600"
          >
            Conheça nosso espaço
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
