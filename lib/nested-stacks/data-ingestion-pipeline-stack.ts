import { NestedStack, NestedStackProps, RemovalPolicy } from "aws-cdk-lib";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { CfnCrawler, CfnClassifier } from "aws-cdk-lib/aws-glue";
import {
  Effect,
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class DataIngestionPipelineStack extends NestedStack {
  constructor(scope: Construct, id: string, props: NestedStackProps) {
    super(scope, id, props);

    const rawDataBucket = new Bucket(this, "RawDataBucket", {
      bucketName: "ocdw-raw-data-bucket",
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY, //Production scenario: Set to Retain or Snapshot
      autoDeleteObjects: true, //Production scenario: Set to false
    });

    const glueServicePrincipal = new ServicePrincipal("glue.amazonaws.com");

    const rawDataBucketCrawlerRole = new Role(
      this,
      "RawDataBucketCrawlerRole",
      {
        assumedBy: glueServicePrincipal,
        managedPolicies: [
          ManagedPolicy.fromManagedPolicyArn(
            this,
            "glue-service-policy",
            "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
          ),
        ],
      }
    );

    rawDataBucketCrawlerRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
        ],
        resources: [`${rawDataBucket.bucketArn}/raw-data/*`],
      })
    );

    const csvClassifierName = "ocdwCsvClassifier";

    new CfnClassifier(this, "ocdwCsvClassifier", {
      csvClassifier: {
        name: csvClassifierName,
        containsHeader: "PRESENT",
        delimiter: ";",
      },
    });

    new CfnCrawler(this, "OcdwRawDataBucketCrawler", {
      targets: {
        s3Targets: [
          {
            path: `s3://${rawDataBucket.bucketName}/raw-data/csv`,
          },
        ],
      },
      role: rawDataBucketCrawlerRole.roleArn,
      databaseName: "ocdwRawDataDatabase",
      tablePrefix: "ocdw",
      description: "A Crawler to infer the schemas of incoming CSV data",
      classifiers: [csvClassifierName],
    });
  }
}
