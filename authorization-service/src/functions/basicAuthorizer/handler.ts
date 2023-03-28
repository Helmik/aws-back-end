import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent, PolicyDocument } from 'aws-lambda';

enum Effect {
  ALLOW = 'Allow',
  DENY = 'Deny',
  FAIL = 'Fail'
}
const Version = '2012-10-17';

const generatePolicy = (effect: Effect, resource: string): PolicyDocument => {
  return {
      Version,
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }],
  };
};

const generateResponse = (principalId : string = '', effect: Effect, resource: string): APIGatewayAuthorizerResult => {
  return {
    principalId: principalId,
    policyDocument: generatePolicy(effect, resource),
  };
};


const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {

  console.log('Event: ', event);
  const token = event.authorizationToken.split(' ')[1];
  const resource = event.methodArn;

  if (!token) {
    return generateResponse('undefined', Effect.FAIL, resource); // 401
  }

  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');
  console.log(username, password);

  if (process.env[username] !== password) {
    return generateResponse(username, Effect.DENY, resource); // 403
  }

  return generateResponse(username, Effect.ALLOW, resource);
};

export const main = basicAuthorizer;
