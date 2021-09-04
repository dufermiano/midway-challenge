## Parte 1:

Em uma loja do grupo, devido a um erro humano, tivemos um problema de duplicação de cadastro de itens de estoque. Identificamos o problema e precisamos atualizar nossa base removendo as duplicações, para isto, gostaríamos que você desenvolvesse uma função que verificasse as duplicações e retornasse uma lista com os produtos atualizados, de acordo com os dados abaixo:

### Dados do produto:

    id
    nome
    valor
    estoque
    tamanho
    tipo
    descricao
    dataCadastro

### Dados da base atual:

    id: 1
    nome: Calça
    valor: 100
    estoque: 5
    tamanho: M
    tipo: Jeans
    descricao: Calça Jeans
    dataCadastro: 2021-06-20T20:32:36.931Z

    id: 3
    nome: Calça
    valor: 100
    estoque: 3
    tamanho: m
    tipo: Jeans
    descricao: Calça Jeans m
    dataCadastro: 2021-06-21T18:42:56.931Z

### Dados da base após a atualização:

    id: 1
    nome: Calça
    valor: 100
    estoque: 8
    tamanho: M
    tipo: Jeans
    descricao: Calça Jeans
    dataCadastro: 2021-06-20T20:32:36.931Z
    dataAtualizacao: 2021-06-21T18:42:56.931Z

Um produto é considerado duplicado quando ele tem o mesmo nome, mesmo valor, mesmo tamanho e mesmo tipo. Os campos que são texto não devem ser considerados diferentes caso haja distinção apenas de letras maiúsculas ou minúsculas.

## Parte 2

Gostaríamos que você criasse uma solução para realizar a manutenção do produto, para ser utilizada no momento de venda e da devolução dos mesmos, seguindo os critérios abaixo:

### Endpoint de Venda

Deve ser criado um endpoint onde possamos realizar a venda dos produtos assim como a geração da nota fiscal da mesma.

A NF deve ser armazenada na mesma base de dados utilizada para a persistência dos produtos.

#### Parâmetros de entrada:

    Data da venda
    Item vendido
    CPF do cliente

#### Parâmetros de saída:

- Dados do produto:
  - ID
  - Nome
  - Tamanho
  - Tipo
  - Descrição
- Dados da Nota Fiscal
  - ID do produto
  - CPF
  - ID da Nota Fiscal (pode ser um UUID)
  - Data da Venda

### Endpoint de devolução:

Deve ser realizado o cancelamento da NF assim como a atualização dos dados do produto corretamente.

#### Parâmetros de entrada:

- ID da NF
- ID do produto
- CPF do cliente

#### Parâmetros de saída:

- Parâmetro de sucesso da execução da devolução
