import { errorResponse } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import Products from 'src/DataBase/Products';

const getProductList = async () => {
  const products = await Products.getProductList();
  if (products === null) {
    return errorResponse('Error on try to get products', 500);
  }
  return successResponse(products);
};

export const main = middyfy(getProductList);
