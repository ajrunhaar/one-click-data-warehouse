#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { OneClickDataWarehouseStack } from "../lib/one-click-data-warehouse-stack";
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

new OneClickDataWarehouseStack(app, "OneClickDataWarehouse", {
  env: { account, region },
  namespaceName,
  databaseName,
  allowedIps,
  workgroupName,
});
