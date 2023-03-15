import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import Products from 'src/DataBase/Products';
import Stocks from 'src/DataBase/Stock';

const fillTable = async () => {
  const products = await Products.fillTable();
  const stocks = await Stocks.fillTable();
  return successResponse({ products, stocks });
};

export const main = middyfy(fillTable);
