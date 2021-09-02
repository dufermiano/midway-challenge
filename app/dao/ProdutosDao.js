class ProdutosDao {
  constructor(connection) {
    this.connection = connection;
  }

  async getAll() {
    try {
      return await this.connection.query('SELECT * FROM Produtos');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getById(id) {
    return await this.connection.query(
      'SELECT * FROM Produtos WHERE id = ?',
      id
    );
  }

  async save(produto) {
    return await this.connection.query('INSERT INTO Produtos SET ?', produto);
  }
}

module.exports = ProdutosDao;
