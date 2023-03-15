
import * as AWS from 'aws-sdk';
import TequilaInterface from 'src/interfaces/Tequila.interface';
import MOCK_PRODUCTS from 'src/utils/products';
import Stocks from './Stock';

const dynamo = new AWS.DynamoDB.DocumentClient();

export default class Products {

  static async scan(tableName: string): Promise<TequilaInterface[]> {
    return new Promise(resolve => {
      dynamo.scan({ TableName: tableName }, (error, data) => {
        if (error) {
          console.log(error);
          return resolve(null);
        }
        return resolve(data.Items as TequilaInterface[])
      })
    });
  }

  static async getProductList(): Promise<TequilaInterface[] | null> {
    const stocks = await Stocks.getStockList();
    const products = await this.scan(process.env.DB_TABLE_PRODUCTS);
    if (products === null  || stocks === null) {
      return null;
    }
    products.forEach(product => {
      let stock = stocks.find(stock => stock.id === product.id);
      product.count = stock ? stock.count : 0;
    });
    return products;
  }

  static async getProductById(id: number): Promise<TequilaInterface> {
    return new Promise(resolve => {
      dynamo
        .query({
          TableName: process.env.DB_TABLE_PRODUCTS,
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: { ":id": id },
        }, async (error, data) =>{
          if (error) {
            console.log(error);
            return resolve(null);
          }
          const tequila = data.Items[0] as TequilaInterface;
          const stock = await Stocks.getStockById(tequila.id);
          tequila.count = stock.count;
          return resolve(tequila);
        })
    });
  }

  static async addProduct(product: TequilaInterface): Promise<TequilaInterface | null> {
    const _product = await this.prepareProduct(product);
    const params = { TransactItems: [{ Put: { TableName: process.env.DB_TABLE_PRODUCTS , Item: _product}}] };
    return new Promise(resolve => {
      dynamo.transactWrite(params, async (error) => {
        if (error) {
          console.log(error);
          return resolve(null);
        }
        await Stocks.addStock({ id: _product.id, count: _product.count});
        return resolve(_product as TequilaInterface);
      })
    });
  }

  static async prepareProduct(product: TequilaInterface): Promise<TequilaInterface> {
    let id = product.id;
    if (id === undefined) {
      const products = await this.getProductList();
      if (product === null) {
        return Promise.resolve(null);
      }
      id = products.length + 1;
    }

    return {
      id,
      title: product.title,
      description: product.description,
      price: product.price,
      img: product.img,
      count: product.count || 0
    }
  }

  static fillTable(): Promise<TequilaInterface[]> {
    return new Promise(resolve => {
      const products = MOCK_PRODUCTS.map(product => Products.addProduct(product));
      Promise
        .all(products)
        .then(data => {
          resolve(data);
        })
    });
  };
}