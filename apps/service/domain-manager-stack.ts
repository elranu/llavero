import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class DomainManagerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the Route 53 hosted zone for llavero.cloud
    const hostedZone = new route53.HostedZone(this, 'LlaveroCloudHostedZone', {
      zoneName: 'llavero.cloud',
    });

    // Define the Lambda function to handle subdomain requests
    const subdomainHandler = new lambda.Function(this, 'SubdomainHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'subdomain.handler',
      environment: {
        HOSTED_ZONE_ID: hostedZone.hostedZoneId,
        DOMAIN_NAME: 'llavero.cloud',
      },
    });

    // Define the API Gateway to expose the Lambda function
    const api = new apigateway.RestApi(this, 'SubdomainApi', {
      restApiName: 'Subdomain Service',
      description: 'This service handles subdomain requests.',
    });

    const getSubdomainIntegration = new apigateway.LambdaIntegration(subdomainHandler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    api.root.addMethod('POST', getSubdomainIntegration); // POST /subdomain
  }
}
