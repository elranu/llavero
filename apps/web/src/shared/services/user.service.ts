export async function createSmsSettings(phoneNumber: string) {
    try {
        const response = await fetch('/api/settings/create-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ smsSettings: { phoneNumber } }),
        });

        if (!response.ok) {
            throw new Error('Failed to create SMS settings');
        }

        // Handle the response here
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

export async function isSMSSetup() {
    try {
        const response = await fetch('/api/settings/is-sms-setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error('Failed to create SMS settings');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}


export async function verifySmsSettings2(phoneNumber: string, code: string) {
    try {
        const response = await fetch('/api/settings/verify-sms-2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ smsSettings: { phoneNumber, code } }),
        });

        if (!response.ok) {
            throw new Error('Failed to create SMS settings');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}




export async function verifySmsSettings(phoneNumber: string, code: string) {
    try {
        const response = await fetch('/api/settings/verify-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ smsSettings: { phoneNumber, code } }),
        });

        if (!response.ok) {
            throw new Error('Failed to create SMS settings');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}


