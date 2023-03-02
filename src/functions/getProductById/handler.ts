import { errorResponse } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import TequilaInterface from 'src/interfaces/Tequila.interface';
import products from 'src/utils/products';

const getProductById = async (event) => {
  const { productId } = JSON.parse(JSON.stringify(event.queryStringParameters));
  const id = Number(productId);
  let errorMessage: string;
  let product: TequilaInterface;
  let statusCode = 200;

  if (productId === undefined) {
    errorMessage = 'Product id is needed';
    statusCode = 400;
  } else if (isNaN(id) || id === null) {
    errorMessage = 'id should be a number'
    statusCode = 400;
  } else {
    product = products.find(p => p.id === id);

    if (!product) {
      errorMessage = 'Product not found'
      statusCode = 403;
    }
  }

  if (statusCode !== 200) {
    return errorResponse(errorMessage, statusCode);
  }
  return successResponse(product);
};

export const main = middyfy(getProductById);
