import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: 'arn:aws:sqs:us-east-1:057519801860:catalogItemsQueue',
        batchSize: 5
      }
    },
  ],
};