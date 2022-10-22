import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnNamespace, CfnWorkgroup} from 'aws-cdk-lib/aws-redshiftserverless'

export class OneClickDataWarehouseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Namespace

    const {namespaceName} = new CfnNamespace(this, 'RedshiftServerlessNameSpace',{
      namespaceName: 'default-namespace',
    })

    //Workgroup

    new CfnWorkgroup(this,'RedshiftServerlessWorkGroup',{
      workgroupName: 'default-workgroup',
      // optional
      namespaceName,
      publiclyAccessible:false,
      enhancedVpcRouting:true
    })

  }
}
