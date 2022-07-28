import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { HttpResponse, httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const logTag = 'create-request-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

const cognitoClient = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

export const handler: APIGatewayProxyHandlerV2 = async (
  event
): Promise<HttpResponse> => {
  debugVerbose('event', event);
  const { body: rawBody } = event;

  try {
    const body = JSON.parse(rawBody as string);

    const { accessToken } = body;

    await cognitoClient
      .globalSignOut({
        AccessToken: accessToken,
      })
      .promise();

    return httpResponse(200, {
      message: 'User successfully signed out',
    });
  } catch (error) {
    debugError('error', error);
    return httpResponse(500, {
      error: error.message,
    });
  }
};
