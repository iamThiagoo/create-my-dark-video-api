# Create My Dark Video ~ Back-End

Serviço rest que processa requisições do projeto [Create My Dark Video](https://github.com/iamThiagoo/create-my-dark-video), um projeto que utiliza IA para gerar vídeos narrados com base em prompts fornecidos pelos usuários.

Projeto Demo: https://create-my-dark-video.vercel.app

## Tecnologias
- [NestJS](https://nestjs.com/)

## Integrações
- [OpenAI](https://openai.com/)
- [Replicate](https://replicate.com/)

## Setup

```bash
$ npm install

# development
$ npm run dev
```

## Variáveis de Ambiente

```bash
# App Config
NODE_ENV="development"
APP_URL="http://localhost:3000"
CACHE_TIME=86400
REQUESTS_LIMIT_CACHE=5
CSRF_SECRET=""

# API's keys
OPENAI_KEY=""
REPLICATE_KEY=""

# API's settings
OPENAI_MODEL="gpt-3.5-turbo"
REPLICATE_MODEL="black-forest-labs/flux-schnell"
```

## Licença
- [MIT](./LICENSE)
