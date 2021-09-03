class ProductsDao {
  constructor(connection) {
    this.connection = connection;
  }

  async getAll() {
    return await this.connection.query('SELECT * FROM PRODUCTS');
  }

  async getDuplicates() {
    return await this.connection.query(
      'SELECT LOWER(name) as name, value, LOWER(size) as size, LOWER(type) as type, COUNT(name) as duplicates, SUM(inventory) as total_inventory FROM PRODUCTS GROUP BY name, value, size, type HAVING COUNT(name) > 1'
    );
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
