import * as sst from '@serverless-stack/resources';
// import * as path from 'path';

interface CognitoStackProps extends sst.StackProps {}

export default class CognitoStack extends sst.Stack {
  userPoolClientId: string;
  userPoolId: string;

  constructor(scope: sst.App, id: string, props: CognitoStackProps) {
    super(scope, id, props);

    const userPool = new sst.Auth(this, `user-pool`, {
      // triggers: {
      //   postAuthentication: {
      //     handler: path.join(''),
      //   },
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
