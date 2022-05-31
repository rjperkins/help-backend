import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import UserService from '../../dynamodb/user/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const debugVerbose = debug('api:verbose:get-users');

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event %j', event);
  const output = await UserService.getUsers();
  debugVerbose('output %j', output);

  return httpResponse(200, {
    user: output,
  });
};
