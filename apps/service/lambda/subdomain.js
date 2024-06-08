import AWS from 'aws-sdk';
const route53 = new AWS.Route53();

exports.handler = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const subdomain = requestBody.subdomain;
  const hostedZoneId = process.env.HOSTED_ZONE_ID;
  const domainName = process.env.DOMAIN_NAME;

  const params = {
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: `${subdomain}.${domainName}`,
            Type: 'A',
            TTL: 300,
            ResourceRecords: [
              {
                Value: '192.0.2.1', // Example IP address, replace with actual value
              },
            ],
          },
        },
      ],
    },
    HostedZoneId: hostedZoneId,
  };

  try {
    const data = await route53.changeResourceRecordSets(params).promise();
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Subdomain ${subdomain}.${domainName} has been created successfully.`,
        changeInfo: data.ChangeInfo,
      }),
    });
  } catch (error) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to create subdomain ${subdomain}.${domainName}.`,
        error: error.message,
      }),
    });
  }
};
