import { errorResponse } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { SNS } from 'aws-sdk';

const sns = new SNS();

const catalogBatchProcess = async (event) => {
  try {
    const productPromises = event.Records.map(async (record) => {
      const product = JSON.parse(record.body);
      return product;
    });

    const products = await Promise.all(productPromises);
    console.log(products);

    const message = products.map((product) => '\nTitle: ' + product.title + '\t\t Description: ' + product.description + '\t Price: ' + product.price + '\t Count: ' + product.count)

    const params = {
      TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN || '',
      Message: message.join(''),
    };

    await sns.publish(params).promise();

    return successResponse(products);
  } catch (error) {
    console.error(error);
    return errorResponse(error, 500);
  }
};

export const main = catalogBatchProcess;