
import * as AWS from 'aws-sdk';
import StockInterface from 'src/interfaces/Stock-interface';
import MOCK_PRODUCTS from 'src/utils/products';

const dynamo = new AWS.DynamoDB.DocumentClient();

export default class Stocks {

  static async scan(tableName: string): Promise<StockInterface[]> {
    return new Promise(resolve => {
      dynamo.scan({ TableName: tableName }, (error, data) => {
        if (error) {
          console.log(error);
          return resolve(null);
        }
        return resolve(data.Items as StockInterface[])
      })
    });
  }

  static async getStockList(): Promise<StockInterface[] | null> {
    return await this.scan(process.env.DB_TABLE_STOCKS);
  }

  static async getStockById(id: number): Promise<StockInterface> {
    return new Promise(resolve => {
      dynamo
        .query({
          TableName: process.env.DB_TABLE_STOCKS,
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: { ":id": id },
        }, (error, data) =>{
          if (error) {
            console.log(error);
            return resolve(null);
          }
          return resolve(data.Items[0] as StockInterface);
        })
    });
  }

  static async addStock(stock: StockInterface): Promise<StockInterface | null> {
    const params = { TransactItems: [{ Put: { TableName: process.env.DB_TABLE_STOCKS , Item: stock}}] };
    return new Promise(resolve => {
      dynamo.transactWrite(params, error => {
        if (error) {
          console.log(error);
          return resolve(null);
        }
        return resolve(stock as StockInterface);
      })
    });
  }

  static fillTable(): Promise<StockInterface[]> {
    return new Promise(resolve => {
      const products = MOCK_PRODUCTS.map(product => Stocks.addStock({ id: product.id, count: Math.floor(Math.random() * 10000) }));
      Promise
        .all(products)
        .then(data => {
          resolve(data);
        })
    });
  };
}