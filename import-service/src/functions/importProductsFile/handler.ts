import { errorResponse } from '@libs/api-gateway';
import { successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { parseUrl } from "@aws-sdk/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Hash } from "@aws-sdk/hash-node";

const importProductsFile = async (event) => {
  const { name } = JSON.parse(JSON.stringify(event.queryStringParameters));
  const BUCKET = 'tequila-files';
  const REGION = 'us-east-1';
  const credentials = {
    secretAccessKey: process.env.aws_secret_access_key,
    accessKeyId: process.env.aws_access_key_id
  }

  const createPresignedUrlWithoutClient = async (region, bucket, key) => {
    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/uploaded/${key}`);
    const presigner = new S3RequestPresigner({
      credentials,
      region,
      sha256: Hash.bind(null, "sha256"),
    });
  
    const signedUrlObject = await presigner.presign(
      new HttpRequest({ ...url, method: "PUT" })
    );
    return formatUrl(signedUrlObject);
  };

  if (name.indexOf('.csv') === -1) {
    return errorResponse('Error on file format', 500);
  }

  if (name) {
    const url = await createPresignedUrlWithoutClient(REGION, BUCKET, name);
    return successResponse(url);
  }

  return errorResponse('name property is missing.', 400)
};

export const main = middyfy(importProductsFile);
