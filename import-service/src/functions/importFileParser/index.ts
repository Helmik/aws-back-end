import { handlerPath } from '@libs/handler-resolver';

const BUCKET = 'tequila-files';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [{
          prefix: 'uploaded'
        }]
      }
    },
  ],
};


// {
//   bucket: string | AwsCfFunction | AwsCfIf;
//   event?: string;
//   existing?: boolean;
//   forceDeploy?: boolean;
//   rules?: {
//     prefix?: string | AwsCfFunction;
//     suffix?: string | AwsCfFunction;
//   }[];
// };