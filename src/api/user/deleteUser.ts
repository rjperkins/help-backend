import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import UserService from '../../dynamodb/user/Service';
import Config from '../../lib/Config';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const cognitoClient = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});
const logTag = 'delete-user-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event %j', event);

  try {
    if (!event.pathParameters) {
      return httpResponse(500, {
        error: new Error('Must include path parameters.').message,
      });
    }
    const { id } = event.pathParameters;

    if (!id) {
      return httpResponse(500, {
        error: new Error('Must include id in path parameters.').message,
      });
    }
    debugVerbose('id', id);

    const ddbRes = await UserService.getUserById(id);
    const user = ddbRes[0];

    if (!user) {
      throw new Error('User does not exist.');
    }

    const deleteRes = await cognitoClient
      .adminDeleteUser({
        UserPoolId: Config.cognitoUserPoolId,
        Username: user.email,
      })
      .promise();

    if (deleteRes instanceof Error) {
      throw new Error(deleteRes.message);
    }

    await UserService.deleteUser(id);

    return httpResponse(200, {
      service: logTag,
      body: 'User deleted correctly',
    });
  } catch (error) {
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
