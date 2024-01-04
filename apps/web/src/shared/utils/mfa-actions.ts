import { MFAAssociateResponse } from '@/models/user-settings.models';
import {
  CognitoIdentityProviderClient,
  AssociateSoftwareTokenCommand,
  SetUserMFAPreferenceCommand,
  VerifySoftwareTokenCommand,
  GetUserCommand,
  UpdateUserAttributesCommand,
  GetUserAttributeVerificationCodeCommand,
  VerifyUserAttributeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  SNSClient,
  CreateSMSSandboxPhoneNumberCommand,
  VerifySMSSandboxPhoneNumberCommand,
  ListSMSSandboxPhoneNumbersCommand,
  SMSSandboxPhoneNumberVerificationStatus,
} from '@aws-sdk/client-sns';

export const associateSoftwareToken = async (
  accessToken?: string,
  session?: string,
): Promise<MFAAssociateResponse> => {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

  const command = new AssociateSoftwareTokenCommand({
    AccessToken: accessToken,
    Session: session,
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error('Error associating software token:', error);
    return {}; //SecretCode: "", Session: ""
  }
};

export const setEnableMFA = async (accessToken: string) => {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

  const command = new SetUserMFAPreferenceCommand({
    AccessToken: accessToken,
    SMSMfaSettings: {
      Enabled: true,
      PreferredMfa: false,
    },
    SoftwareTokenMfaSettings: {
      Enabled: true,
      PreferredMfa: true,
    },
  });

  try {
    const response = await client.send(command);
    console.log('User MFA preference set successfully:', response);
  } catch (error) {
    console.error('Error setting user MFA preference:', error);
  }
};

export const setEnableSMS = async (accessToken: string) => {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

  const command = new SetUserMFAPreferenceCommand({
    AccessToken: accessToken,
    SMSMfaSettings: {
      Enabled: true,
      PreferredMfa: false,
    },
    SoftwareTokenMfaSettings: {
      Enabled: true,
      PreferredMfa: true,
    },
  });

  try {
    const response = await client.send(command);
    console.log('User MFA preference set successfully:', response);
  } catch (error) {
    console.error('Error setting user MFA preference:', error);
  }
};

// export const setEnableSMS = async (accessToken: string) => {
//   const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

//   const command = new SetUserMFAPreferenceCommand({
//     AccessToken: accessToken,
//     SMSMfaSettings: {
//       Enabled: true,
//       PreferredMfa: false,
//     },
//     SoftwareTokenMfaSettings: {
//       Enabled: true,
//       PreferredMfa: true,
//     },
//   });

//   try {
//     const response = await client.send(command);
//     console.log('User MFA preference set successfully:', response);
//   } catch (error) {
//     console.error('Error setting user MFA preference:', error);
//   }
// };

export const verifySoftwareToken = async (code: string, accessToken?: string, session?: string) => {
  try {
    if (!code || code.length !== 6) throw new Error('Invalid code: code must be 6 digits');
    console.log('code', code);
    const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

    const command = new VerifySoftwareTokenCommand({
      AccessToken: accessToken,
      Session: session,
      UserCode: code,
    });

    const response = await client.send(command);
    if (response.Status !== 'SUCCESS') {
      throw new Error('Error verifying software token');
    }
    return true;
  } catch (error) {
    console.error('Error verifying software token:', error);
    return false;
  }
};

export const isMFARegistered = async (accessToken: string) => {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

  const command = new GetUserCommand({
    AccessToken: accessToken,
  });

  try {
    const response = await client.send(command);
    debugger;
    const isRegistered = response.UserMFASettingList?.some((mfa) => mfa === 'SOFTWARE_TOKEN_MFA');
    return isRegistered || false;
  } catch (error) {
    console.error('Error getting user MFA configuration:', error);
    return false;
  }
};

export const addSMSToUser = async (accessToken: string, phoneNumber: string) => {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

  const command = new UpdateUserAttributesCommand({
    AccessToken: accessToken,
    UserAttributes: [
      {
        Name: 'phone_number',
        Value: phoneNumber,
      },
    ],
  });

  const sendCode = new GetUserAttributeVerificationCodeCommand({
    AccessToken: accessToken,
    AttributeName: 'phone_number',
  });
  try {
    const response = await client.send(command);
    console.log(`SMS added to user:`, response);
    const codeResponse = await client.send(sendCode);
    console.log(`SMS verification code sent:`, codeResponse);
  } catch (error) {
    console.error(`Error adding SMS to user:`, error);
  }
};

//server-side
export const createSMSPhone = async (phoneNumber: string) => {
  const snsClient = new SNSClient({ region: process.env.NEXT_PUBLIC_REGION });
  const command = new CreateSMSSandboxPhoneNumberCommand({
    PhoneNumber: phoneNumber,
  });

  try {
    const response = await snsClient.send(command);
    console.log(`Phone number ${phoneNumber} added to SNS sandbox:`, response);
  } catch (error) {
    console.error(`Error adding phone number ${phoneNumber} to SNS sandbox:`, error);
  }
};

///server-side
export const listSandboxSMSPhoneNumbers = async () => {
  const snsClient = new SNSClient({ region: process.env.NEXT_PUBLIC_REGION });
  const command = new ListSMSSandboxPhoneNumbersCommand({});

  try {
    const response = await snsClient.send(command);
    console.log(`Phone numbers in SNS sandbox:`, response);
    return response.PhoneNumbers || [];
  } catch (error) {
    console.error(`Error listing phone numbers in SNS sandbox:`, error);
    return [];
  }
};

///server-side
export const verifySMSSandbox = async (phoneNumber: string, code: string) => {
  const snsClient = new SNSClient({ region: process.env.NEXT_PUBLIC_REGION });

  const command = new VerifySMSSandboxPhoneNumberCommand({
    PhoneNumber: phoneNumber,
    OneTimePassword: code,
  });

  try {
    const response = await snsClient.send(command);
    console.log(`Phone number ${phoneNumber} added to SNS sandbox:`, response);
  } catch (error) {
    console.error(`Error adding phone number ${phoneNumber} to SNS sandbox:`, error);
  }
};

/**
 * Cognito send code to verify phone number
 * @param accessToken
 * @returns
 */
export const sendCognitoConfirmationCode = async (accessToken: string) => {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

  // Send verification code
  const getCodeCommand = new GetUserAttributeVerificationCodeCommand({
    AccessToken: accessToken,
    AttributeName: 'phone_number',
  });

  try {
    const getCodeResponse = await client.send(getCodeCommand);
    console.log(`Verification code sent to user:`, getCodeResponse);
  } catch (error) {
    console.error(`Error sending verification code to user:`, error);
    return;
  }
};

/**
 * Cognito SMS verification code
 * @param accessToken
 * @param verificationCode
 */
export const verifyPhoneNumber = async (accessToken: string, verificationCode: string) => {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

  // Verify phone number
  const verifyCommand = new VerifyUserAttributeCommand({
    AccessToken: accessToken,
    AttributeName: 'phone_number',
    Code: verificationCode,
  });

  try {
    const verifyResponse = await client.send(verifyCommand);
    console.log(`Phone number verified for user Cognito:`, verifyResponse);
  } catch (error) {
    console.error(`Error verifying phone number for user:`, error);
  }
};

export const getUserAttributes = async (accessToken: string) => {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_REGION });

  const command = new GetUserCommand({
    AccessToken: accessToken,
  });

  try {
    const response = await client.send(command);
    return response.UserAttributes || [];
  } catch (error) {
    console.error(`Error getting user attributes:`, error);
    return [];
  }
};

///server-side
export const isPhoneNumberVerified = async (accessToken: string): Promise<string> => {
  const attributes = await getUserAttributes(accessToken);
  const phone = attributes.findLast((attr) => attr.Name === 'phone_number'); //"phone_number_verified"
  if (!phone || !phone.Value) return '';
  const list = await listSandboxSMSPhoneNumbers();
  const isVerified = list.some(
    (item: { PhoneNumber: string | undefined; Status: any }) =>
      item.PhoneNumber === phone?.Value &&
      item.Status === SMSSandboxPhoneNumberVerificationStatus.Verified,
  );
  debugger;
  return isVerified ? phone.Value : '';
};
