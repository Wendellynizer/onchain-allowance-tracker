'use client';

import { useEffect, useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

export default function WalletStatus() {
  const [isWorldApp, setIsWorldApp] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setIsWorldApp(MiniKit.isInstalled());
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div>
            <p className="font-medium text-gray-900">
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </p>
            <p className="text-sm text-gray-500">
              {isWorldApp ? 'Inside World App' : 'Inside Ohara'}
            </p>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Wallet />
        </div>
      </div>
      
      {isConnected && address && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Address: {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </p>
        </div>
      )}
    </div>
  );
}