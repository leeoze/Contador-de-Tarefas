# Contador de Tarefas

Aplicação de gerenciamento de tarefas construída com Next.js 15, TypeScript e testes automatizados.

## Funcionalidades

- Listar tarefas carregadas do servidor
- Adicionar novas tarefas via formulário
- Marcar tarefas como concluídas ou pendentes
- Remover tarefas com confirmação via popup
- Contador em tempo real: total, pendentes e concluídas

## Tecnologias

- **Next.js 15** com App Router
- **TypeScript**
- **Jest** + **Testing Library** para testes

## Instalação
```bash
npm install
```

## Como usar
```bash
# Rodar em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).
```bash
# Rodar os testes
npm test

# Testes em modo watch
npm run test:watch

# Relatório de cobertura
npm run test:coverage
```
