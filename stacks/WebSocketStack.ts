import * as sst from '@serverless-stack/resources';

interface WebSocketStackProps extends sst.StackProps {
  userTableName: string;
  requestTableName: string;
  chatTableName: string;
  connectionsTableName: string;
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
}

export default class WebSocketStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: WebSocketStackProps) {
    super(scope, id, props);

    const {
      userTableName,
      requestTableName,
      cognitoUserPoolId,
      cognitoUserPoolClientId,
      chatTableName,
      connectionsTableName,
    } = props;

    const webSocketApi = new sst.WebSocketApi(this, `websocket-api`, {
      accessLog: true,
      defaults: {
        function: {
          environment: {
            USER_TABLE_NAME: userTableName || '',
            REQUEST_TABLE_NAME: requestTableName || '',
            CHAT_TABLE_NAME: chatTableName || '',
            CONNECTIONS_TABLE_NAME: connectionsTableName || '',
            COGNITO_USER_POOL_ID: cognitoUserPoolId || '',
            COGNITO_USER_POOL_CLIENT_ID: cognitoUserPoolClientId || '',
            DEBUG: process.env.DEBUG || '*',
          },
          permissions: [
            'cognito-idp:*',
            'dynamodb:*',
            'logs:*',
            'execute-api:ManageConnections',
          ],
        },
      },
      routes: {
        $connect: 'src/api/chat/connect.main',
        $default: 'src/api/chat/default.main',
        $disconnect: 'src/api/chat/disconnect.main',
        sendMessage: 'src/api/chat/sendMessage.main',
      },
    });

    // Outputs.
    this.addOutputs({
      WebSocketApiEndpoint: webSocketApi.url,
    });
  }
}
