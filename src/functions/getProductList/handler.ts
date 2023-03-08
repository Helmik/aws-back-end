import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProducts, ProductClass } from 'src/db/products';

import schema from './schema';

const getProductList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const products = new ProductClass();
  const reults = await products.getProductList();
  return successResponse(reults);
};

export const main = middyfy(getProductList);
