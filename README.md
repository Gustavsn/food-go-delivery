# FoodGo — Aplicativo fictício de delivery

Projeto acadêmico feito com React + Vite, React Router e Fetch API.

## Como executar

1. Instale o Node.js (versão LTS): https://nodejs.org/
2. Extraia o ZIP.
3. Abra a pasta `foodgo-react` no VS Code.
4. Abra o terminal do VS Code (Terminal > Novo Terminal).
5. Execute:

```bash
npm install
npm run dev
```

6. Abra no navegador o endereço indicado pelo Vite (normalmente http://localhost:5173).

## Rotas da aplicação e da API

| Tela | Endpoint consumido |
|---|---|
| Início | `/foods`, `/restaurants`, `/users/1` |
| Perfil | `/users` e `/users/1` |
| Restaurantes | `/restaurants` |
| Detalhe do restaurante | `/restaurants/:id` |
| Comidas | `/foods` |
| Detalhe da comida | `/foods/:id` |

A URL base da API está em `src/api.js`.

## Observação sobre os dados

A aplicação tenta consultar a API original em tempo real. Se ela falhar, demorar mais de 6 segundos ou retornar uma lista vazia, o sistema usa automaticamente dados locais fictícios para manter todas as telas funcionando. Os dados locais são demonstrativos e não são enviados ao servidor. No console do navegador aparece um aviso quando o modo de demonstração é usado. Os campos recebidos da API são tratados de forma flexível (por exemplo `name`/`title`, `image`/`imageUrl`, `price`/`preco`).

## Protótipo no Figma

Para cumprir a etapa de prototipação, crie um arquivo Figma chamado **FoodGo — Protótipo** e reproduza estas quatro telas usando o navegador em largura mobile (390 × 844):
- Início: banner, comidas recomendadas, restaurantes recomendados e menu inferior.
- Restaurantes: campo de busca e grade de estabelecimentos.
- Comidas: campo de busca e grade de pratos.
- Detalhes: foto, nome, descrição, preço/informações e botão principal.

As telas do React podem servir como referência visual para montar o Figma. Use laranja `#F47721`, preto `#252525`, fundo branco e cinza claro `#F6F6F6`.

## Build de produção

```bash
npm run build
```
