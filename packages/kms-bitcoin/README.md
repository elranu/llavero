# kms-bitcoin

The `kms-bitcoin` package provides functionality for securely managing and signing Bitcoin transactions using AWS Key Management Service (KMS) and the `bitcoinjs-lib` library. This package ensures that private keys are never exposed and leverages AWS KMS for cryptographic operations.

## Description

The `kms-bitcoin` package includes the following key functionalities:

- **Key Management**: Generate and store elliptic curve keys compatible with Bitcoin’s secp256k1 curve using AWS KMS.
- **Transaction Hashing**: Perform double SHA-256 hashing of Bitcoin transaction messages using `bitcoinjs-lib`.
- **Signing**: Sign the hashed Bitcoin transaction message using AWS KMS and extract the signature.
- **Transaction Construction**: Construct the final Bitcoin transaction using `bitcoinjs-lib`, including the signed hash and necessary transaction details.
- **Verification**: Verify the generated signature using `bitcoinjs-lib` to ensure it is valid and can be verified using the public key.

## Installation

To install the `kms-bitcoin` package, navigate to the `packages/kms-bitcoin` directory and run the following command:

```bash
yarn add aws-sdk bitcoinjs-lib
```

## Usage

### Hashing a Transaction

To hash a Bitcoin transaction, use the `hashTransaction` function:

```typescript
import hashTransaction from './hashTransaction';

const transaction = {
  inputs: [
    {
      txId: 'e3c0b8f8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8',
      vout: 0,
    },
  ],
  outputs: [
    {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      amount: 50000,
    },
  ],
};

const hash = hashTransaction(transaction);
console.log('Transaction hash:', hash.toString('hex'));
```

### Signing a Transaction with AWS KMS

To sign a hashed Bitcoin transaction message using AWS KMS, use the `signWithKMS` function:

```typescript
import signWithKMS from './signWithKMS';

const hash = Buffer.from('your-transaction-hash', 'hex');
const signature = await signWithKMS(hash);
console.log('Signature:', signature.toString('hex'));
```

### Creating a Signed Transaction

To create a signed Bitcoin transaction, use the `createSignedTransaction` function:

```typescript
import createSignedTransaction, { Transaction } from './createSignedTransaction';

const transaction: Transaction = {
  inputs: [
    {
      txId: 'e3c0b8f8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8',
      vout: 0,
    },
  ],
  outputs: [
    {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      amount: 50000,
    },
  ],
};

const publicKey = '02c72b8f8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8';

const signedTransactionHex = await createSignedTransaction(transaction, publicKey);
console.log('Signed Transaction Hex:', signedTransactionHex);
```

### Verifying a Transaction

To verify a Bitcoin transaction, use the `verifyTransaction` function:

```typescript
import verifyTransaction from './verifyTransaction';

const txHex = 'your-signed-transaction-hex';
const isValid = verifyTransaction(txHex);
console.log('Is transaction valid?', isValid);
```

## Testing

To run the tests for the `kms-bitcoin` package, use the following command:

```bash
yarn test
```

Ensure that the AWS credentials and KMS key ID are set in the environment variables before running the tests:

```bash
export AWS_ACCESS_KEY_ID='your-access-key-id'
export AWS_SECRET_ACCESS_KEY='your-secret-access-key'
export AWS_KEY_ID='your-kms-key-id'
yarn test
```

## License

This project is licensed under the MIT License.
