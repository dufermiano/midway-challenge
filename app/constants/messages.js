const messages = {
  productCreated: 'Produto criado com sucesso.',
  productUpdated: 'Produto alterado com sucesso.',
  successPurchase: 'Compra realizada com sucesso.',
  productHasNoInventory: 'Desculpe. Esse produto está esgotado.',
};

const errorMessages = {
  internalError:
    'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.',
  serverError: 'An internal error occurred: ',
  productNotFound: 'Produto não encontrado',
};

module.exports = {
  messages,
  errorMessages,
};
