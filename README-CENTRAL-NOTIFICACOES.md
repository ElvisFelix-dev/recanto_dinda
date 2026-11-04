# Central de notificações — Recanto da Dinda

A central já existia no frontend; esta atualização conectou seus componentes ao layout e aos endpoints administrativos do backend.

## O que foi conectado

- Sino com contador de notificações não lidas no cabeçalho do painel.
- Dropdown com as últimas notificações e ação para marcar como lida.
- Página `/admin/notificacoes` com histórico, atualização e opção de marcar todas como lidas.
- Link de Notificações no menu lateral.
- Provider de notificações dentro do contexto de autenticação e Toast.
- Chamadas API:
  - `GET /api/admin/notifications`
  - `PATCH /api/admin/notifications/read-all`
  - `PATCH /api/admin/notifications/:id/read`
  - `GET /api/admin/notifications/push/public-key`
  - `POST /api/admin/notifications/push/subscribe`
  - `DELETE /api/admin/notifications/push/subscribe`
- Atualização em tempo real via Socket.IO, usando a URL base derivada de `VITE_API_URL`/URL de produção.

## Instalação

1. Faça backup da pasta `web`.
2. Extraia este ZIP e substitua os arquivos do frontend.
3. Na pasta `web`, execute `npm install` (ou `npm ci`) e `npm run build`.
4. Publique no Netlify.

## Observações

- O backend precisa estar com as rotas de notificações e Socket.IO ativos. O backend enviado para análise contém essas rotas.
- Push no navegador depende de HTTPS, suporte do navegador e chaves VAPID configuradas no Render.
- O sino e a página central funcionam independentemente da ativação de Web Push, desde que o backend e a autenticação estejam disponíveis.
