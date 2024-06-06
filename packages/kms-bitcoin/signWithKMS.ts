import AWS from 'aws-sdk';

const kms = new AWS.KMS({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Use the AWS Access Key ID from the environment variable
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function signWithKMS(hash: Buffer): Promise<Buffer> {
  console.log('Hash to be signed:', hash.toString('hex')); // Log the hash to be signed
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID); // Log the AWS Access Key ID
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY); // Log the AWS Secret Access Key
  console.log('AWS_KEY_ID:', process.env.AWS_KEY_ID); // Log the AWS Key ID

  if (!process.env.AWS_KEY_ID) {
    throw new Error('AWS_KEY_ID environment variable is not set');
  }

  const params: AWS.KMS.SignRequest = {
    KeyId: process.env.AWS_KEY_ID, // Use the AWS Key ID from the environment variable
    Message: hash,
    MessageType: 'DIGEST',
    SigningAlgorithm: 'ECDSA_SHA_256',
  };
  try {
    const result = await kms.sign(params).promise();
    let signature = result.Signature as Buffer;
    console.log('Raw signature from AWS KMS:', signature.toString('hex')); // Log the raw signature
    console.log('Signature length:', signature.length); // Log the length of the signature

    // Trim the signature to the correct length of 64 bytes if necessary
    if (signature.length > 64) {
      signature = signature.slice(0, 64);
    }

    return signature;
  } catch (error) {
    console.error('Error signing with AWS KMS:', error);
    throw new Error('Failed to sign with AWS KMS');
  }
}

export default signWithKMS;
