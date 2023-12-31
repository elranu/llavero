import { NextRequest, NextResponse } from 'next/server';
import createLogger from '@/shared/utils/logger';
import { AUTH_OPTIONS } from '@/shared/utils/auth';
import { getServerSession } from 'next-auth';
import personalSign from '../../services/personal-sign';
import ethSendTransaction from '../../services/eth-send-tx';
import ethSignTransaction from '../../services/eth-sign-tx';
import { verifySoftwareToken, isMFARegistered } from '@/shared/utils/mfa-actions';

const logger = createLogger('wallet-endpoint');

type WalletAction = 'personal-sign' | 'eth-send-transaction' | 'eth-sign-transaction';

export async function POST(
  request: NextRequest,
  { params }: { params: { address: string; action: WalletAction } },
) {
  try {
    const session = await getServerSession(AUTH_OPTIONS);
    if (!session || !session?.user?.email)
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const { address, action } = params || {};
    const body: { transaction: string; chainId: string; message: string; mfaCode: string } =
      await request.json();
    const { transaction, chainId, message, mfaCode } = body || {};

    const token = (session as any).accessToken;
    if (await isMFARegistered(token)) {
      if (!(await verifySoftwareToken(mfaCode, token))) {
        return NextResponse.json({ message: 'Invalid MFA code' }, { status: 401 });
      }
    }

    switch (action) {
      case 'personal-sign':
        return NextResponse.json(await personalSign(session?.user?.email, address, message));

      case 'eth-send-transaction':
        return NextResponse.json(
          await ethSendTransaction(session?.user?.email, address, transaction, chainId),
        );

      case 'eth-sign-transaction':
        return NextResponse.json(
          await ethSignTransaction(session?.user?.email, address, transaction, chainId),
        );

      default:
        console.log('default action:', action);
        throw new Error('Invalid Wallet action for POST HTTP method');
    }
  } catch (error) {
    logger.error(error);
    return NextResponse.error();
  }
}

/**
 * endpoints
 * /wallet/list
 * /wallet/create
 * /wallet/[addr]/update
 * /wallet/[addr]/get
 * /wallet/[addr]/delete
 * /wallet/[addr]/personalSign
 * /wallet/[addr]/ethSendTransaction
 * /wallet/[addr]/ethSignTransaction
 * @param
 * @returns
 */
