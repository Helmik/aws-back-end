import type { AWS } from '@serverless/typescript';

import getProductList from '@functions/getProductList';
import getProductById from '@functions/getProductById';
import addProduct from '@functions/addProduct';
import fillTable from '@functions/fillTable';

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'tequila-store',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: [
          'arn:aws:dynamodb:us-east-1:057519801860:table/products',
          'arn:aws:dynamodb:us-east-1:057519801860:table/stocks'
        ],
      }
    ],
  },
  // import the function via paths
  functions: { getProductList, getProductById, addProduct, fillTable },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    swagger: {
      apiType: 'http',
      title: 'Tequila store'
    }
  },
};

module.exports = serverlessConfiguration;
