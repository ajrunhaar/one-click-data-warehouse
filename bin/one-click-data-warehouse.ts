#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OneClickDataWarehouseStack } from '../lib/one-click-data-warehouse-stack';

const app = new cdk.App();
new OneClickDataWarehouseStack(app, 'OneClickDataWarehouseStack', {

  env: { account: '339880448568', region: 'eu-west-1' },

});