import { Transaction } from '@scure/btc-signer';

export function verifyTransaction(txHex: string): boolean {
  try {
    const tx = Transaction.fromRaw(Buffer.from(txHex, 'hex'));
    const isValid = tx.isFinal;
    return isValid;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}
