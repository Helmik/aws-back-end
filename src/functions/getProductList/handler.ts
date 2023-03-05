import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProducts } from 'src/db/products';

import schema from './schema';

const getProductList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  console.log('getProductList was executed. No arguments.');
  const products = await getProducts();
  return successResponse(products);
};

export const main = middyfy(getProductList);
