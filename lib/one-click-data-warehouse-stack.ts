import {
  Stack,
  StackProps,
  aws_redshiftserverless,
  aws_ec2,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { RedshiftServerlessStack } from "./nested-stacks/redshift-serverless-stack";
import { DataIngestionPipelineStack } from "./nested-stacks/data-ingestion-pipeline-stack";

interface OneClickDataWarehouseStackProps extends StackProps {
  namespaceName: string;
  databaseName: string;
  allowedIps: string[];
  workgroupName: string;
}

export class OneClickDataWarehouseStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: OneClickDataWarehouseStackProps
  ) {
    super(scope, id, props);

    const { namespaceName, databaseName, allowedIps, workgroupName } = props;

    new RedshiftServerlessStack(this, "RedshiftServerlessStack", {
      namespaceName,
      databaseName,
      allowedIps,
      workgroupName,
    });

    new DataIngestionPipelineStack(this, "DataIngestionPipelineStack", {});
  }
}
