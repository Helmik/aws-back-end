import { errorResponse } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductById as gpById } from '../../db/products';

const getProductById = async (event) => {
  const { productId } = JSON.parse(JSON.stringify(event.queryStringParameters));
  const id = Number(productId);
  console.log('getProductById was executed with arguments id: ' + id);
  const product = await gpById(id);
  return successResponse(product);
};

export const main = middyfy(getProductById);
