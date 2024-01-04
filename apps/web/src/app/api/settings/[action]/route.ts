import { NextRequest, NextResponse } from 'next/server';
import createLogger from '@/shared/utils/logger';
import { AUTH_OPTIONS } from '@/shared/utils/auth';
import { getServerSession } from 'next-auth';
import { addSMSToUser, createSMSPhone, isPhoneNumberVerified, sendCognitoConfirmationCode, verifyPhoneNumber, verifySMSSandbox } from '@/shared/utils/mfa-actions';

const logger = createLogger('settings-endpoint');

type SettingsAction = 'create-sms' | 'verify-sms' | 'is-sms-setup' | 'verify-sms-2';

export async function POST(
  request: NextRequest,
  { params }: { params: { action: SettingsAction } },
) {
  try {
    const session = await getServerSession(AUTH_OPTIONS);
    if (!session || !session?.user?.email)
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const { action } = params || {};
    const body: { smsSettings?: { phoneNumber: string; code: string } } = await request.json();
    const { smsSettings } = body || {};

    const token = (session as any).accessToken;
    
    switch (action) {
        case 'create-sms':
            if(!smsSettings?.phoneNumber) return NextResponse.json({ message: 'Missing phone number' }, { status: 400 });
            console.log('creating sms phone number:', smsSettings.phoneNumber);
            await createSMSPhone(smsSettings?.phoneNumber);
            return NextResponse.json({ message: 'SMS code sent' });
    
        case 'verify-sms':
            if(!smsSettings?.phoneNumber) return NextResponse.json({ message: 'Missing phone number' }, { status: 400 });
            if(!smsSettings?.code) return NextResponse.json({ message: 'Missing MFA code' }, { status: 400 });
            console.log('verifying sms phone number:', smsSettings.phoneNumber);
            await verifySMSSandbox(smsSettings.phoneNumber, smsSettings.code);
            console.log('adding sms phone number to user:', smsSettings.phoneNumber);
            await addSMSToUser(token, smsSettings.phoneNumber);
            await sendCognitoConfirmationCode(token);
            return NextResponse.json({ message: 'MFA code verified'});
        case 'is-sms-setup':
          const phone = await isPhoneNumberVerified(token);
          return NextResponse.json({ phoneNumber: phone, isVerified: !!phone });
        case 'verify-sms-2':
          if(!smsSettings?.phoneNumber) return NextResponse.json({ message: 'Missing phone number' }, { status: 400 });
          if(!smsSettings?.code) return NextResponse.json({ message: 'Missing MFA code' }, { status: 400 });
          console.log('verifying sms phone number cognito:', smsSettings.phoneNumber);
          await verifyPhoneNumber(smsSettings.phoneNumber, smsSettings.code);
          return NextResponse.json({ message: 'MFA code verified' });
        default:
            console.log('default action:', action);
            throw new Error('Invalid Settings action for POST HTTP method');
        }

  } catch (error) {
    logger.error(error);
    return NextResponse.error();
  }
}
