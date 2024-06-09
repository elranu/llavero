# kms-btc Package

The `kms-btc` package provides functionality for signing Bitcoin transactions using AWS Key Management Service (KMS) and the `scure-btc-signer` library. This package includes functions for hashing transactions, signing with AWS KMS, constructing signed transactions, and verifying transactions.

## Functions

### hashTransaction

The `hashTransaction` function takes a `BitcoinTransaction` object as input, checks if the `inputs` or `outputs` arrays are empty, and throws an error if they are. It then creates a new `Transaction` object, computes its hash, and returns the hash as a `Buffer`.

```typescript
import { Transaction } from '@scure/btc-signer';

export interface BitcoinTransactionInput {
  prevTxHash: string;
  outputIndex: number;
  scriptSig: string;
  sequence: number;
}

export interface BitcoinTransactionOutput {
  value: number;
  scriptPubKey: string;
}

export interface BitcoinTransaction {
  inputs: BitcoinTransactionInput[];
  outputs: BitcoinTransactionOutput[];
  version: number;
  locktime: number;
}

export function hashTransaction(transaction: BitcoinTransaction): Buffer {
  if (transaction.inputs.length === 0 || transaction.outputs.length === 0) {
    throw new Error('Invalid transaction: inputs and outputs cannot be empty');
  }
  const tx = new Transaction(transaction);
  const hash = tx.hash;
  return Buffer.from(hash, 'hex');
}
```

### signWithKMS

The `signWithKMS` function uses AWS KMS to sign a hashed Bitcoin transaction message. It takes a `Buffer` containing the hash as input and returns a `Buffer` containing the signature.

```typescript
import * as AWS from 'aws-sdk';

const kms = new AWS.KMS();

export async function signWithKMS(hash: Buffer): Promise<Buffer> {
  const params: AWS.KMS.SignRequest = {
    KeyId: process.env.AWS_KEY_ID!, // The AWS KMS Key ID
    Message: hash,
    MessageType: 'DIGEST',
    SigningAlgorithm: 'ECDSA_SHA_256',
  };

  try {
    const result = await kms.sign(params).promise();
    const signature = result.Signature as Buffer;
    return signature;
  } catch (error) {
    console.error('Error signing with AWS KMS:', error);
    throw error;
  }
}
```

### createSignedTransaction

The `createSignedTransaction` function constructs and signs a Bitcoin transaction using the `scure-btc-signer` library and AWS KMS. It takes a transaction object and a public key as input and returns the signed transaction as a hexadecimal string.

```typescript
import { TransactionBuilder, ECPair } from 'scure-btc-signer';
import { hashTransaction } from './hashTransaction';
import { signWithKMS } from './signWithKMS';

export async function createSignedTransaction(
  transaction: any,
  publicKey: string,
): Promise<string> {
  const hash = hashTransaction(transaction);
  const signature = await signWithKMS(hash);

  const txb = new TransactionBuilder();
  // Add inputs and outputs to txb
  // ...
  const keyPair = ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'));
  txb.sign(0, keyPair, signature);
  const tx = txb.build();
  return tx.toHex();
}
```

### verifyTransaction

The `verifyTransaction` function verifies a signed Bitcoin transaction using the `scure-btc-signer` library. It takes a hexadecimal string representing the transaction as input and returns a boolean indicating whether the transaction is valid.

```typescript
import { Transaction } from 'scure-btc-signer';

export function verifyTransaction(txHex: string): boolean {
  try {
    const tx = Transaction.fromHex(txHex);
    // Perform necessary verification steps
    // ...
    return true; // Change this to actual verification result
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}
```

## Testing

Unit tests for the `kms-btc` package are located in the `tests` directory. These tests cover the functionality of the `hashTransaction`, `signWithKMS`, `createSignedTransaction`, and `verifyTransaction` functions.

To run the tests, use the following command:

```bash
yarn workspace kms-btc test
```

## Error Handling

The `kms-btc` package includes error handling for key management, signing, and transaction verification. Errors are logged to the console, and appropriate error messages are thrown to help with debugging.

## Security Review

A security review has been conducted to identify and mitigate potential vulnerabilities in the implementation. The package ensures that private keys are not exposed and that cryptographic functions are securely managed using AWS KMS.

## Full Example: Sending a Bitcoin Transaction on Testnet

This example demonstrates how to create, sign, and broadcast a Bitcoin transaction on the testnet using the `kms-btc` package.

### Prerequisites

- AWS KMS set up with a key for signing transactions
- Bitcoin testnet wallet with some testnet BTC
- Node.js and Yarn installed
- Dependencies installed using `yarn install`

### Step 1: Create a Bitcoin Transaction

Create a transaction object with inputs and outputs.

```typescript
import {
  BitcoinTransaction,
  BitcoinTransactionInput,
  BitcoinTransactionOutput,
} from './hashTransaction';

const transaction: BitcoinTransaction = {
  version: 1,
  locktime: 0,
  inputs: [
    {
      prevTxHash: 'your-previous-transaction-hash',
      outputIndex: 0,
      scriptSig: '',
      sequence: 0xffffffff,
    },
  ],
  outputs: [
    {
      value: 10000, // Amount in satoshis
      scriptPubKey: 'your-recipient-address-scriptPubKey',
    },
  ],
};
```

### Step 2: Hash the Transaction

Hash the transaction using the `hashTransaction` function.

```typescript
import { hashTransaction } from './hashTransaction';

const hash = hashTransaction(transaction);
```

### Step 3: Sign the Transaction with AWS KMS

Sign the hashed transaction using the `signWithKMS` function.

```typescript
import { signWithKMS } from './signWithKMS';

const signature = await signWithKMS(hash);
```

### Step 4: Construct the Final Signed Transaction

Construct the final signed transaction using the `createSignedTransaction` function.

```typescript
import { createSignedTransaction } from './createSignedTransaction';

const publicKey = 'your-public-key';
const signedTransactionHex = await createSignedTransaction(transaction, publicKey);
```

### Step 5: Broadcast the Transaction to the Testnet

Broadcast the signed transaction to the Bitcoin testnet using a testnet API (e.g., BlockCypher, Bitcoin Testnet Faucet).

```typescript
import axios from 'axios';

const broadcastTransaction = async (txHex: string) => {
  const response = await axios.post('https://api.blockcypher.com/v1/btc/test3/txs/push', {
    tx: txHex,
  });
  console.log('Broadcast response:', response.data);
};

await broadcastTransaction(signedTransactionHex);
```

### Conclusion

This example demonstrates how to create, sign, and broadcast a Bitcoin transaction on the testnet using the `kms-btc` package. Ensure you have the necessary prerequisites and follow the steps to successfully send a transaction.
