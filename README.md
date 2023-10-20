# desafio-autovist

## Como executar?

### Na própria máquina

Requisitos mínimos:

- Node.js v18.18.2
- NPM v9.8.1
- MongoDB v7.0.2

Instalação:

1. `npm install`

Configuração:

1. `cp .env.example .env`
2. Preencha o `.env` com os valores corretos

Inicialização:

- Modo de produção: `npm run build && npm start`
- Modo de desenvolvimento: `npm run dev`

### Via Docker

1. Tenha o Docker v24.0.6 instalado
2. `docker compose up`
