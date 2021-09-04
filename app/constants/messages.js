const messages = {
  productCreated: 'Produto criado com sucesso.',
  productUpdated: 'Produto alterado com sucesso.',
  successPurchase: 'Compra realizada com sucesso.',
  productHasNoInventory: 'Desculpe. Esse produto está esgotado.',
  productNotFound: 'Produto não encontrado.',
  noDuplicates: 'Não existem duplicações na base',
  successDevolution: 'Devolução realizada com sucesso.',
};

const errorMessages = {
  internalError:
    'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.',
  serverError: 'An internal error occurred: ',
  productNotFound: 'Produto não encontrado.',
  invoiceNotFound: 'Nota fiscal já cancelada ou inexistente.',
};

module.exports = {
  messages,
  errorMessages,
};
