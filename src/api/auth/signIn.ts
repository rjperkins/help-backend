import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import Config from '../../lib/Config';
import { httpResponse } from '../../lib/utils/httpResponse';

const cognitoClient = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { body: rawBody } = event;

  try {
    const body = JSON.parse(rawBody as string);

    const { email, password } = body;

    const res = await cognitoClient
      .adminInitiateAuth({
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
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
    return httpResponse(500, {
      error: error.message,
    });
  }
};
