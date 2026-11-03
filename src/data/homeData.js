import {
  PawPrint,
  Heart,
  Trees,
  House,
  UsersRound,
  ShieldCheck,
  Sun,
} from "lucide-react";

export const photos = {
  hero: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
  smallDog:
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=85",
  play: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85",
  rest: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=85",
  group:
    "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=900&q=85",
  grass:
    "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=1000&q=85",
  happy:
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=85",
};

export const services = [
  {
    title: "Creche (Day Care)",
    description:
      "Diversão, socialização e movimento para deixar o dia do seu cão mais feliz.",
    image: photos.play,
    icon: Sun,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Hotel para pets",
    description:
      "Um espaço acolhedor para seu melhor amigo enquanto você estiver fora.",
    image: photos.rest,
    icon: House,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Recreação",
    description:
      "Brincadeiras e atividades ao ar livre, respeitando o ritmo de cada cão.",
    image: photos.group,
    icon: PawPrint,
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Diárias avulsas",
    description:
      "Mais flexibilidade para os dias em que seu pet precisa de companhia.",
    image: photos.smallDog,
    icon: Heart,
    color: "bg-rose-100 text-rose-700",
  },
];

export const benefits = [
  {
    icon: Trees,
    title: "500 m² de área verde",
    description:
      "Árvores e espaço ao ar livre para explorar, correr e brincar.",
    color: "text-emerald-700 bg-emerald-50",
  },
  {
    icon: Heart,
    title: "Ambiente acolhedor",
    description:
      "Um espaço friendly, pensado para o conforto e o bem-estar dos cães.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: House,
    title: "Conceito livre",
    description:
      "Sem baías, gaiolas ou canis: mais liberdade para aproveitar o espaço.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: ShieldCheck,
    title: "Cuidado individual",
    description:
      "Cada cão tem seu jeito; o cuidado começa com atenção às suas necessidades.",
    color: "text-emerald-700 bg-emerald-50",
  },
  {
    icon: UsersRound,
    title: "Socialização",
    description: "Convivência acompanhada para estimular interações positivas.",
    color: "text-orange-50 bg-orange-50",
  },
  {
    icon: PawPrint,
    title: "Avaliação prévia",
    description:
      "A admissão considera o porte e a avaliação comportamental do cão.",
    color: "text-amber-600 bg-amber-50",
  },
];

export const gallery = [
  { image: photos.hero, alt: "Cão feliz ao ar livre" },
  { image: photos.group, alt: "Cães reunidos durante a recreação" },
  { image: photos.play, alt: "Cachorro aproveitando o dia" },
  { image: photos.smallDog, alt: "Cão de pequeno porte" },
  { image: photos.grass, alt: "Espaço verde para os pets" },
  { image: photos.happy, alt: "Cachorro em um momento de diversão" },
];

export const navItems = [
  ["Início", "#inicio"],
  ["Quem somos", "#quem-somos"],
  ["Serviços", "#servicos"],
  ["Fotos", "#fotos"],
  ["Dúvidas", "#duvidas"],
  ["Contato", "#contato"],
];

export const highlights = [
  { icon: House, title: "Conceito livre", sub: "Sem gaiolas ou canis" },
  { icon: Trees, title: "500 m²", sub: "de área verde" },
  { icon: Heart, title: "Ambiente friendly", sub: "Acolhedor e cuidadoso" },
  {
    icon: UsersRound,
    title: "Socialização",
    sub: "Brincadeiras acompanhadas",
  },
];

export const faqs = [
  {
    question: "Quais vacinas meu cão precisa ter?",
    answer:
      "Para o cadastro, solicitamos as vacinas Polivalente, Antirrábica, Giardia e Gripe Canina. A carteira de vacinação deve ser apresentada para conferência.",
  },
  {
    question: "Como funciona a entrada de um novo pet?",
    answer:
      "A admissão considera o porte e uma avaliação comportamental prévia. Entre em contato com a equipe para entender as orientações e combinar os próximos passos para o seu cão.",
  },
  {
    question: "O Recanto oferece hospedagem?",
    answer:
      "Sim. Além da creche (Day Care), o Recanto oferece serviço de hotel para pets. Consulte a equipe sobre disponibilidade, condições e orientações para o período desejado.",
  },
  {
    question: "Posso contratar uma diária avulsa?",
    answer:
      "Sim, há opção de diárias avulsas. Fale com a equipe para consultar disponibilidade e alinhar os detalhes da visita do seu pet.",
  },
  {
    question: "Quais são os horários de funcionamento?",
    answer:
      "O horário informado é de segunda a sexta, das 7h às 19h, e aos sábados, das 9h às 18h. Aos domingos, o Recanto permanece fechado.",
  },
  {
    question: "Onde fica o Recanto da Dinda?",
    answer:
      "Estamos na Rua Luís Antônio dos Santos, 522, em Santa Teresinha, São Paulo – SP. Se precisar de ajuda para chegar, fale com a equipe pelo WhatsApp.",
  },
  {
    question: "Como posso conhecer o espaço e tirar outras dúvidas?",
    answer:
      "Você pode entrar em contato pelo WhatsApp para conversar com a equipe e combinar como conhecer o Recanto.",
  },
];

export const testimonials = [];
// Adicione somente depoimentos reais, autorizados pelos tutores.
// Formato: { guardian: "Nome do tutor", pet: "Nome do pet", text: "Relato autorizado", rating: 5 }
