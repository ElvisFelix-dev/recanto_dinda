<div align="center">

# 🐾 Recanto da Dinda

### Um segundo lar para o seu melhor amigo.

Landing page responsiva para uma creche e hotel para cães, com identidade visual acolhedora, foco em conversão e contato facilitado com os tutores.

**React · Vite · Tailwind CSS · Lucide React**

</div>

---

## ✨ Sobre o projeto

O **Recanto da Dinda** é uma landing page demonstrativa desenvolvida para apresentar os serviços e diferenciais de uma creche e hotel para cães localizada em Santa Teresinha, São Paulo.

A interface foi pensada para transmitir carinho, confiança, liberdade e bem-estar, com navegação simples em dispositivos móveis e chamadas para ação que direcionam os visitantes ao WhatsApp.

> **Observação:** esta versão é uma demonstração visual. As fotografias são ilustrativas e devem ser substituídas por imagens reais autorizadas do estabelecimento antes da publicação.

## 🎯 Objetivos

- Apresentar a creche e seus serviços de forma profissional.
- Facilitar o contato e o agendamento de visitas pelo WhatsApp.
- Comunicar os diferenciais do espaço e sua proposta de cuidado.
- Oferecer uma experiência consistente em celulares, tablets e desktops.
- Criar uma base visual para futuras integrações, como formulário de cadastro e painel administrativo.

## 🧩 Funcionalidades

- **Navbar responsiva** com menu móvel expansível.
- **Hero section** com título, texto e chamadas para ação.
- **Seção “Quem somos”** para apresentar a proposta do Recanto.
- **Cards de serviços** para creche/day care, hotel para pets, recreação e diárias avulsas.
- **Diferenciais do espaço**, incluindo área verde, conceito livre, socialização e avaliação prévia.
- **Galeria de fotos** com controles de navegação.
- **Seção de contato** com endereço, telefone, horários e Instagram.
- **Links de WhatsApp** com mensagens pré-preenchidas.
- **Footer** com navegação e redes sociais.
- **SEO básico** e pacote de favicons para navegadores e dispositivos.
- **Acessibilidade básica**, com rótulos em controles e textos alternativos nas imagens.

## 🎨 Identidade visual

A interface utiliza uma paleta natural e acolhedora, combinando tons de verde com detalhes quentes.

| Cor | Hexadecimal | Uso |
|---|---|---|
| Verde profundo | `#103c2e` | Footer, identidade e áreas de destaque |
| Verde principal | `#047857` | Botões e ações principais |
| Creme | `#fffdf8` | Fundo geral |
| Laranja | `#f6a23a` | Destaques e detalhes |
| Verde claro | `#eef7ed` | Fundos de seções |

O layout utiliza cartões arredondados, espaços generosos, imagens amplas e tipografia com hierarquia visual clara.

## 🛠️ Tecnologias

- [React](https://react.dev/) — construção da interface.
- [Vite](https://vite.dev/) — servidor de desenvolvimento e build.
- [Tailwind CSS](https://tailwindcss.com/) — estilização responsiva.
- [Lucide React](https://lucide.dev/) — biblioteca de ícones.

## 🚀 Como executar localmente

### Pré-requisitos

- Node.js em uma versão LTS compatível com a versão do Vite instalada.
- npm.
- Git (opcional).

### 1. Instale as dependências

Na pasta do projeto, execute:

```bash
npm install
```

Instale também os ícones, caso ainda não estejam no `package.json`:

```bash
npm install lucide-react
```

### 2. Confira a configuração do Tailwind CSS

Este projeto pode utilizar Tailwind CSS v4 ou v3. Mantenha a configuração correspondente à versão instalada.

**Tailwind CSS v4:** o CSS global (`src/index.css`) normalmente começa com:

```css
@import "tailwindcss";
```

O `vite.config.js` deve incluir o plugin `@tailwindcss/vite`.

**Tailwind CSS v3:** o CSS global normalmente contém:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

A versão 3 também precisa da configuração de `content` no `tailwind.config.js`.

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Abra no navegador o endereço local apresentado pelo Vite, geralmente `http://localhost:5173`.

### 4. Gere a versão de produção

```bash
npm run build
```

Para testar localmente o build:

```bash
npm run preview
```

## 📁 Estrutura sugerida

```text
recanto-dinda/
├── public/
│   ├── favicon.svg
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── site.webmanifest
│   └── browserconfig.xml
├── src/
│   ├── components/
│   │   └── RecantoDinda.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── README.md
```

> A estrutura acima é uma sugestão de organização. Ajuste os caminhos para corresponder aos arquivos existentes no seu repositório.

## 🐶 Informações apresentadas na página

- **Endereço:** Rua Luís Antônio dos Santos, 522 — Santa Teresinha, São Paulo — SP, 02460-000.
- **Telefone / WhatsApp:** +55 (11) 92575-5222.
- **Instagram:** [@recanto_dadinda](https://www.instagram.com/recanto_dadinda/).
- **Segunda a sexta:** 7h às 19h.
- **Sábado:** 9h às 18h.
- **Domingo:** fechado.
- **Espaço informado:** cerca de 500 m² de área verde.
- **Público atendido:** cães de pequeno e médio porte, sujeitos a avaliação comportamental prévia.

Confirme todos os dados com a administração antes de publicar.

## 🔗 Integrações e links

Os botões de contato abrem conversas no WhatsApp com mensagens pré-preenchidas. O endereço abre uma pesquisa no Google Maps e o Instagram direciona para o perfil informado.

Antes da publicação, verifique se todos os links, horários e informações de contato estão corretos.

## 🔐 Antes de publicar em produção

- [ ] Substituir as imagens ilustrativas por fotos reais autorizadas.
- [ ] Confirmar endereço, telefone, horários e serviços com a administração.
- [ ] Configurar o domínio definitivo e HTTPS.
- [ ] Atualizar os metadados de SEO e a imagem de compartilhamento social.
- [ ] Conferir os favicons dentro da pasta `public/`.
- [ ] Testar o layout em celulares, tablets e desktops.
- [ ] Testar todos os links de WhatsApp, Instagram e Maps.
- [ ] Verificar contraste, navegação por teclado e textos alternativos.
- [ ] Executar `npm run build` e corrigir eventuais erros.
- [ ] Configurar métricas e política de privacidade caso sejam adicionadas ferramentas de análise ou formulários.

## 🗺️ Próximas evoluções possíveis

A landing page pode evoluir para uma plataforma integrada com:

1. Formulário de cadastro de tutores e pets.
2. Upload privado de fotos e documentos.
3. Painel administrativo protegido por autenticação.
4. Perfis e permissões para proprietária e equipe.
5. Controle de vacinação e documentos pendentes.
6. Agenda, frequência e histórico dos cães.

Essas funcionalidades **não fazem parte da landing page atual** e devem ser especificadas, orçadas e desenvolvidas separadamente.

## 📄 Licença e uso

Este projeto foi preparado como demonstração de uma landing page para o Recanto da Dinda. Defina a licença e os direitos de uso antes de distribuir ou reutilizar o código publicamente. Garanta também a autorização para uso do nome, da marca e das imagens do estabelecimento.

---

<div align="center">

**Recanto da Dinda**  
*Cuidado, diversão e bem-estar para o seu melhor amigo.* 🐾

</div>
