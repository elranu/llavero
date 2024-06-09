import { signWithKMS } from '../src/signWithKMS';
import { KMSClient, SignCommand } from '@aws-sdk/client-kms';

jest.mock('@aws-sdk/client-kms');

describe('signWithKMS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sign the hash successfully', async () => {
    const mockSign = jest.fn().mockResolvedValue({
      Signature: new Uint8Array([
        48, 70, 2, 33, 0, 198, 182, 193, 165, 237, 155, 100, 42, 127, 152, 211, 74, 212, 219, 97,
        169, 230, 100, 69, 24, 29, 143, 217, 139, 53, 105, 192, 201, 94, 163, 117, 196, 2, 33, 0,
        238, 251, 67, 103, 15, 99, 189, 233, 88, 130, 29, 248, 252, 151, 166, 198, 181, 223, 4, 122,
        143, 125, 54, 10, 162, 90, 44, 213, 173, 246, 211, 191,
      ]),
    });

    KMSClient.prototype.send = mockSign;

    // Use a valid 32-byte SHA-256 hash
    const hash = Buffer.from(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'hex',
    );
    let signature;
    try {
      signature = await signWithKMS(hash);
    } catch (error) {
      console.error('Error in test case "should sign the hash successfully":', error);
      throw error;
    }

    expect(signature).toBeInstanceOf(Buffer);
    expect(signature.length).toBeGreaterThan(0); // Check that the signature is not empty
    expect(signature[0]).toBe(48); // Check that the signature starts with the DER sequence identifier
    expect(mockSign).toHaveBeenCalledWith(expect.any(SignCommand));
  });

  it('should handle AWS KMS errors', async () => {
    const mockSign = jest.fn().mockRejectedValue(new Error('KMS error'));

    KMSClient.prototype.send = mockSign;

    // Use a valid 32-byte SHA-256 hash
    const hash = Buffer.from(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'hex',
    );

    await expect(signWithKMS(hash)).rejects.toThrow('KMS error');
    expect(mockSign).toHaveBeenCalledWith(expect.any(SignCommand));
  });
});
