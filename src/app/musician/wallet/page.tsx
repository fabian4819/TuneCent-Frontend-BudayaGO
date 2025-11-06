"use client";
import HeroTransaction from "@/app/components/wallet/HeroTransaction";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Copy, ExternalLink } from 'react-feather';
import { useState } from 'react';

const WalletPage = () => {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!authenticated) {
    return (
      <div className="w-full flex flex-col bg-black gap-[2.222vw] items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-[1.111vw]">
          <p className="text-white font-jakarta font-bold text-[1.667vw]">
            Connect Your Wallet
          </p>
          <p className="text-white/60 font-jakarta text-[1.111vw]">
            Please connect your wallet to view your smart contract audit overview
          </p>
          <button
            onClick={login}
            className="mt-[1.111vw] px-[2vw] py-[1vw] bg-gradient-to-r from-[#8B609B] to-[#302135] rounded-[0.5vw] text-white font-jakarta font-medium text-[1.111vw] hover:opacity-80 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-black gap-[2.222vw]">
      {/* Wallet Info Header */}
      {wallet && (
        <div className="bg-gradient-to-r from-[#8B609B]/20 to-[#302135]/20 rounded-[1.042vw] p-[1.667vw] border border-white/10">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-[0.556vw]">
              <p className="text-white/60 font-jakarta text-[0.889vw]">
                Connected Wallet
              </p>
              <div className="flex flex-row items-center gap-[0.833vw]">
                <p className="text-white font-jakarta font-bold text-[1.333vw]">
                  {formatAddress(wallet.address)}
                </p>
                <button
                  onClick={handleCopyAddress}
                  className="p-[0.417vw] hover:bg-white/10 rounded-[0.278vw] transition-colors"
                  title="Copy address"
                >
                  <Copy color="white" size={16} />
                </button>
                <a
                  href={`https://etherscan.io/address/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-[0.417vw] hover:bg-white/10 rounded-[0.278vw] transition-colors"
                  title="View on Etherscan"
                >
                  <ExternalLink color="white" size={16} />
                </a>
              </div>
              {copied && (
                <p className="text-[#72FFC7] font-jakarta text-[0.778vw]">
                  Address copied!
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-[0.278vw]">
              <p className="text-white/60 font-jakarta text-[0.889vw]">
                Wallet Type
              </p>
              <p className="text-white font-jakarta font-medium text-[1.111vw]">
                {wallet.walletClientType === 'privy' ? 'Embedded Wallet' : 'External Wallet'}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-white font-jakarta font-bold text-[1.667vw]">
        Smart Contract Audit Overview
      </p>
      <HeroTransaction />
    </div>
  );
};

export default WalletPage;
