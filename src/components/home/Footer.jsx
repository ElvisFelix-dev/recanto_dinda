
import {
  PawPrint,
  Instagram,
  MessageCircle,
} from "lucide-react";

export default function Footer({ navItems, whatsappLink }) {
  return (
    <footer className="bg-[#103c2e] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        {/* MARCA */}
        <a
          href="#inicio"
          className="flex items-center gap-3"
          aria-label="Recanto da Dinda - voltar ao início"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-orange-300">
            <PawPrint size={28} />
          </span>

          <span>
            <strong className="block text-lg font-black">
              Recanto da Dinda
            </strong>

            <span className="mt-1 block text-xs text-white/65">
              Cuidado, diversão e bem-estar.
            </span>
          </span>
        </a>

        {/* NAVEGAÇÃO */}
        <nav
          className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white/75"
          aria-label="Links do rodapé"
        >
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="transition hover:text-orange-300"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* REDES SOCIAIS */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/recanto_dadinda/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram do Recanto da Dinda"
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <Instagram size={20} />
          </a>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp do Recanto da Dinda"
            className="grid h-11 w-11 place-items-center rounded-full bg-emerald-700 transition hover:bg-emerald-600"
          >
            <MessageCircle size={20} />
          </a>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/55">
        © {new Date().getFullYear()} Recanto da Dinda. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
