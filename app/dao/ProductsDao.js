class ProductsDao {
  constructor(connection) {
    this.connection = connection;
  }

  async getAll() {
    try {
      return await this.connection.query('SELECT * FROM PRODUCTS');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getById(id) {
    return await this.connection.query(
      'SELECT * FROM PRODUCTS WHERE id = ?',
      id
    );
  }

  async save(product, id) {
    if (!id) {
      console.log('INSERT OPERATION');
      return await this.connection.query('INSERT INTO PRODUCTS SET ?', product);
    }

    console.log('UPDATE OPERATION');

    return await this.connection.query('UPDATE PRODUCTS SET ? WHERE id = ?', [
      product,
      id,
    ]);
  }
}

module.exports = ProductsDao;
