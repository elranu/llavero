import { hashTransaction } from '../src/hashTransaction';
import { BitcoinTransaction } from '../src/hashTransaction';

describe('hashTransaction', () => {
  it('should return a valid hash for a valid transaction', () => {
    const transaction: BitcoinTransaction = {
      inputs: [
        {
          prevTxHash: '0000000000000000000000000000000000000000000000000000000000000000',
          outputIndex: 0,
          scriptSig: '',
          sequence: 0xffffffff,
        },
      ],
      outputs: [
        {
          value: 5000000000,
          scriptPubKey: '76a91489abcdefabbaabbaabbaabbaabbaabbaabbaabba88ac',
        },
      ],
      version: 1,
      locktime: 0,
    };

    const hash = hashTransaction(transaction);
    expect(hash).toBeInstanceOf(Buffer);
    expect(hash.length).toBe(32);
  });

  it('should throw an error for an invalid transaction', () => {
    const transaction = {
      inputs: [],
      outputs: [],
      version: 1,
      locktime: 0,
    } as BitcoinTransaction;

    expect(() => hashTransaction(transaction)).toThrow();
  });
});
