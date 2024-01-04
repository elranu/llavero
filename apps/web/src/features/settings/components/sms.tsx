import { Input } from '@/shared/components/ui/input';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { createSmsSettings, verifySmsSettings, isSMSSetup, verifySmsSettings2 } from '@/shared/services/user.service';
import { Button } from '@/shared/components/ui/button';

const SMS: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [showCode, setShowCode] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [firstVerificationDone, setFirstVerificationDone ] = useState(false);
    const { data } = useSession();

    
    useEffect(() => {
        const token = (data as any).accessToken;

        const checkSMS = async () => {
            const phoneVerified = await isSMSSetup();
            if (phoneVerified && phoneVerified.isVerified) {
                setPhoneNumber(phoneVerified.phoneNumber);
                setIsVerified(true);
            }
        };
        checkSMS();

    }, [data, data?.user?.email]);

    const handleSave = async () => {
        try {
            const token = (data as any).accessToken;
            if (phoneNumber.trim() === '') {
                setErrorMessage('Phone number cannot be empty');
                return;
            }

            await createSmsSettings(phoneNumber);

            setIsVerified(false);
            setShowCode(true);
        } catch (error: any) {
            setErrorMessage(error.message);
            setIsVerified(false);
        }
    };

    const handleVerify = async () => {
        try {
            if (code.trim() === '') {
                setErrorMessage('Verification code cannot be empty');
                return;
            }

            if(!firstVerificationDone) {
                await verifySmsSettings(phoneNumber, code);
                setFirstVerificationDone(true);
            }
            else {
                await verifySmsSettings2(phoneNumber, code);
                setIsVerified(true);
                setShowCode(false);
            }

            setErrorMessage('');
            setCode('');
        } catch (error: any) {
            setErrorMessage(error.message);
            setIsVerified(false);
        }
    };

    const handleModify = () => {
        setIsVerified(false);
    };

    return (
        <div>
            {isVerified ? (
                <>
                    <div>{phoneNumber}</div>
                    <Button onClick={handleModify}>Modify SMS</Button>
                </>
            ) : (
                <>
                    <Input
                        type="tel"
                        placeholder='+1 123 456 7890'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button onClick={handleSave}>Save</Button>
                </>
            )}

            {showCode &&
                <>
                    <Input
                        type="number"
                        value={code}
                        placeholder='Enter code'
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <Button onClick={handleVerify}>Verify</Button>
                </>
            }

            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
};

export default SMS;
