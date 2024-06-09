declare module 'scure-btc-signer' {
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

  export function hashTransaction(transaction: BitcoinTransaction): Buffer;
}
