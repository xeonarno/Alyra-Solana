import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { WalletButton } from '../solana/solana-provider';

interface FireButtonProps {
  handleFire: () => void;
}

const FireButton: React.FC<FireButtonProps> = ({ handleFire }) => {
  const { connected } = useWallet();
  if(connected) {
    return (
      <button
        onClick={handleFire}
        className="bg-red-500 text-white font-bold text-3xl shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300 w-[calc(5*4ch+2*0.5rem)] h-16 flex items-center justify-center"    >
        Play
      </button>
    );
  } else {
    return <WalletButton />;
  }
  
};

export default FireButton;
