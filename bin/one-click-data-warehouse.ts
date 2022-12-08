#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NameSpaceStack } from "../lib/namespace";
import { WorkGroupStack } from "../lib/workgroup";
import { ocdwConfig } from "../config";

const app = new cdk.App();

const {
  namespaceName,
  workgroupName,
  databaseName,
  allowedIps,
  account,
  region,
} = ocdwConfig;

new NameSpaceStack(app, "OneClickDataWarehouseNamespaceStack", {
  env: { account, region },
  namespaceName,
  databaseName,
});

new WorkGroupStack(app, "OneClickDataWarehouseWorkGroupStack", {
  env: { account, region },
  namespaceName,
  workgroupName,
  allowedIps,
});
