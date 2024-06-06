import signTransaction, { Transaction } from './signTransaction';
import * as bitcoin from 'bitcoinjs-lib';

describe('signTransaction', () => {
  it('should create a signed transaction', async () => {
    const transaction: Transaction = {
      inputs: [
        {
          txId: 'e3c0b8f8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8a2b8',
          vout: 0,
          value: 100000, // Add value property to TransactionInput
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Add address property to TransactionInput
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

    // Sign the transaction and get the signed transaction hex
    const {
      signature,
      publicKey: returnedPublicKey,
      txHex,
    } = await signTransaction(
      JSON.stringify(transaction), // Pass the transaction as a JSON string
      publicKey,
    );

    expect(signature).toBeDefined();
    expect(returnedPublicKey).toBe(publicKey);

    const tx = bitcoin.Transaction.fromHex(txHex); // Pass the transaction hex
    expect(tx).toBeDefined();
    expect(tx.ins.length).toBe(transaction.inputs.length);
    expect(tx.outs.length).toBe(transaction.outputs.length);
  });
});
