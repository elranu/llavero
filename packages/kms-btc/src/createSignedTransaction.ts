import { Transaction } from '@scure/btc-signer';
import { hashTransaction } from './hashTransaction';
import { signWithKMS } from './signWithKMS';

interface BitcoinTransactionInput {
  prevTxHash: string;
  outputIndex: number;
  scriptSig: string;
  sequence: number;
}

interface BitcoinTransactionOutput {
  value: number;
  scriptPubKey: string;
}

interface BitcoinTransaction {
  inputs: BitcoinTransactionInput[];
  outputs: BitcoinTransactionOutput[];
  version: number;
  locktime: number;
}

export async function createSignedTransaction(
  transaction: BitcoinTransaction,
  publicKey: string,
): Promise<string> {
  const hash = hashTransaction(transaction);
  const signature = await signWithKMS(hash);

  if (!Array.isArray(signature) || !signature.every((byte) => typeof byte === 'number')) {
    throw new Error('Invalid signature format. Expected a Bytes array.');
  }

  const tx = new Transaction(transaction);
  tx.sign(Buffer.from(publicKey, 'hex'), signature as number[]);

  return tx.hex;
}
