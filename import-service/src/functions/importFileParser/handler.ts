import { errorResponse, successResponse } from '@libs/api-gateway';
import { S3, SQS } from 'aws-sdk';

const csv = require('csv-parser');
const sqs = new SQS();
const quequeUrl = process.env.queque_url;

const sendMessage = (data) => {
  return new Promise(((resolve, reject) => {
    sqs.sendMessage(
      {
        MessageAttributes: {
          title: {
            DataType: "String",
            StringValue: data.title
          },
          description: {
            DataType: "String",
  
  
            StringValue: data.description
          },
          price: {
            DataType: "Number",
            StringValue: data.price
          },
          count: {
            DataType: "Number",
            StringValue: data.count
          }
        },
        QueueUrl: quequeUrl,
        MessageBody: JSON.stringify(data),
      },
      (error) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log(`Message sent: ${JSON.stringify(data)}`);
          resolve(data);
        }
      }
    );
  }))
};


var readFile = (file) => {
  return new Promise(resolve => {
    const results = [];
    file
      .pipe(csv())
      .on('data', function (data) {
        console.log(data);
        results.push(data);
      })
      .on('end', async () => {
        const promises = results.map((data) => sendMessage(data));
        const products = await Promise.all(promises);
        console.log(products);
        resolve(products);
      });
  });
}

const importFileParser = async (event) => {
  console.log(quequeUrl);
  const { bucket, object } = event.Records[0].s3;
  const region: string = event.Records[0].awsRegion;
  const s3 = new S3({ region });

  if (object.key.indexOf('.csv') === -1) {
    return errorResponse('Error on file format', 500);
  }

  const params = {
    Bucket: bucket.name,
    Key: object.key
  };
  const file = s3.getObject(params).createReadStream();
  const result = await readFile(file);
  
  return successResponse(result);
};

export const main = importFileParser;
