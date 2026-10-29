import { useState } from "react";
import {
  Menu,
  X,
  PawPrint,
  Heart,
  Trees,
  House,
  UsersRound,
  ShieldCheck,
  MapPin,
  Clock3,
  Instagram,
  MessageCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sun,
  Dog,
  CalendarDays,
  Leaf,
} from "lucide-react";

const WHATSAPP = "5511925755222";
const whatsappLink = (message = "Olá! Gostaria de saber mais sobre o Recanto da Dinda.") =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

const photos = {
  hero: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
  smallDog: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=85",
  play: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85",
  rest: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=85",
  group: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=900&q=85",
  grass: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=1000&q=85",
  happy: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=85",
};

const services = [
  {
    title: "Creche (Day Care)",
    description: "Diversão, socialização e movimento para deixar o dia do seu cão mais feliz.",
    image: photos.play,
    icon: Sun,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Hotel para pets",
    description: "Um espaço acolhedor para seu melhor amigo enquanto você estiver fora.",
    image: photos.rest,
    icon: House,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Recreação",
    description: "Brincadeiras e atividades ao ar livre, respeitando o ritmo de cada cão.",
    image: photos.group,
    icon: PawPrint,
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Diárias avulsas",
    description: "Mais flexibilidade para os dias em que seu pet precisa de companhia.",
    image: photos.smallDog,
    icon: Heart,
    color: "bg-rose-100 text-rose-700",
  },
];

const benefits = [
  {
    icon: Trees,
    title: "500 m² de área verde",
    description: "Árvores e espaço ao ar livre para explorar, correr e brincar.",
    color: "text-emerald-700 bg-emerald-50",
  },
  {
    icon: Heart,
    title: "Ambiente acolhedor",
    description: "Um espaço friendly, pensado para o conforto e o bem-estar dos cães.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: House,
    title: "Conceito livre",
    description: "Sem baías, gaiolas ou canis: mais liberdade para aproveitar o espaço.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: ShieldCheck,
    title: "Cuidado individual",
    description: "Cada cão tem seu jeito; o cuidado começa com atenção às suas necessidades.",
    color: "text-emerald-700 bg-emerald-50",
  },
  {
    icon: UsersRound,
    title: "Socialização",
    description: "Convivência acompanhada para estimular interações positivas.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: PawPrint,
    title: "Avaliação prévia",
    description: "A admissão considera o porte e a avaliação comportamental do cão.",
    color: "text-amber-600 bg-amber-50",
  },
];

const gallery = [
  { image: photos.hero, alt: "Cão feliz ao ar livre" },
  { image: photos.group, alt: "Cães reunidos durante a recreação" },
  { image: photos.play, alt: "Cachorro aproveitando o dia" },
  { image: photos.smallDog, alt: "Cão de pequeno porte" },
  { image: photos.grass, alt: "Espaço verde para os pets" },
  { image: photos.happy, alt: "Cachorro em um momento de diversão" },
];

