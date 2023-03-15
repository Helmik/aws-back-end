import { errorResponse, successResponse } from '@libs/api-gateway';
// import {} from 'csv-parser';
import { S3 } from 'aws-sdk';
const csv = require('csv-parser');

var readFile = (file) => {
  return new Promise(resolve => {
    const results = [];
    file
      .pipe(csv())
      .on('data', function (data) {
          console.log(data);
          results.push(data);
      })
      .on('end', () => {
          console.log(results);
          resolve(results);
      });
  });
}

const importFileParser = async (event) => {
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
