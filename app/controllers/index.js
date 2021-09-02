const ProdutosDao = require('../dao/ProdutosDao');
const connFactory = require('../conectionFactory');

module.exports = (app) => {
  app.get('/produtos', async (req, res) => {
    try {
      const conn = await connFactory();
      const produtosDao = new ProdutosDao(conn);

      const [rows] = await produtosDao.getAll();

      res.status(200).json(rows);

      conn.end();
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  //   app.get('/produtos/form', (req, res) => {
  //     res.render('produtos/form');
  //   });

  //   app.post('/produtos', (req, res) => {
  //     const connection = connectionFactory();
  //     const livro = req.body;
  //     const livrosDao = new ProdutosDao(connection);
  //     console.log(livro);

  //     livrosDao.save(livro, (err) => {
  //       if (err) {
  //         console.log(err);
  //       }

  //       res.redirect('/produtos');
  //     });
  //   });
};
