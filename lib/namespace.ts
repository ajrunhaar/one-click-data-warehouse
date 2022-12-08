import { Stack, StackProps, aws_redshiftserverless } from "aws-cdk-lib";
import { Construct } from "constructs";

interface NameSpaceStackProps extends StackProps {
  namespaceName: string;
  databaseName: string;
}

export class NameSpaceStack extends Stack {
  constructor(scope: Construct, id: string, props: NameSpaceStackProps) {
    super(scope, id, props);

    const { namespaceName, databaseName } = props;

    //Namespace
    new aws_redshiftserverless.CfnNamespace(this, "OcdwNameSpace", {
      namespaceName,
      dbName: databaseName,
    });
  }
}
