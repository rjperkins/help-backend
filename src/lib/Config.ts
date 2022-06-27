// Code.
export enum Stage {
  Production = 'production',
  Development = 'development',
  Debug = 'debug',
}

export default class Config {
  public static get account(): string {
    return process.env.ACCOUNT || '';
  }

  public static get stage(): Stage {
    return (process.env.STAGE as Stage) || Stage.Debug;
  }

  public static get region(): string {
    return process.env.AWS_REGION || 'us-east-1';
  }

  public static get cognitoUserPoolId(): string {
    return process.env.COGNITO_USER_POOL_ID || '';
  }

  public static get cognitoClientId(): string {
    return process.env.COGNITO_USER_POOL_CLIENT_ID || '';
  }

  public static get userTableName(): string {
    return process.env.USER_TABLE_NAME || '';
  }

  public static get requestTableName(): string {
    return process.env.REQUEST_TABLE_NAME || '';
  }
}
