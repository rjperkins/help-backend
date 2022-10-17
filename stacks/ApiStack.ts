import * as sst from '@serverless-stack/resources';

interface ApiStackProps extends sst.StackProps {
  userTableName: string;
  requestTableName: string;
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
  stage: string;
}

export default class ApiStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const {
      userTableName,
      requestTableName,
      cognitoUserPoolId,
      cognitoUserPoolClientId,
      stage,
    } = props;

    const api = new sst.Api(this, `api`, {
      defaults: {
        function: {
          environment: {
            USER_TABLE_NAME: userTableName || '',
            REQUEST_TABLE_NAME: requestTableName || '',
            COGNITO_USER_POOL_ID: cognitoUserPoolId || '',
            COGNITO_USER_POOL_CLIENT_ID: cognitoUserPoolClientId || '',
            STAGE: stage,
            DEBUG: process.env.DEBUG || '*',
          },
          permissions: ['cognito-idp:*', 'dynamodb:*'],
        },
      },
      cors: {
        allowHeaders: ['*'],
        allowMethods: ['ANY'],
        allowOrigins: ['*'],
      },
      routes: {
        // Authentication endpoints.
        'POST /sign-in': 'src/api/auth/signIn.handler',
        'POST /sign-out': 'src/api/auth/signOut.handler',
        // User endpoints.
        'GET /users': 'src/api/user/getUsers.handler',
        'GET /users/{id}': 'src/api/user/getUserById.handler',
        'POST /users': 'src/api/user/createUser.handler',
        'DELETE /users/{id}': 'src/api/user/deleteUser.handler',
        'PUT /users/{id}': 'src/api/user/updateUser.handler',
        // Request endpoints.
        'GET /requests': 'src/api/requests/getRequests.handler',
        'GET /requests/{id}': 'src/api/requests/getRequestById.handler',
        'GET /user-requests/{userId}':
          'src/api/requests/getRequestsByUserId.handler',
        'POST /requests': 'src/api/requests/createRequest.handler',
        'DELETE /requests/{id}': 'src/api/requests/deleteRequest.handler',
        'PUT /requests/{id}': 'src/api/requests/updateRequest.handler',
        // Chat endpoints.
        'GET /chats/{id}': 'src/api/chat/getChatsByUserId.handler',
        'GET /chat/{id1}/{id2}/{name}': 'src/api/chat/getChat.handler',
      },
    });

    // Outputs.
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
