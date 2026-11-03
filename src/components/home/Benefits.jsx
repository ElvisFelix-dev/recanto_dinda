
import { PawPrint } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

function BenefitItem({ icon: Icon, title, description, color }) {
  return (
    <div className="flex gap-4">
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${color}`}
      >
        <Icon size={23} />
      </span>

      <div>
        <h3 className="font-extrabold text-emerald-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Benefits({ benefits, photos }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nossos diferenciais"
          title="Um espaço pensado para o bem-estar dos cães"
          description="Liberdade para explorar, convivência acompanhada e atenção às necessidades de cada pet."
        />

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.85fr_1fr] lg:gap-7">
          {/* PRIMEIRA COLUNA */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {benefits.slice(0, 3).map((benefit) => (
              <BenefitItem key={benefit.title} {...benefit} />
            ))}
          </div>

          {/* IMAGEM CENTRAL */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-5 rounded-full bg-orange-100 blur-2xl" />

            <img
              src={photos.grass}
              alt="Área externa verde para os cães"
              loading="lazy"
              className="relative h-[300px] w-full rounded-[3rem] object-cover shadow-lg sm:h-[380px]"
            />

            <span className="absolute -bottom-4 -left-3 grid h-16 w-16 place-items-center rounded-2xl border-4 border-white bg-orange-400 text-white shadow-lg">
              <PawPrint size={30} />
            </span>
          </div>

          {/* SEGUNDA COLUNA */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {benefits.slice(3).map((benefit) => (
              <BenefitItem key={benefit.title} {...benefit} />
            ))}
          </div>
        </div>

        {/* AVISO DE ADMISSÃO */}
        <p className="mx-auto mt-10 max-w-3xl rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-center text-sm leading-6 text-stone-700">
          <strong className="text-emerald-950">
            Admissão responsável:
          </strong>{" "}
          atendimento para cães de pequeno e médio porte, sujeito a avaliação
          comportamental prévia.
        </p>
      </div>
    </section>
  );
}
