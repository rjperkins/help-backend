import * as sst from '@serverless-stack/resources';

interface DDBStackProps extends sst.StackProps {}

export default class DDBStack extends sst.Stack {
  requestTableName: string;
  requestTableArn: string;
  userTableName: string;
  userTableArn: string;
  connectionsTableName: string;
  connectionsTableArn: string;
  chatTableName: string;
  chatTableArn: string;

  constructor(scope: sst.App, id: string, props: DDBStackProps) {
    super(scope, id, props);

    const {} = props;

    // Create dynamoDB tables
    const requestTable = new sst.Table(this, `requests-table`, {
      fields: {
        requestId: 'string',
        userId: 'string',
        acceptedUserId: 'string' || undefined,
        request: 'string',
        category: 'string',
        location: 'string',
        photoS3Url: 'string' || undefined,
        timestamp: 'string',
      },
      primaryIndex: { partitionKey: 'requestId' },
      globalIndexes: {
        'acceptedUserId-index': {
          partitionKey: 'acceptedUserId',
        },
        'userId-index': {
          partitionKey: 'userId',
        },
      },
    });

    this.requestTableName = requestTable.tableName;
    this.requestTableArn = requestTable.tableArn;

    const userTable = new sst.Table(this, `user-table`, {
      fields: {
        userId: 'string',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        rating: 'number',
        helpsGiven: 'number',
        helpsReceived: 'number',
        gender: 'string',
        address: 'string',
        birthdate: 'string',
      },
      primaryIndex: { partitionKey: 'userId' },
      globalIndexes: {
        'email-index': {
          partitionKey: 'email',
        },
      },
    });

    this.userTableName = userTable.tableName;
    this.userTableArn = userTable.tableArn;

    const connectionsTable = new sst.Table(this, `connections-table`, {
      fields: {
        connectionId: 'string',
        chatId: 'string',
      },
      primaryIndex: { partitionKey: 'connectionId' },
      globalIndexes: {
        'chatId-index': {
          partitionKey: 'chatId',
        },
      },
    });

    this.connectionsTableName = connectionsTable.tableName;
    this.connectionsTableArn = connectionsTable.tableArn;

    const chatTable = new sst.Table(this, `chat-table`, {
      fields: {
        id: 'string',
        userId1: 'string',
        userId2: 'string',
        name: 'string',
        messages: 'binary',
      },
      primaryIndex: { partitionKey: 'id' },
      globalIndexes: {
        'userId1-index': {
          partitionKey: 'userId1',
        },
        'userId2-index': {
          partitionKey: 'userId2',
        },
      },
    });

    this.chatTableName = chatTable.tableName;
    this.chatTableArn = chatTable.tableArn;

    // Outputs
    this.addOutputs({
      UserTableArn: userTable.tableArn,
      UserTableName: userTable.tableName,
      RequestTableArn: requestTable.tableArn,
      RequestTableName: requestTable.tableName,
      ConnectionsTableArn: connectionsTable.tableArn,
      ConnectionsTableName: connectionsTable.tableName,
    });
  }
}
