"use client";
import DanaChart from "./DanaChart";
import { ArrowUp } from "react-feather";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useBalance } from 'wagmi';
import { formatEther } from 'viem';

const TotalDana = () => {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  // Fetch balance from the wallet
  const { data: balance } = useBalance({
    address: wallet?.address as `0x${string}` | undefined,
  });

  // Mock data for total value
  const mockTotalValue = 12450.75;
  const mockGrowthPercentage = 30;
  const mockEthAmount = 4.2156;

  return (
    <div className="w-[38.194vw] flex flex-col justify-between bg-black rounded-[1.042vw] p-[1.883vw] border-2 border-[var(--color-coklat-jati)]/30 shadow-wayang relative overflow-hidden">
      {/* Batik Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url('/assets/patterns/songket-pattern.svg')",
          backgroundSize: "200px",
          backgroundRepeat: "repeat"
        }}
      />
      <div className="flex flex-col gap-[0.111vw] relative z-[1]">
        <p className="text-[1.333vw] font-jakarta text-[var(--color-emas-nusantara)]">Total Nilai</p>
        <div className="w-full flex flex-row gap-[1.333vw]">
          <p className="text-[2.222vw] text-white font-[700] font-jakarta">
            ${mockTotalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex flex-col gap-[0.111vw]">
            <div className="flex flex-row gap-[0.556vw] items-center">
              <ArrowUp color="white" size={16} />
              <p className="text-[#72FFC7] font-bold font-inter">{mockGrowthPercentage}%</p>
            </div>
            <p className="text-[0.889vw] text-white/60 font-jakarta">
              {authenticated && wallet && balance ? (
                `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}`
              ) : (
                `${mockEthAmount.toFixed(4)} ETH`
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-[1]">
        <DanaChart />
      </div>
    </div>
  );
};

export default TotalDana;
