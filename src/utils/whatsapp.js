const WHATSAPP = '5511925755222';

export const whatsappLink = (
  message = 'Olá! Gostaria de saber mais sobre o Recanto da Dinda.',
) => {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
};
