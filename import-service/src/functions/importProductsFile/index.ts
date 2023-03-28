import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        cors: true,
        authorizer: {
          arn: 'arn:aws:lambda:us-east-1:057519801860:function:authorization-service-dev-basicAuthorizer',
          type: 'token',
          resultTtlInSeconds: 0
        }
      },
    },
  ],
};
