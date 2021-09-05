# Midway-Challenge

Desafio técnico Midway - Eduardo Fermiano (dufermiano43@gmail.com)

![node-lts](https://img.shields.io/badge/Node.js-43853D)

Projeto que visa resolver dois [problemas](./docs/Problema.md):

## Stack de Tecnologias

1. [NodeJs 14.17.6 LTS](https://nodejs.org/en/blog/release/v14.17.6/)
2. [Express JS](https://expressjs.com/pt-br/)
3. [Docker](https://www.docker.com/)
4. [Docker Compose](https://docs.docker.com)
5. [MySQL](https://www.mysql.com/)
6. [Swagger AutoGen](https://www.npmjs.com/package/swagger-autogen)

## Dependências

Tenha o [Docker](https://www.docker.com/) instalado na sua máquina

## Executar Aplicação

Você deve ter o Docker instalado na sua máquina, pois já vai subir a base de dados junto e rodar o seguinte comando:

```
docker-compose up
```

Para encerrá-la:

```
docker-compose down
```

Existe uma collection do [Postman](https://www.postman.com/) na pasta [./docs](./docs) onde você pode importá-la e realizar os testes.

## Rotas da aplicação

Na rota http://localhost:3000/docs, você pode encontrar a documentação do [Swagger](https://swagger.io/) com todas as rotas, suas entradas e saídas esperadas.
