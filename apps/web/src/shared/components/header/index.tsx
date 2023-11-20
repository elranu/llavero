'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/shared/components/ui/container';
import Logo from '@/shared/assets/logo.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { UserCircle, Waypoints } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { WalletConnectDialog } from '@/features/wallet-connect';
import { getChainByEip155Address, getMainnetChains, getTestnetChains } from '@/data/chainsUtil';
import SettingsStore from '@/store/settingsStore';
import { useSnapshot } from 'valtio';

const links = [
  { href: '#', label: 'Edit Profile' },
  { href: '#', label: 'Account' },
  { href: '#', label: 'Change Password' },
  { href: '#', label: 'My Settings' },
];

const REDIRECT_AFTER_LOGOUT_URL = '/';

const Header = () => {
  const { network } = useSnapshot(SettingsStore.state);
  const eip155Address = `${network.namespace}:${network.chainId}`;
  const { data: session } = useSession();
  const { user } = session || {};
  const { email } = user || {};

  const handleLogout = async () => {
    await signOut({ callbackUrl: REDIRECT_AFTER_LOGOUT_URL });
  };

  return (
    <header className='px-4 xl:px-0 sm:flex sm:justify-between py-3 border-b shadow-md sticky top-0'>
      <Container>
        <div className='flex h-16 items-center justify-between w-full '>
          <div className='flex items-center justify-between w-full'>
            <div>
              <Link href='/'>
                <div className='flex gap-2 items-center'>
                  <Image src={Logo} alt='Llavero CloudWallet' width={45} height={45} />
                  <span>Llavero</span>
                </div>
              </Link>
            </div>

            {session && (
              <div className='flex gap-2 md:gap-4 items-center'>
                <WalletConnectDialog />

                <div className='min-w-[125px]'>
                  <Select
                    value={eip155Address}
                    onValueChange={(eip155Address) => {
                      SettingsStore.setNetwork(getChainByEip155Address(eip155Address));
                    }}
                  >
                    <SelectTrigger>
                      <Waypoints className='h-4 w-4 mr-2' />
                      <SelectValue placeholder='Select a network' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mainnet</SelectLabel>
                        {getMainnetChains()?.map((chain) => (
                          <SelectItem
                            key={chain.chainId}
                            value={`${chain.namespace}:${chain.chainId}`}
                          >
                            {chain.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Testnet</SelectLabel>
                        {getTestnetChains()?.map((chain) => (
                          <SelectItem
                            key={chain.chainId}
                            value={`${chain.namespace}:${chain.chainId}`}
                          >
                            {chain.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {email && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className='min-w-fit md:min-w-[200px]'>
                      <Button variant='outline'>
                        <UserCircle className='h-4 w-4 md:mr-2' />
                        <DropdownMenuLabel className='hidden md:inline'>{email}</DropdownMenuLabel>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='min-w-fit md:min-w-[200px] mr-4 md:mr-auto'>
                      {links.map(({ href, label }) => (
                        <Link key={label} href={href}>
                          <DropdownMenuItem>{label}</DropdownMenuItem>
                        </Link>
                      ))}
                      <DropdownMenuSeparator />
                      <Button variant='destructive' className='w-full' onClick={handleLogout}>
                        Log out
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };
