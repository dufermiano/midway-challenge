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

  async save(produto, id) {
    if (!id) {
      console.log('INSERT OPERATION');
      return await this.connection.query('INSERT INTO Produtos SET ?', produto);
    }

    console.log('UPDATE OPERATION');

    return await this.connection.query('UPDATE Produtos SET ? WHERE id = ?', [
      produto,
      id,
    ]);
  }
}

module.exports = ProdutosDao;
