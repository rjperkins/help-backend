import * as sst from '@serverless-stack/resources';

interface WebSocketStackProps extends sst.StackProps {
  userTableName: string;
  requestTableName: string;
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
    } = props;

    const api = new sst.WebSocketApi(this, `api`, {
      defaults: {
        function: {
          environment: {
            USER_TABLE_NAME: userTableName || '',
            REQUEST_TABLE_NAME: requestTableName || '',
            COGNITO_USER_POOL_ID: cognitoUserPoolId || '',
            COGNITO_USER_POOL_CLIENT_ID: cognitoUserPoolClientId || '',
          },
          permissions: ['cognito-idp:*', 'dynamodb:*'],
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
      ApiEndpoint: api.url,
    });
  }
}
