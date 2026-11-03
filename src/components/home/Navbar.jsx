
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  PawPrint,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

export default function Navbar({
  menuOpen,
  setMenuOpen,
  navItems,
  whatsappLink,
}) {
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/5 bg-[#fffdf8]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* LOGO */}
        <a
          href="#inicio"
          onClick={closeMenu}
          className="group flex items-center gap-2"
          aria-label="Recanto da Dinda - início"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-700 transition group-hover:rotate-[-8deg]">
            <PawPrint size={27} strokeWidth={2.5} />
          </span>

          <span className="leading-none">
            <span className="block text-lg font-black tracking-tight text-emerald-950">
              Recanto
            </span>
            <span className="mt-1 block text-sm font-extrabold italic text-emerald-800">
              da Dinda
            </span>
          </span>
        </a>

        {/* MENU DESKTOP */}
        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Navegação principal"
        >
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-semibold text-stone-600 transition hover:text-orange-600"
            >
              {label}
            </a>
          ))}

          <Link
            to="/cadastro-pet"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-400 px-6 py-3.5 text-sm font-extrabold text-emerald-950 transition hover:bg-orange-300"
          >
            <PawPrint size={18} />
            Cadastrar meu pet
            <ArrowUpRight size={16} />
          </Link>
        </nav>

        {/* WHATSAPP DESKTOP */}
        <a
          href={whatsappLink(
            "Olá! Gostaria de agendar uma visita ao Recanto da Dinda."
          )}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 sm:inline-flex"
        >
          <MessageCircle size={17} />
          Fale no WhatsApp
        </a>

        {/* BOTÃO MOBILE */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-stone-200 text-emerald-950 md:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <nav
          className="border-t border-stone-200 bg-[#fffdf8] px-4 py-4 md:hidden"
          aria-label="Navegação móvel"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 font-semibold text-stone-700 transition hover:bg-emerald-50"
              >
                {label}
              </a>
            ))}

            <Link
              to="/cadastro-pet"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-orange-400 px-5 py-3 font-extrabold text-emerald-950 transition hover:bg-orange-300"
            >
              <PawPrint size={18} />
              Cadastrar meu pet
              <ArrowUpRight size={16} />
            </Link>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
            >
              <MessageCircle size={18} />
              Fale no WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
