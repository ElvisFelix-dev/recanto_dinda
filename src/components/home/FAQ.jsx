import { useState } from "react";
import { ChevronDown, MessageCircle, PawPrint } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function FAQ({ faqs = [], whatsappLink }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="duvidas" className="scroll-mt-24 bg-[#f7f5ed] px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Tire suas dúvidas"
          title="Perguntas frequentes"
          description="Reunimos algumas informações para você conhecer melhor o Recanto da Dinda e se preparar para receber seu pet."
        />

        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  isOpen ? "border-[#b8c9b4] shadow-md" : "border-stone-200 shadow-sm"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-semibold text-[#173f31] sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#d97736] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6">
                    <p className="border-t border-stone-100 pt-4 leading-7 text-stone-600">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-9 flex flex-col items-center gap-4 rounded-2xl bg-[#123e30] px-6 py-7 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/10 p-3 text-[#f5b36d]">
              <PawPrint size={23} />
            </span>
            <div>
              <h3 className="font-semibold">Ainda ficou com alguma dúvida?</h3>
              <p className="mt-1 text-sm text-white/75">
                Nossa equipe pode ajudar você pelo WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#e88b43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d97736]"
          >
            <MessageCircle size={18} />
            Falar com a equipe
          </a>
        </div>
      </div>
    </section>
  );
}
