# 🚀 Configuração do Projeto

## 📋 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# API Configuration
API_URL=http://localhost:8080

# Database (if needed)
DATABASE_URL=your_database_url_here

# Authentication (if needed)
JWT_SECRET=your_jwt_secret_here
```

## 🌐 Configuração da API

Certifique-se de que a API backend está rodando na porta 8080 ou ajuste a URL no `.env.local`.

**Importante**: A API deve estar disponível para que os planos de assinatura sejam carregados corretamente.

## 🚀 Executando o Projeto

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

## 🔍 Troubleshooting

### Erro 500 da API
Se a API não estiver disponível, os planos de assinatura não serão carregados. Verifique se:
- A API está rodando na porta correta
- A URL da API está configurada corretamente no `.env.local`
- Não há problemas de CORS ou rede

### Erro de JSON
Se houver erro de JSON, verifique se a API está respondendo corretamente e retornando dados válidos.

### Planos não carregam
Se os planos de assinatura não aparecerem, verifique se:
- A API está funcionando
- O endpoint `/subscription-plans` está retornando dados
- Não há erros de autenticação

### Pagamentos não funcionam
Se os pagamentos não funcionarem, verifique se:
- A API está processando os pagamentos corretamente
- Os endpoints de pagamento estão funcionando
- Não há erros de autenticação ou autorização
