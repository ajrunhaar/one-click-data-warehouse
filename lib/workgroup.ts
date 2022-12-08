import {Stack, StackProps, aws_redshiftserverless, aws_ec2} from 'aws-cdk-lib';
import { Construct } from 'constructs';

import {Vpc} from "aws-cdk-lib/aws-ec2";

interface WorkGroupStackProps extends StackProps {
  namespaceName:string
  workgroupName:string
  allowedIps:string[]
}

export class WorkGroupStack extends Stack {
  constructor(scope: Construct, id: string, props: WorkGroupStackProps) {
    super(scope, id, props);

    const {namespaceName, workgroupName, allowedIps} = props

    const vpc = new Vpc(this, 'OcdwVpc')

    // 👇 Create a security Group for a redshift
    const ocdwSg = new aws_ec2.SecurityGroup(this, 'ocdw-sg', {
      vpc,
      allowAllOutbound: true,
      description: 'security group for Redshift Serverless',
    });

    for (const allowedIp of allowedIps){
      ocdwSg.addIngressRule(
        aws_ec2.Peer.ipv4(`${allowedIp}/32`),
        aws_ec2.Port.tcp(5439),
        'Allow Redshift access from specific IP',
      );
    }

    //Namespace
    new aws_redshiftserverless.CfnWorkgroup(this, 'RedshiftServerlessWorkGroup',{
      workgroupName,
      namespaceName,
      publiclyAccessible: true,
      enhancedVpcRouting: true,
      securityGroupIds:[ocdwSg.securityGroupId],
      subnetIds:vpc.publicSubnets.map((publicSubnet)=>publicSubnet.subnetId)
    })

  }
}
