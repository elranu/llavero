import * as bitcoin from 'bitcoinjs-lib';
import signWithKMS from './signWithKMS';

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

export interface Transaction {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

async function signTransaction(
  transaction: string,
  publicKey: string,
): Promise<{ signature: string; publicKey: string; txHex: string }> {
  try {
    console.log('Starting signTransaction function'); // Log function start

    const hash = bitcoin.crypto.hash256(Buffer.from(transaction, 'hex'));
    console.log('Hash generated:', hash.toString('hex')); // Log the generated hash

    console.log('Calling signWithKMS function'); // Log before calling signWithKMS
    let signatureBuffer = await signWithKMS(hash);
    console.log('Received signature from signWithKMS'); // Log after receiving signature

    // Log the raw signature returned from AWS KMS
    console.log('Raw signature from AWS KMS:', signatureBuffer);
    console.log('Raw signature length:', signatureBuffer.length);

    // Extract r and s values from the DER-encoded signature
    const rLength = signatureBuffer[3];
    const r = signatureBuffer.slice(4, 4 + rLength);
    const s = signatureBuffer.slice(6 + rLength);

    // Ensure r and s are 32 bytes each
    const rPadded = r.length < 32 ? Buffer.concat([Buffer.alloc(32 - r.length, 0), r]) : r;
    const sPadded = s.length < 32 ? Buffer.concat([Buffer.alloc(32 - s.length, 0), s]) : s;

    // Combine r and s to form the final signature
    let finalSignature = Buffer.concat([rPadded, sPadded]);

    // Log the final signature
    console.log('Final signature:', finalSignature);
    console.log('Final signature length:', finalSignature.length);

    // Ensure the final signature is 64 bytes long
    if (finalSignature.length !== 64) {
      // If the final signature is 65 bytes, trim the last byte
      if (finalSignature.length === 65) {
        finalSignature = finalSignature.slice(0, 64);
      } else if (finalSignature.length === 66) {
        // If the final signature is 66 bytes, trim the first and last byte
        finalSignature = finalSignature.slice(1, 65);
      } else {
        throw new Error(
          `Expected signature length of 64 bytes, got ${finalSignature.length} bytes`,
        );
      }
    }

    // Create a Psbt object and add inputs and outputs
    const psbt = new bitcoin.Psbt();
    const transactionObj: Transaction = JSON.parse(transaction);
    transactionObj.inputs.forEach((input) => {
      const script = bitcoin.address.toOutputScript(input.address);
      console.log('Generated script:', script.toString('hex')); // Log the generated script
      psbt.addInput({
        hash: input.txId,
        index: input.vout,
        witnessUtxo: {
          script,
          value: input.value,
        },
      });
    });
    transactionObj.outputs.forEach((output) => {
      psbt.addOutput({
        address: output.address,
        value: output.amount,
      });
    });

    // Log the state of the Psbt object before finalizing
    console.log('Psbt object before finalizing:', psbt.data.inputs);

    // Log the witnessUtxo and partialSig data for input #0
    console.log('witnessUtxo for input #0:', psbt.data.inputs[0].witnessUtxo);
    console.log('partialSig for input #0:', psbt.data.inputs[0].partialSig);

    // Log the Buffer objects for pubkey and signature
    const pubkeyBuffer = Buffer.from(publicKey, 'hex');
    signatureBuffer = finalSignature;
    console.log('pubkey Buffer:', pubkeyBuffer);
    console.log('signature Buffer:', signatureBuffer);

    // Ensure the signature is in the correct DER format and of the expected length
    if (signatureBuffer.length > 64) {
      signatureBuffer = signatureBuffer.slice(0, 64);
    }

    // Ensure pubkey and signature are Buffers
    if (!Buffer.isBuffer(pubkeyBuffer) || !Buffer.isBuffer(signatureBuffer)) {
      throw new Error('pubkey and signature must be Buffers');
    }

    // Log the structure of pubkey and signature before adding to partialSig
    console.log('pubkeyBuffer structure:', pubkeyBuffer);
    console.log('signatureBuffer structure:', signatureBuffer);

    psbt.updateInput(0, {
      partialSig: [
        {
          pubkey: pubkeyBuffer,
          signature: signatureBuffer,
        },
      ],
    });

    // Log the state of the Psbt object after adding partialSig and before finalizing
    console.log('Psbt object after adding partialSig:', psbt.data.inputs);

    // Finalize all inputs and extract the transaction hex
    console.log('Finalizing all inputs'); // Log before finalizing inputs
    psbt.finalizeAllInputs();
    console.log('Inputs finalized'); // Log after finalizing inputs

    const txHex = psbt.extractTransaction().toHex();
    console.log('Transaction hex extracted:', txHex); // Log the extracted transaction hex

    return { signature: finalSignature.toString('hex'), publicKey, txHex };
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw new Error('Failed to sign transaction');
  }
}

export default signTransaction;