function SectionHeading({ eyebrow, title, description, light = false }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className={`mb-3 text-xs font-extrabold uppercase tracking-[0.28em] ${light ? "text-emerald-200" : "text-emerald-800"}`}>
        {eyebrow}
      </p>
      <h2 className={`text-3xl font-black leading-tight tracking-tight sm:text-4xl ${light ? "text-white" : "text-emerald-950"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mx-auto mt-4 max-w-xl text-sm leading-7 sm:text-base ${light ? "text-white/75" : "text-stone-600"}`}>
          {description}
        </p>
      )}
      <span className="mx-auto mt-5 block h-1 w-14 rounded-full bg-orange-400" />
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const closeMenu = () => setMenuOpen(false);
  const moveGallery = (direction) => {
    setGalleryIndex((current) => (current + direction + gallery.length) % gallery.length);
  };

  const navItems = [
    ["Início", "#inicio"],
    ["Quem somos", "#quem-somos"],
    ["Serviços", "#servicos"],
    ["Fotos", "#fotos"],
    ["Contato", "#contato"],
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdf8] font-sans text-stone-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-emerald-950/5 bg-[#fffdf8]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#inicio" onClick={closeMenu} className="group flex items-center gap-2" aria-label="Recanto da Dinda - início">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-700 transition group-hover:rotate-[-8deg]">
              <PawPrint size={27} strokeWidth={2.5} />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-black tracking-tight text-emerald-950">Recanto</span>
              <span className="mt-1 block text-sm font-extrabold italic text-emerald-800">da Dinda</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="text-sm font-semibold text-stone-600 transition hover:text-orange-600">
                {label}
              </a>
            ))}
          </nav>

          <a
            href={whatsappLink("Olá! Gostaria de agendar uma visita ao Recanto da Dinda.")}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 sm:inline-flex"
          >
            <MessageCircle size={17} /> Fale no WhatsApp
          </a>

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

        {menuOpen && (
          <nav className="border-t border-stone-200 bg-[#fffdf8] px-4 py-4 md:hidden" aria-label="Navegação móvel">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map(([label, href]) => (
                <a key={href} href={href} onClick={closeMenu} className="rounded-xl px-3 py-3 font-semibold text-stone-700 hover:bg-emerald-50">
                  {label}
                </a>
              ))}
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-bold text-white">
                <MessageCircle size={18} /> Fale no WhatsApp
              </a>
            </div>
          </nav>
        )}
      </header>

      <main>
        {/* HERO */}
        <section id="inicio" className="relative isolate scroll-mt-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-100 via-[#fffdf8] to-emerald-50" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-8 lg:py-20">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-800 shadow-sm">
                <PawPrint size={15} /> Creche e hotel para cães
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
                Um segundo lar para o seu <span className="relative inline-block text-emerald-700">melhor amigo<span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-orange-300/70" /></span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
                No Recanto da Dinda, seu cão encontra espaço para brincar, liberdade para explorar e carinho em um ambiente acolhedor, com muito verde e cuidado.
              </p>
              <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
                <a href={whatsappLink("Olá! Gostaria de agendar uma visita ao Recanto da Dinda.")} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800">
                  <MessageCircle size={18} /> Agendar uma visita <ArrowUpRight size={16} />
                </a>
                <a href={whatsappLink("Olá! Gostaria de saber como funciona o cadastro e a avaliação para meu cão.")} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-800/25 bg-white/70 px-6 py-3.5 text-sm font-extrabold text-emerald-900 transition hover:border-emerald-700 hover:bg-emerald-50">
                  <CalendarDays size={18} /> Quero saber mais
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-stone-600">
                <span className="inline-flex items-center gap-2"><Trees size={17} className="text-emerald-700" /> Cerca de 500 m² de área verde</span>
                <span className="inline-flex items-center gap-2"><Heart size={17} className="text-orange-500" /> Cuidado com carinho</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl">
              <div className="absolute -right-3 -top-4 h-28 w-28 rounded-full bg-orange-200/70 blur-2xl sm:-right-5 sm:h-40 sm:w-40" />
              <div className="absolute -bottom-5 -left-4 h-32 w-32 rounded-full bg-emerald-200/80 blur-2xl sm:-left-8 sm:h-44 sm:w-44" />
              <div className="relative overflow-hidden rounded-[2rem] rounded-bl-[5rem] border-[7px] border-white shadow-2xl shadow-emerald-950/10 sm:rounded-[2.5rem] sm:rounded-bl-[7rem]">
                <img src={photos.hero} alt="Cachorro feliz em um ambiente ao ar livre" className="h-[340px] w-full object-cover sm:h-[460px] lg:h-[520px]" fetchPriority="high" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/25 to-transparent p-6 pt-20 sm:p-8 sm:pt-24">
                  <p className="max-w-sm text-2xl font-black leading-tight text-white sm:text-3xl">Aqui, cada cão é recebido como parte da família.</p>
                  <p className="mt-2 text-sm font-medium text-white/85">Liberdade, natureza e cuidado todos os dias.</p>
                </div>
              </div>
              <div className="absolute -left-2 top-7 hidden items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-xl sm:flex">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800"><Leaf size={21} /></span>
                <span><strong className="block text-sm text-emerald-950">Mais espaço</strong><span className="text-xs text-stone-500">para ser cachorro</span></span>
              </div>
              <div className="absolute -bottom-5 right-4 flex items-center gap-2 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl sm:right-8">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-700"><Heart size={21} /></span>
                <span><strong className="block text-sm text-emerald-950">Muito carinho</strong><span className="text-xs text-stone-500">em cada momento</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK HIGHLIGHTS */}
        <section className="border-y border-emerald-950/5 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-7 sm:px-6 md:grid-cols-4 md:gap-8 lg:px-8 lg:py-9">
            {[
              { icon: House, title: "Conceito livre", sub: "Sem gaiolas ou canis" },
              { icon: Trees, title: "500 m²", sub: "de área verde" },
              { icon: Heart, title: "Ambiente friendly", sub: "Acolhedor e cuidadoso" },
              { icon: UsersRound, title: "Socialização", sub: "Brincadeiras acompanhadas" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 sm:justify-center sm:gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800"><Icon size={23} /></span>
                <div><p className="font-extrabold text-emerald-950">{title}</p><p className="mt-0.5 text-xs text-stone-500 sm:text-sm">{sub}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="quem-somos" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -left-3 -top-3 h-24 w-24 rounded-full border-2 border-dashed border-orange-300 sm:-left-5 sm:-top-5 sm:h-32 sm:w-32" />
              <img src={photos.smallDog} alt="Cão de pequeno porte aproveitando o espaço verde" loading="lazy" className="relative h-[320px] w-full rounded-[2rem] rounded-tr-[5rem] object-cover shadow-xl sm:h-[430px] sm:rounded-[2.5rem] sm:rounded-tr-[7rem]" />
              <div className="absolute -bottom-5 right-3 rounded-2xl border border-white bg-white p-4 shadow-xl sm:right-7 sm:p-5">
                <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-orange-700"><PawPrint size={23} /></span><span><strong className="block text-lg font-black text-emerald-950">Um lugar especial</strong><span className="text-xs text-stone-500">para seu melhor amigo</span></span></div>
              </div>
            </div>
            <div className="pt-5 lg:pt-0">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-emerald-800">Quem somos</p>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-emerald-950 sm:text-4xl">Mais que uma creche, um recanto para o seu pet.</h2>
              <span className="mt-5 block h-1 w-14 rounded-full bg-orange-400" />
              <p className="mt-6 text-base leading-8 text-stone-600">
                O Recanto da Dinda é um espaço dedicado ao bem-estar de cães de pequeno e médio porte, com uma proposta de convivência, liberdade e carinho.
              </p>
              <p className="mt-4 text-base leading-8 text-stone-600">
                Com cerca de 500 m² de área verde, árvores e espaço ao ar livre, queremos proporcionar momentos de brincadeira, socialização e descanso em um ambiente acolhedor, sem baías, gaiolas ou canis.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {["Ambiente acolhedor", "Área ao ar livre", "Cuidado com carinho"].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900"><PawPrint size={14} /> {tag}</span>
                ))}
              </div>
              <a href={whatsappLink("Olá! Gostaria de conhecer o Recanto da Dinda e saber sobre a avaliação para admissão.")} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-extrabold text-emerald-800 transition hover:text-orange-600">
                Conheça nosso espaço <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="servicos" className="scroll-mt-24 bg-[#eef7ed] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Nossos serviços" title="Tudo para seu cão aproveitar o dia" description="Opções para brincar, socializar e ficar bem cuidado, de acordo com a rotina da sua família." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(({ title, description, image, icon: Icon, color }) => (
                <article key={title} className="group overflow-hidden rounded-[1.5rem] border border-emerald-950/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10">
                  <div className="relative overflow-hidden">
                    <img src={image} alt={title} loading="lazy" className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44 lg:h-40" />
                    <span className={`absolute bottom-3 left-4 grid h-11 w-11 place-items-center rounded-2xl shadow-md ${color}`}><Icon size={21} /></span>
                  </div>
                  <div className="p-5 pt-6">
                    <h3 className="text-lg font-extrabold text-emerald-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
                    <a href={whatsappLink(`Olá! Gostaria de informações sobre ${title.toLowerCase()} no Recanto da Dinda.`)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-emerald-800 hover:text-orange-600">
                      Saiba mais <ArrowUpRight size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DIFFERENTIALS */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Nossos diferenciais" title="Um espaço pensado para o bem-estar dos cães" description="Liberdade para explorar, convivência acompanhada e atenção às necessidades de cada pet." />
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.85fr_1fr] lg:gap-7">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {benefits.slice(0, 3).map(({ icon: Icon, title, description, color }) => (
                  <div key={title} className="flex gap-4">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${color}`}><Icon size={23} /></span>
                    <div><h3 className="font-extrabold text-emerald-950">{title}</h3><p className="mt-1 text-sm leading-6 text-stone-600">{description}</p></div>
                  </div>
                ))}
              </div>
              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute inset-5 rounded-full bg-orange-100 blur-2xl" />
                <img src={photos.grass} alt="Área externa verde para os cães" loading="lazy" className="relative h-[300px] w-full rounded-[3rem] object-cover shadow-lg sm:h-[380px]" />
                <span className="absolute -bottom-4 -left-3 grid h-16 w-16 place-items-center rounded-2xl border-4 border-white bg-orange-400 text-white shadow-lg"><PawPrint size={30} /></span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {benefits.slice(3).map(({ icon: Icon, title, description, color }) => (
                  <div key={title} className="flex gap-4">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${color}`}><Icon size={23} /></span>
                    <div><h3 className="font-extrabold text-emerald-950">{title}</h3><p className="mt-1 text-sm leading-6 text-stone-600">{description}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mx-auto mt-10 max-w-3xl rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-center text-sm leading-6 text-stone-700">
              <strong className="text-emerald-950">Admissão responsável:</strong> atendimento para cães de pequeno e médio porte, sujeito a avaliação comportamental prévia.
            </p>
          </div>
        </section>

        {/* GALLERY */}
        <section id="fotos" className="scroll-mt-24 bg-[#eef7ed] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Alguns momentos por aqui" title="Cães felizes, momentos especiais" description="Um gostinho do ambiente de brincadeiras, natureza e convivência." />
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {gallery.map((photo, index) => (
                  <button key={photo.image} type="button" onClick={() => setGalleryIndex(index)} className={`group relative overflow-hidden rounded-2xl text-left ${galleryIndex === index ? "ring-4 ring-emerald-600 ring-offset-2 ring-offset-[#eef7ed]" : ""}`} aria-label={`Selecionar foto: ${photo.alt}`}>
                    <img src={photo.image} alt={photo.alt} loading="lazy" className="h-36 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-40 lg:h-48" />
                    <span className="absolute inset-0 bg-emerald-950/0 transition group-hover:bg-emerald-950/15" />
                  </button>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-center gap-4">
                <button type="button" onClick={() => moveGallery(-1)} aria-label="Foto anterior" className="grid h-11 w-11 place-items-center rounded-full border border-emerald-900/15 bg-white text-emerald-900 transition hover:bg-emerald-700 hover:text-white"><ChevronLeft size={21} /></button>
                <span className="text-sm font-semibold text-stone-500">Foto {galleryIndex + 1} de {gallery.length}</span>
                <button type="button" onClick={() => moveGallery(1)} aria-label="Próxima foto" className="grid h-11 w-11 place-items-center rounded-full border border-emerald-900/15 bg-white text-emerald-900 transition hover:bg-emerald-700 hover:text-white"><ChevronRight size={21} /></button>
              </div>
            </div>
            <p className="mt-5 text-center text-xs text-stone-500">Imagens ilustrativas nesta demonstração. Substitua por fotos autorizadas do espaço e dos cães atendidos.</p>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contato" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Informações de contato" title="Venha conhecer o Recanto da Dinda" description="Fale com a gente para tirar dúvidas, conhecer o espaço e saber como funciona a avaliação para admissão." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-700"><MapPin size={22} /></span>
                <h3 className="mt-4 font-extrabold text-emerald-950">Endereço</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">Rua Luís Antônio dos Santos, 522<br />Santa Teresinha, São Paulo – SP<br />CEP 02460-000</p>
                <a href="https://www.google.com/maps/search/?api=1&query=Rua+Lu%C3%ADs+Ant%C3%B4nio+dos+Santos+522+Santa+Teresinha+S%C3%A3o+Paulo" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:text-orange-600">Ver no mapa <ArrowUpRight size={14} /></a>
              </div>
              <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><MessageCircle size={22} /></span>
                <h3 className="mt-4 font-extrabold text-emerald-950">Telefone / WhatsApp</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">+55 (11) 92575-5222</p>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"><MessageCircle size={16} /> Chamar no WhatsApp</a>
              </div>
              <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-700"><Clock3 size={22} /></span>
                <h3 className="mt-4 font-extrabold text-emerald-950">Horários</h3>
                <div className="mt-2 space-y-1.5 text-sm text-stone-600">
                  <p className="flex justify-between gap-2"><span>Seg. a sex.</span><strong className="text-stone-800">7h–19h</strong></p>
                  <p className="flex justify-between gap-2"><span>Sábado</span><strong className="text-stone-800">9h–18h</strong></p>
                  <p className="flex justify-between gap-2"><span>Domingo</span><strong className="text-stone-800">Fechado</strong></p>
                </div>
              </div>
              <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-100 text-pink-700"><Instagram size={22} /></span>
                <h3 className="mt-4 font-extrabold text-emerald-950">Instagram</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">@recanto_dadinda</p>
                <a href="https://www.instagram.com/recanto_dadinda/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:text-orange-600">Acompanhar <ArrowUpRight size={14} /></a>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-900 px-6 py-10 text-center sm:px-12 sm:py-14">
            <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-emerald-700/70 blur-2xl" />
            <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-orange-400/20 blur-2xl" />
            <div className="relative mx-auto max-w-2xl">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-orange-300"><Dog size={29} /></span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">Seu melhor amigo merece esse recanto.</h2>
              <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">Entre em contato e descubra como proporcionar dias com mais brincadeiras, natureza e carinho para o seu cão.</p>
              <a href={whatsappLink("Olá! Quero conhecer o Recanto da Dinda e agendar uma visita.")} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-400 px-7 py-3.5 font-extrabold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-orange-300">
                <MessageCircle size={18} /> Vamos conversar
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#103c2e] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Recanto da Dinda - voltar ao início">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-orange-300"><PawPrint size={28} /></span>
            <span><strong className="block text-lg font-black">Recanto da Dinda</strong><span className="mt-1 block text-xs text-white/65">Cuidado, diversão e bem-estar.</span></span>
          </a>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white/75" aria-label="Links do rodapé">
            {navItems.map(([label, href]) => <a key={href} href={href} className="transition hover:text-orange-300">{label}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/recanto_dadinda/" target="_blank" rel="noreferrer" aria-label="Instagram do Recanto da Dinda" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"><Instagram size={20} /></a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp do Recanto da Dinda" className="grid h-11 w-11 place-items-center rounded-full bg-emerald-700 transition hover:bg-emerald-600"><MessageCircle size={20} /></a>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/55">
          © {new Date().getFullYear()} Recanto da Dinda. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
