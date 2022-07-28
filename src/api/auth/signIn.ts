import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import Config from '../../lib/Config';
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

    const { email, password } = body;

    const res = await cognitoClient
      .adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
        ClientId: Config.cognitoClientId,
        UserPoolId: Config.cognitoUserPoolId,
      })
      .promise();

    return httpResponse(200, {
      idToken: res.AuthenticationResult?.IdToken,
      accessToken: res.AuthenticationResult?.AccessToken,
      refreshToken: res.AuthenticationResult?.RefreshToken,
    });
  } catch (error) {
    debugError('error', error);
    return httpResponse(500, {
      error: error.message,
    });
  }
};
