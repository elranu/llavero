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
