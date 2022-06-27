import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import UserService from '../../dynamodb/user/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'get-users-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event %j', event);
  try {
    const output = await UserService.getUsers();
    debugVerbose('output %j', output);

    return httpResponse(200, {
      service: logTag,
      body: output,
    });
  } catch (error) {
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
