import { Route53Client, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53';
import { CloudFrontClient, CreateDistributionCommand } from '@aws-sdk/client-cloudfront';

const route53Client = new Route53Client({ region: process.env.AWS_REGION });
const cloudFrontClient = new CloudFrontClient({ region: process.env.AWS_REGION });

async function configureMainDomain(domainName: string, hostedZoneId: string) {
  try {
    // Create DNS records for the main domain in the hosted zone
    const dnsRecordParams = {
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: domainName,
              Type: 'A',
              AliasTarget: {
                HostedZoneId: hostedZoneId,
                DNSName: domainName,
                EvaluateTargetHealth: false,
              },
            },
          },
        ],
      },
    };
    const changeResourceRecordSetsCommand = new ChangeResourceRecordSetsCommand(dnsRecordParams);
    await route53Client.send(changeResourceRecordSetsCommand);

    // Create a CloudFront distribution for the main domain
    const distributionParams = {
      DistributionConfig: {
        CallerReference: `create-distribution-${Date.now()}`,
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: 'origin-1',
              DomainName: domainName,
              OriginPath: '',
              CustomHeaders: {
                Quantity: 0,
              },
              S3OriginConfig: {
                OriginAccessIdentity: '',
              },
            },
          ],
        },
        DefaultCacheBehavior: {
          TargetOriginId: 'origin-1',
          ViewerProtocolPolicy: 'redirect-to-https',
          AllowedMethods: {
            Quantity: 2,
            Items: ['GET', 'HEAD'],
            CachedMethods: {
              Quantity: 2,
              Items: ['GET', 'HEAD'],
            },
          },
          ForwardedValues: {
            QueryString: false,
            Cookies: {
              Forward: 'none',
            },
            Headers: {
              Quantity: 0,
            },
            QueryStringCacheKeys: {
              Quantity: 0,
            },
          },
          MinTTL: 0,
          DefaultTTL: 86400,
          MaxTTL: 31536000,
        },
        Comment: 'CloudFront distribution for main domain',
        Enabled: true,
      },
    };
    const createDistributionCommand = new CreateDistributionCommand(distributionParams);
    const distributionResponse = await cloudFrontClient.send(createDistributionCommand);

    return {
      domainName,
      distributionId: distributionResponse.Distribution.Id,
      distributionDomainName: distributionResponse.Distribution.DomainName,
    };
  } catch (error) {
    console.error('Error configuring main domain:', error);
    throw error;
  }
}

export { configureMainDomain };
