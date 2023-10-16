import { EnvVars } from '../../appPreload';
import { useEffect, useState } from 'react';

import * as React from 'react';

interface Props {
    accessKeyId: string;
    secretAccessKey: string;
}

export function AwsInstall({ accessKeyId, secretAccessKey }: Props) {
    const [enVars, setEnVars] = useState<EnvVars>();
    const [loading, setLoading] = useState<boolean>(true);
    const [regions, setRegions] = useState<string[]>();
    const [selectedRegion, setSelectedRegion] = useState('');

    useEffect(() => {
        async function init(accessKeyId: string, secretAccessKey: string): Promise<void> {
            await getuserInfo(accessKeyId, secretAccessKey);
            await getRegions();
            setLoading(false);
        }

        init(accessKeyId, secretAccessKey);
    }, []);


    async function getuserInfo(accessKeyId: string, secretAccessKey: string): Promise<void> {
        if (!accessKeyId || !secretAccessKey) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const envVars: EnvVars = await (window as any).setCredentials(accessKeyId, secretAccessKey);
        setEnVars(envVars);
    }

    async function getRegions(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any 
        const regions = await (window as any).getAllRegions();
        setRegions(regions);
    }

    async function setRegion(region: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any 
        await (window as any).setRegion(region);
    }

    async function bootstrapCdk(account: string, region: string): Promise<void> { 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any 
        await (window as any).bootstrapCdk(account, region);
    }

    async function install(): Promise<void> {
        console.log('installing...', selectedRegion);
        setRegion(selectedRegion);
        console.log('bootstraping CDK', selectedRegion);
        await bootstrapCdk(enVars.AWS_ACCOUNT_ID, selectedRegion);
    }

    return (
        <div>
            {loading ? (
                <div className='loading'> Loading...</div>
            ) : (
                <div className='aws-install'>
                    <div className='aws-install__title'>AWS Install</div>
                    <div className='aws-install__content'>
                        <div className='aws-install__content__item'>
                            <div className='aws-install__content__item__title'>AWS Account ID</div>
                            <div className='aws-install__content__item__value'>{enVars?.AWS_ACCOUNT_ID}</div>
                        </div>
                        <div className='aws-install__content__item'>
                            <div className='aws-install__content__item__title'>AWS Identity</div>
                            <div className='aws-install__content__item__value'>{enVars?.IDENTITY}</div>
                        </div>
                        <div className='aws-install__content__item'>
                            <div className='aws-install__content__item__title'>AWS User ID</div>
                            <div className='aws-install__content__item__value'>{enVars?.AWsUserId}</div>
                        </div>
                    </div>
                    <div className='aws-install__title'>AWS Regions</div>
                    <div className='aws-install__content'>
                        <select value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)} 
                        className='aws-install__content__item__value' key="awsRegions">
                            {regions?.map((region) => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={install}> INSTALL </button>
                </div>
            )}
        </div>);
}


