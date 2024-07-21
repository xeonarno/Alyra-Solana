'use client';

import { PublicKey } from '@solana/web3.js';
import { FireButton } from '../button/fire-button';
import { AppHero } from '../ui/ui-layout';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const links: { label: string; href: string }[] = [
    { label: 'Solana Docs', href: 'https://docs.solana.com/' },
    { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
    { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
    {
        label: 'Solana Stack Overflow',
        href: 'https://solana.stackexchange.com/',
    },
    {
        label: 'Solana Developers GitHub',
        href: 'https://github.com/solana-developers/',
    },
];

export default function DashboardFeature() {
    const params = useParams();
    const { publicKey, connected } = useWallet();
    
    return (
        <div>
            <FireButton address={publicKey!} />
        </div>
    );
}
