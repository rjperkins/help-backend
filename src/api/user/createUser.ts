import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import Config from '../../lib/Config';
import UserService from '../../dynamodb/user/Service';
import { httpResponse } from '../../lib/utils/httpResponse';
import debug from 'debug';

const cognitoClient = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const logTag = 'create-user-handler';
const debugVerbose = debug(`api:verbose:${logTag}`);
const debugError = debug(`api:error:${logTag}`);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  debugVerbose('event', event);
  const { body: rawBody } = event;

  try {
    const body = JSON.parse(rawBody as string);

    const { email, password, firstName, lastName, address, gender, birthdate } =
      body;

    const res = await cognitoClient
      .signUp({
        ClientId: Config.cognitoClientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'given_name', Value: firstName },
          { Name: 'family_name', Value: lastName },
          { Name: 'address', Value: address },
          { Name: 'gender', Value: gender },
          { Name: 'birthdate', Value: birthdate },
        ],
      })
      .promise();

    const confirmRes = await cognitoClient
      .adminConfirmSignUp({
        UserPoolId: Config.cognitoUserPoolId,
        Username: email,
      })
      .promise();

    let ddbRes;
    if (confirmRes instanceof Error) {
      await cognitoClient
        .adminDeleteUser({
          UserPoolId: Config.cognitoUserPoolId,
          Username: email,
        })
        .promise();
      throw confirmRes;
    } else {
      ddbRes = await UserService.createUser({
        id: res.UserSub,
        email,
        firstName,
        lastName,
        address,
        gender,
        birthdate,
      });
    }

    const output = {
      service: logTag,
      body: { cognitoRes: res, ddbRes },
    };
    debugVerbose('output', output);

    return httpResponse(200, output);
  } catch (error) {
    debugError('error', error);
    return httpResponse(500, {
      service: logTag,
      error: error.message,
    });
  }
};
