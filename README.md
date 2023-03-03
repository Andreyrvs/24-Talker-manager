# Talker Manager

## Contexto

Este projeto trata-se de uma aplicação de cadastro de talkers (palestrantes) em que será possível cadastrar, visualizar, pesquisar, editar e excluir informações.

Desafios:

  1. Desenvolver uma API de um CRUD (Create, Read, Update e Delete) de palestrantes (talkers);

  2. Desenvolver alguns endpoints que irão ler e escrever em um arquivo utilizando o módulo fs.

## Técnologias usadas

Back-end:
> Desenvolvido usando: NodeJS, ExpressJS, express-rescue, crypto-js

## Habilidades

Adquiri essas habilidades ao desenvolver esse projeto:

## Preview da Aplicação

| ![Login](./aplicacao-) | ![Home](./aplicacao-) |
| ----------- | ----------- |

## Instalando Dependências

- clone o projeto:

  ```bash
  git clone git@github.com:Andreyrvs/24-talker-manager.git
  ```

  > Back-end

  ```bash
  cd 24-talker-manager
  docker compose up -d
  docker exec -it talker_manager bash
  npm install
  ```

## Executando aplicação

- Para rodar o Back-end:

  ```bash
  npm start
  ```

  - Rodar com o nodemon:

    ```bash
    npm run dev
    ```
