
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function Services({ services, whatsappLink }) {
  return (
    <section
      id="servicos"
      className="scroll-mt-24 bg-[#eef7ed] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nossos serviços"
          title="Tudo para seu cão aproveitar o dia"
          description="Opções para brincar, socializar e ficar bem cuidado, de acordo com a rotina da sua família."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(
            ({ title, description, image, icon: Icon, color }) => (
              <article
                key={title}
                className="group overflow-hidden rounded-[1.5rem] border border-emerald-950/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44 lg:h-40"
                  />

                  <span
                    className={`absolute bottom-3 left-4 grid h-11 w-11 place-items-center rounded-2xl shadow-md ${color}`}
                  >
                    <Icon size={21} />
                  </span>
                </div>

                <div className="p-5 pt-6">
                  <h3 className="text-lg font-extrabold text-emerald-950">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {description}
                  </p>

                  <a
                    href={whatsappLink(
                      `Olá! Gostaria de informações sobre ${title.toLowerCase()} no Recanto da Dinda.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-emerald-800 transition hover:text-orange-600"
                  >
                    Saiba mais
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
