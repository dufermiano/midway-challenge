'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const produtctsController = require('../../../app/controllers/products');
const mockMysql = sinon.mock(require('mysql2/promise'));

describe('Unit tests for products controllers', () => {
  beforeEach(() => {
    mockMysql.expects('createConnection').returns({
      connect: () => {
        console.log('Succesfully connected');
      },
      query: (query, vars) => {
        return [
          [
            {
              name: 'Calça',
              value: 100.0,
              inventory: 10,
              size: 'GG',
              type: 'Jeans',
              description: 'Calça jeans masculina',
              dateOfRegistration: '2021-08-31 17:05:19',
              dateOfUpdate: '2021-09-03 17:05:19',
            },
          ],
        ];
      },
      end: () => {
        console.log('Connection ended');
      },
    });
  });

  after(() => {
    mockMysql.restore();
  });

  describe('get by id function', () => {
    it('Should execute query successfully and gets a product by its id', async () => {
      const mockResponse = () => {
        const res = {};
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns(res);
        return res;
      };
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const next = sinon.stub();

      await produtctsController.getProductsById(req, res, next);

      expect(res.status.called).true;
      expect(res.status.calledWith(200));
      expect(res.json.called).true;

      expect(
        res.json.calledWith({
          name: 'Calça',
          value: 100.0,
          inventory: 10,
          size: 'GG',
          type: 'Jeans',
          description: 'Calça jeans masculina',
          dateOfRegistration: '2021-08-31 17:05:19',
          dateOfUpdate: '2021-09-03 17:05:19',
        })
      );
    });
  });
});
