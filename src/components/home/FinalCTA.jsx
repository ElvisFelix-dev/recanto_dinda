
import {
  Dog,
  MessageCircle,
} from "lucide-react";

export default function FinalCTA({ whatsappLink }) {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-900 px-6 py-10 text-center sm:px-12 sm:py-14">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-emerald-700/70 blur-2xl" />

        <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-orange-400/20 blur-2xl" />

        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-orange-300">
            <Dog size={29} />
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Seu melhor amigo merece esse recanto.
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
            Entre em contato e descubra como proporcionar dias com mais
            brincadeiras, natureza e carinho para o seu cão.
          </p>

          <a
            href={whatsappLink(
              "Olá! Quero conhecer o Recanto da Dinda e agendar uma visita."
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-400 px-7 py-3.5 font-extrabold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-orange-300"
          >
            <MessageCircle size={18} />
            Vamos conversar
          </a>
        </div>
      </div>
    </section>
  );
}
