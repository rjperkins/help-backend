import * as sst from '@serverless-stack/resources';

interface CognitoStackProps extends sst.StackProps {}

export default class CognitoStack extends sst.Stack {
  userPoolClientId: string;
  userPoolId: string;

  constructor(scope: sst.App, id: string, props: CognitoStackProps) {
    super(scope, id, props);

    const userPool = new sst.Auth(this, `user-pool`, {
      // identityPoolFederation: {
      //   google: { clientId: '' },
      //   facebook: { appId: '' },
      // },
    });

    this.userPoolClientId = userPool.userPoolClientId;
    this.userPoolId = userPool.userPoolId;

    this.addOutputs({
      UserPoolClientId: userPool.userPoolClientId,
      UserPoolId: userPool.userPoolId,
    });
  }
}
