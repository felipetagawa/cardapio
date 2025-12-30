# Google Maps API - Guia de Configuração

Para habilitar o autocomplete de endereços, você precisa de uma API Key do Google Maps.

## Passo 1: Criar um Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Clique em "Selecionar um projeto" → "Novo Projeto"
4. Dê um nome (ex: "Japa Pastel") e clique em "Criar"

## Passo 2: Ativar a Places API

1. No menu lateral, vá em: **APIs e Serviços** → **Biblioteca**
2. Busque por: **"Places API (New)"**
3. Clique nela e depois em **"Ativar"**

## Passo 3: Criar uma API Key

1. No menu lateral, vá em: **APIs e Serviços** → **Credenciais**
2. Clique em **"+ Criar Credenciais"** → **"Chave de API"**
3. Copie a chave que apareceu (começa com `AIza...`)

## Passo 4: Adicionar a Chave no Projeto

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua `YOUR_API_KEY_HERE` pela sua chave real:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSy..."
```

3. Reinicie o servidor (`npm run dev`)

## Passo 5: (Opcional) Restringir a API Key

Para segurança em produção:

1. Volte em **Credenciais** → clique na sua chave
2. Em **"Restrições de aplicativo"**, selecione **"Referenciadores HTTP"**
3. Adicione seu domínio: `https://seusite.com/*`
4. Salve

## Custos

- Google oferece **$200 de crédito grátis por mês**
- Autocomplete custa ~$2.83 por 1000 requisições
- Para uso pequeno/médio, fica dentro do gratuito

## Testando

1. Abra: `http://localhost:3000/checkout`
2. No campo "Endereço", comece a digitar "Rua"
3. Você deve ver sugestões de ruas de José Bonifácio-SP

Se não funcionar, verifique:
- A chave está corretamente no `.env`?
- Você reiniciou o servidor depois de adicionar a chave?
- Há erros no console do navegador (F12)?
