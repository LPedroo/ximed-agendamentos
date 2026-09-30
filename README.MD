# Ximed Atendimento — Agendamento de Exames

Aplicação para controle e criação de agendamentos de exames de pacientes em clínicas.

- **back-end/** — API REST (Node.js, Express 5, Prisma 7, PostgreSQL, JWT em cookie httpOnly)
- **front-end/** — Next.js
- **shared/** — schemas (zod) e tipos de erro compartilhados entre API e front

## Como iniciar o projeto

### Requisitos
- Node.js 20+ e npm
- Docker (para subir o PostgreSQL local) — ou qualquer PostgreSQL acessível

### 1. Instalar dependências
Na raiz do repositório (npm workspaces instala tudo):

```bash
npm install
```

### 2. Subir o banco
```bash
cp .env.example .env          # preencha POSTGRES_USER, POSTGRES_PASSWORD e POSTGRES_DB
docker compose up -d
```

### 3. Configurar a API
```bash
cp back-end/.env.example back-end/.env
```
Edite `back-end/.env`:

| Variável       | Descrição |
|----------------|-----------|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@localhost:5432/DB?schema=public` (mesmos valores do passo 2) |
| `JWT_SECRET`   | Qualquer string longa e aleatória |
| `PORT`         | Porta da API (padrão `3333`) |
| `TRUST_PROXY`  | Opcional. Nº de proxies à frente da API (ex.: `1`). Necessário em produção atrás de proxy |
| `SEED_PASSWORD`| Opcional. Senha dos usuários do seed (padrão `Ximed@123`) |

### 4. Criar as tabelas e popular o banco (seed)
```bash
npm run db:generate -w back-end   # gera o Prisma Client
npm run db:migrate  -w back-end   # aplica as migrations
npm run db:seed     -w back-end   # popula o banco
```

O seed é **idempotente** (pode rodar várias vezes) e cria:
- 12 tipos de exame (ocupacionais e complementares)
- 4 usuários de demonstração (tabela abaixo)
- 3 salas
- 3 agendamentos de exemplo (somente se ainda não houver nenhum)

### 5. Rodar
```bash
npm run dev -w back-end     # API em http://localhost:3333
```
```bash
cp front-end/.env.example front-end/.env
npm run dev -w front-end    # Front em http://localhost:3000
```

O front encaminha `/api/*` para a API (`API_URL` no `front-end/.env`), então tudo passa pelo mesmo domínio.

## Usuários de demonstração

Senha de todos: `Ximed@123` (ou o valor de `SEED_PASSWORD`).

| Perfil   | E-mail                | O que pode fazer |
|----------|-----------------------|------------------|
| ADMIN    | admin@ximed.com       | Tudo |
| OPERATOR | operador@ximed.com    | Salas, tipos de exame e agendamentos (criar/editar/cancelar/excluir), registrar exames, listar usuários |
| DOCTOR   | medico@ximed.com      | Registrar exames, listar usuários, consultar agendamentos e exames |
| PATIENT  | paciente@ximed.com    | Consultar apenas os próprios agendamentos e exames |

## Permissões por rota

| Recurso              | Escrita               | Leitura |
|----------------------|-----------------------|---------|
| `/users`             | `POST`/`PATCH`/`disable`/`enable`: ADMIN | listar e `GET /:id`: ADMIN, OPERATOR, DOCTOR |
| `/rooms`, `/exam-types` | ADMIN, OPERATOR    | qualquer usuário autenticado |
| `/appointments`      | ADMIN, OPERATOR (criar, editar, cancelar, excluir) | autenticado (PATIENT vê só os seus) |
| `/medical-examinations` | ADMIN, DOCTOR, OPERATOR | autenticado (PATIENT vê só os seus) |
| `/me`                | —                     | dados do usuário logado |

## API

Base: `/api`. Autenticação por cookie `token` (httpOnly), obtido em `POST /api/auth/login`.

- `POST /auth/login`, `POST /auth/logout`, `GET /me`
- `/users`, `/rooms`, `/exam-types`, `/appointments`, `/medical-examinations` — CRUD
- `PATCH /appointments/:id` altera dados do agendamento (inclusive a data); `PATCH /appointments/:id/cancel` cancela; `DELETE /appointments/:id` exclui

Erros seguem o formato `{ "status", "error", "message" }`. Erros de validação (`400`, `VALIDATION_ERROR`) incluem `issues: [{ path, message }]`.
Há rate limit: 100 req/min por IP em toda a API e 10 tentativas de login a cada 15 min por IP (`429`).
