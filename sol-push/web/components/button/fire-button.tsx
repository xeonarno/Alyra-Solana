'use client';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {
    useGetBalance,
    useGetSignatures,
    useGetTokenAccounts,
    useRequestAirdrop,
    useTransferSol,
} from '../account/account-data-access';

const handleClick = () => {
    alert('Button clicked!');
  };

export function FireButton({ address }: { address: PublicKey }) {
    const query = useGetBalance({ address });
console.log(query)
    return (
        <div className="flex items-center justify-center min-h-screen ">
            <button
                onClick={handleClick}
                className="px-8 py-4 bg-blue-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300"
            >
                Play now
            </button>
        </div>
    );
}