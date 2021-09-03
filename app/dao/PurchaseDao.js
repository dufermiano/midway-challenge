class PurchaseDao {
  constructor(connection) {
    this.connection = connection;
  }

  async getAll() {
    return await this.connection.query('SELECT * FROM PURCHASE');
  }

  async getById(invoiceId) {
    return await this.connection.query(
      'SELECT * FROM PURCHASE WHERE invoiceId = ?',
      invoiceId
    );
  }

  async save(purchase) {
    if (!purchase.id) {
      console.log('PURCHASE INSERT OPERATION');
      return await this.connection.query(
        'INSERT INTO PURCHASE SET ?',
        purchase
      );
    }

    console.log('PURCHASE UPDATE OPERATION');

    return await this.connection.query(
      'UPDATE PURCHASE SET ? WHERE invoiceId = ?',
      [purchase, purchase.invoiceId]
    );
  }
}

module.exports = PurchaseDao;
