import { errorResponse } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import Products from 'src/DataBase/Products';
import { buildProduct } from 'src/utils/validators';

const addProduct = async (event) => {
  const product = buildProduct(event.body);
  console.log('add Product was executed with params: ' + event.body);
  if (!product) {
    return errorResponse('Bad request.', 400);
  }

  const newProduct = await Products.addProduct(product);
  if (newProduct === null) {
    return errorResponse('Error on create product', 500);
  }
  return successResponse({ product });
};

export const main = middyfy(addProduct);