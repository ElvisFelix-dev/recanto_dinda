import { MessageCircle, Quote, Star } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function Testimonials({ testimonials = [], whatsappLink }) {
  return (
    <section className="bg-[#fffdf8] px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Carinho que cria vínculos"
          title="Histórias de quem faz parte do Recanto"
          description="Cada pet tem seu jeitinho e cada família tem uma história. Queremos compartilhar experiências reais de quem já conhece nosso espaço."
        />

        {testimonials.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <article
                key={`${item.guardian}-${item.pet}-${index}`}
                className="flex h-full flex-col rounded-3xl border border-[#e9e5d9] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#f5eee2] p-3 text-[#d97736]">
                    <Quote size={21} />
                  </span>
                  {item.rating && (
                    <div className="flex gap-1" aria-label={`${item.rating} de 5 estrelas`}>
                      {Array.from({ length: item.rating }).map((_, starIndex) => (
                        <Star key={starIndex} size={15} className="fill-[#e6a04b] text-[#e6a04b]" />
                      ))}
                    </div>
                  )}
                </div>

                <p className="mt-5 flex-1 leading-7 text-stone-600">
                  “{item.text}”
                </p>

                <div className="mt-6 border-t border-stone-100 pt-4">
                  <p className="font-semibold text-[#173f31]">{item.guardian}</p>
                  <p className="mt-1 text-sm text-stone-500">Tutor(a) do(a) {item.pet}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-dashed border-[#cbd5c0] bg-[#f7f5ed] px-6 py-9 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#d97736] shadow-sm">
              <Quote size={25} />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[#173f31]">
              A próxima história pode ser a sua
            </h3>
            <p className="mx-auto mt-2 max-w-xl leading-7 text-stone-600">
              Estamos preparando este espaço para publicar relatos reais das famílias
              que fazem parte do Recanto. Se você já conhece nosso trabalho, conte
              sua experiência para a equipe.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#173f31] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245640]"
            >
              <MessageCircle size={18} />
              Compartilhar minha experiência
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
