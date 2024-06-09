import axios from 'axios';

// Use environment variables for the testnet address and Chainstack API key
const testnetAddress = process.env.TESTNET_ADDRESS;
const apiKey = process.env.CHAINSTACK_API_KEY;

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
    console.error('Error making API call:', error.response.data);
  }
};

// Make the first API call immediately
requestTestnetTokens();
