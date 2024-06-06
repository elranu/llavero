import * as bitcoin from 'bitcoinjs-lib';

interface TransactionInput {
  txId: string;
  vout: number;
  value: number; // Add value property to TransactionInput
  address: string; // Add address property to TransactionInput
}

interface TransactionOutput {
  address: string;
  amount: number;
}

interface Transaction {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

function hashTransaction(transaction: Transaction): Buffer {
  const psbt = new bitcoin.Psbt();
  // Add inputs and outputs to psbt
  transaction.inputs.forEach((input) => {
    psbt.addInput({
      hash: input.txId,
      index: input.vout,
      witnessUtxo: {
        script: bitcoin.address.toOutputScript(input.address),
        value: input.value,
      },
    });
  });
  transaction.outputs.forEach((output) => {
    psbt.addOutput({
      address: output.address,
      value: output.amount,
    });
  });

  // Finalize all inputs before extracting the transaction
  psbt.finalizeAllInputs();

  const tx = psbt.extractTransaction();
  const txHex = tx.toHex();
  const hash = bitcoin.crypto.hash256(Buffer.from(txHex, 'hex'));
  return hash;
}

export default hashTransaction;
