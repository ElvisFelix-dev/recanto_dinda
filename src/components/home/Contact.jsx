
import {
  MapPin,
  MessageCircle,
  Clock3,
  Instagram,
  ArrowUpRight,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function Contact({ whatsappLink }) {
  return (
    <section
      id="contato"
      className="scroll-mt-24 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Informações de contato"
          title="Venha conhecer o Recanto da Dinda"
          description="Fale com a gente para tirar dúvidas, conhecer o espaço e saber como funciona a avaliação para admissão."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* ENDEREÇO */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-700">
              <MapPin size={22} />
            </span>

            <h3 className="mt-4 font-extrabold text-emerald-950">
              Endereço
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Rua Luís Antônio dos Santos, 522
              <br />
              Santa Teresinha, São Paulo – SP
              <br />
              CEP 02460-000
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Rua+Lu%C3%ADs+Ant%C3%B4nio+dos+Santos+522+Santa+Teresinha+S%C3%A3o+Paulo"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:text-orange-600"
            >
              Ver no mapa
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* WHATSAPP */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <MessageCircle size={22} />
            </span>

            <h3 className="mt-4 font-extrabold text-emerald-950">
              Telefone / WhatsApp
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              +55 (11) 92575-5222
            </p>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              <MessageCircle size={16} />
              Chamar no WhatsApp
            </a>
          </div>

          {/* HORÁRIOS */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-700">
              <Clock3 size={22} />
            </span>

            <h3 className="mt-4 font-extrabold text-emerald-950">
              Horários
            </h3>

            <div className="mt-2 space-y-1.5 text-sm text-stone-600">
              <p className="flex justify-between gap-2">
                <span>Seg. a sex.</span>
                <strong className="text-stone-800">7h–19h</strong>
              </p>

              <p className="flex justify-between gap-2">
                <span>Sábado</span>
                <strong className="text-stone-800">9h–18h</strong>
              </p>

              <p className="flex justify-between gap-2">
                <span>Domingo</span>
                <strong className="text-stone-800">Fechado</strong>
              </p>
            </div>
          </div>

          {/* INSTAGRAM */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-100 text-pink-700">
              <Instagram size={22} />
            </span>

            <h3 className="mt-4 font-extrabold text-emerald-950">
              Instagram
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              @recanto_dadinda
            </p>

            <a
              href="https://www.instagram.com/recanto_dadinda/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:text-orange-600"
            >
              Acompanhar
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
