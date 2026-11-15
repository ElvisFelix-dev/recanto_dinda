# Recanto da Dinda — Frontend 2.0

## Novas rotas
- `/hotel`: formulário público de solicitação de hospedagem.
- `/hotel/solicitacao-enviada`: confirmação do envio.
- `/area-do-tutor`: login, primeiro acesso e painel do tutor.
- `/admin/hotel`: gerenciamento das solicitações do Hotel.
- `/admin/frequencia`: check-in, check-out e histórico.

## Configuração
Crie `.env` com `VITE_API_URL=http://localhost:3333/api` (ou URL da API em produção).
Não use os arquivos de ambiente do ZIP como fonte de credenciais de produção.

## Instalação
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Integração esperada com a API
Este frontend utiliza os endpoints descritos no README do Backend 2.0. O fluxo de primeiro acesso usa CPF, e-mail e senha cadastrados previamente no formulário da Creche ou do Hotel.
