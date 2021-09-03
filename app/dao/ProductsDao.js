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

  async getProductByInvoiceId(invoiceId) {
    return await this.connection.query(
      'SELECT PRO.inventory, PRO.id FROM PRODUCTS AS PRO INNER JOIN PURCHASE AS PUR ON PRO.id = PUR.productId WHERE PUR.invoiceId = ?',
      invoiceId
    );
  }

  async save(product) {
    if (!product.id) {
      console.log('PRODUCT INSERT OPERATION');
      return await this.connection.query('INSERT INTO PRODUCTS SET ?', product);
    }

    console.log('PRODUCT UPDATE OPERATION');

    return await this.connection.query('UPDATE PRODUCTS SET ? WHERE id = ?', [
      product,
      product.id,
    ]);
  }

  async delete() {
    return await this.connection.query(
      'DELETE p1 FROM PRODUCTS p1 INNER JOIN PRODUCTS p2 WHERE p1.id > p2.id AND p1.name = p2.name AND p1.value = p2.value AND p1.size = p2.size AND p1.type = p2.type'
    );
  }
}

module.exports = ProductsDao;
