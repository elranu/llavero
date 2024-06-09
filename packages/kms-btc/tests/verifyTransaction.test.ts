import { verifyTransaction } from '../src/verifyTransaction';
import { Transaction } from '@scure/btc-signer';

describe('verifyTransaction', () => {
  it('should return true for a valid finalized transaction', () => {
    const tx = new Transaction({
      version: 1,
      lockTime: 0,
    });

    tx.finalize();

    const txHex = tx.hex;
    console.log('Valid transaction hex:', txHex); // Log the hex string for debugging
    const isValid = verifyTransaction(txHex);
    expect(isValid).toBe(true);
  });

  it('should return false for an invalid transaction', () => {
    const txHex = 'invalidHex';
    console.log('Invalid transaction hex:', txHex); // Log the hex string for debugging
    const isValid = verifyTransaction(txHex);
    expect(isValid).toBe(false);
  });
});
