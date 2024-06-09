import axios from 'axios';
import { createSignedTransaction } from '../src/createSignedTransaction';
import { hashTransaction } from '../src/hashTransaction';
import { signWithKMS } from '../src/signWithKMS';
import { verifyTransaction } from '../src/verifyTransaction';

// Ensure environment variables are set
const testnetAddress = process.env.TESTNET_ADDRESS;
const apiKey = process.env.CHAINSTACK_API_KEY;
const publicKey = process.env.PUBLIC_KEY;

if (!testnetAddress || !apiKey || !publicKey) {
  throw new Error(
    'Environment variables TESTNET_ADDRESS, CHAINSTACK_API_KEY, and PUBLIC_KEY must be set',
  );
}

// Replace with the desired testnet chain
const chain = 'sepolia';

// API URL for the Chainstack Faucet
const apiUrl = `https://api.chainstack.com/v1/faucet/${chain}`;

const requestTestnetTokens = async () => {
  console.log(`Sending faucet request for address ${testnetAddress}`);
  try {
    const response = await axios.post(
      apiUrl,
      { address: testnetAddress },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('API call successful:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error making API call:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

describe('Bitcoin Testnet Transaction', () => {
  it('should send a transaction to the same address on a Bitcoin testnet and verify it', async () => {
    // Request testnet tokens
    await requestTestnetTokens();

    // Create a dummy transaction
    const transaction = {
      inputs: [
        {
          prevTxHash: 'dummy-txid',
          outputIndex: 0,
          scriptSig: '',
          sequence: 0xffffffff,
        },
      ],
      outputs: [
        {
          value: 1000, // Amount in satoshis
          scriptPubKey: testnetAddress,
        },
      ],
      version: 1,
      locktime: 0,
    };

    // Hash the transaction
    const hash = hashTransaction(transaction);

    // Sign the transaction with AWS KMS
    await signWithKMS(hash);

    // Create the signed transaction
    const signedTxHex = await createSignedTransaction(transaction, publicKey);

    // Verify the transaction
    const isValid = verifyTransaction(signedTxHex);

    // Assert that the transaction is valid
    expect(isValid).toBe(true);
  });
});
