#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DomainManagerStack } from './domain-manager-stack';

const app = new cdk.App();
new DomainManagerStack(app, 'DomainManagerStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
