import { errorResponse } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { insertElement } from 'src/db/products';
import { buildProduct } from 'src/utils/validators';

const addProduct = async (event) => {
  const product = buildProduct(event.body);
  let id: number;
  console.log('add Product was executed with params: ' + event.body);
  if (product) {
    id = await insertElement(product);
  } else {
    return errorResponse('Bad request.', 400);
  }
  return successResponse({ id, ...product});
};

export const main = middyfy(addProduct);
