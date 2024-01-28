# Etapa 1: Construir a aplicação
FROM node:20.10-alpine as builder

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Instalar o pnpm
RUN npm install -g pnpm

# Copiar os arquivos do projeto
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar o restante dos arquivos do projeto
COPY . .

# Gerar o cliente Prisma
RUN pnpm prisma generate

# Construir o aplicativo
RUN pnpm run build

# Etapa 2: Executar a aplicação
FROM node:20.10-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Instalar o pnpm
RUN npm install -g pnpm

# Copiar artefatos de construção do estágio anterior
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/prisma ./prisma/
COPY --from=builder /usr/src/app/.env ./

# Expor a porta em que a aplicação estará ouvindo
EXPOSE 3000

# Executar a aplicação
CMD ["pnpm", "start:migrate:prod"]
