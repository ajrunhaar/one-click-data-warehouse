import {
  aws_redshiftserverless,
  aws_ec2,
  NestedStackProps,
  NestedStack,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";

interface RedshiftServerlessProps extends NestedStackProps {
  namespaceName: string;
  databaseName: string;
  allowedIps: string[];
  workgroupName: string;
}

export class RedshiftServerlessStack extends NestedStack {
  constructor(scope: Construct, id: string, props: RedshiftServerlessProps) {
    super(scope, id, props);

    const { namespaceName, databaseName, allowedIps, workgroupName } = props;

    // VPC and Security Groups
    const vpc = new Vpc(this, "OcdwVpc");

    const ocdwSg = new aws_ec2.SecurityGroup(this, "ocdw-sg", {
      vpc,
      allowAllOutbound: true,
      description: "security group for Redshift Serverless",
    });

    for (const allowedIp of allowedIps) {
      ocdwSg.addIngressRule(
        aws_ec2.Peer.ipv4(`${allowedIp}/32`),
        aws_ec2.Port.tcp(5439),
        "Allow Redshift access from specific IP"
      );
    }

    //Namespace
    new aws_redshiftserverless.CfnNamespace(this, "OcdwNameSpace", {
      namespaceName,
      dbName: databaseName,
    });

    //WorkGroup
    new aws_redshiftserverless.CfnWorkgroup(this, "OcdwWorkGroup", {
      workgroupName,
      namespaceName,
      publiclyAccessible: true,
      enhancedVpcRouting: true,
      securityGroupIds: [ocdwSg.securityGroupId],
      subnetIds: vpc.publicSubnets.map((publicSubnet) => publicSubnet.subnetId),
    });
  }
}
