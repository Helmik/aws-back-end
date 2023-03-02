import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from 'src/utils/products';

import schema from './schema';

const getProductList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  return successResponse(products);
};

export const main = middyfy(getProductList);
