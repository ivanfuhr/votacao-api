# API da Aplicação

Esta aplicação foi desenvolvida utilizando [Nest.js](https://nestjs.com/) em conjunto com [Prisma](https://www.prisma.io/), um ORM moderno para TypeScript e Node.js.

## Configuração Inicial

Antes de iniciar a aplicação, é necessário realizar algumas configurações essenciais:

### 1. Arquivo de Configuração `.env`

- Crie um arquivo `.env` na raiz do projeto.
- Use o arquivo `.env-example` como referência para definir as variáveis necessárias.

### 2. Banco de Dados PostgreSQL

- Certifique-se de ter uma instância do banco de dados PostgreSQL disponível.
- Configure as credenciais do banco de dados no arquivo `.env`.

### 3. Deploy das Migrations

Execute o seguinte comando para realizar o deploy das migrations no banco de dados:

```bash
pnpm prisma migrate deploy
```

## Executando a Aplicação

Após a configuração inicial, você pode iniciar a API com o seguinte comando:

```bash
pnpm start:dev
```

## Primeiro Acesso

Na primeira execução da aplicação, um usuário padrão com privilégios de admin será gerado automaticamente. Utilize este usuário para acessar e explorar as funcionalidades da aplicação.

## Geração automática de pautas

Este projeto conta com um módulo de criação automática de pautas, alimentado por IA.
Para ativar o módulo será necessário uma chave de API da OpenAI, que deve ser definida no variavel ambiente
OPENAI_API_KEY, e também definir como `true` a variavel AUTO_GENERATE_TOPICS
