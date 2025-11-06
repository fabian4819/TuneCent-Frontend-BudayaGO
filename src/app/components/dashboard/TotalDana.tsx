"use client";
import { useState, useEffect } from "react";
import DanaChart from "./DanaChart";
import { ArrowUp } from "react-feather";
import { usePrivy } from '@privy-io/react-auth';
import { getCampaignsByCreator, getInvestmentsByUser } from "@/app/utils/localStorage";

const TotalDana = () => {
  const { authenticated, user } = usePrivy();
  const [totalValue, setTotalValue] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);

  useEffect(() => {
    if (authenticated && user?.id) {
      // Get all campaigns created by this user
      const campaigns = getCampaignsByCreator(user.id);
      setTotalCampaigns(campaigns.length);
      
      // Calculate total raised from all campaigns
      const totalRaised = campaigns.reduce((sum: number, campaign) => {
        return sum + parseFloat(campaign.currentAmount);
      }, 0);

      // Get all investments made BY this creator (as investor)
      const investments = getInvestmentsByUser(user.id);
      const totalInvested = investments.reduce((sum: number, inv) => sum + parseFloat(inv.amount), 0);

      // Total value = money raised + money invested
      const total = totalRaised + totalInvested;
      setTotalValue(total);

      // Calculate growth percentage (mock formula: based on total raised vs goal)
      if (campaigns.length > 0) {
        const totalGoal = campaigns.reduce((sum: number, c) => sum + parseFloat(c.goal), 0);
        const percentage = totalGoal > 0 ? ((totalRaised / totalGoal) * 100) : 0;
        setGrowthPercentage(Math.round(percentage));
      }
    }
  }, [authenticated, user]);

  // Mock data for fallback
  const mockTotalValue = 12450.75;
  const mockGrowthPercentage = 30;
  const displayValue = authenticated && totalValue > 0 ? totalValue : mockTotalValue;
  const displayGrowth = authenticated && growthPercentage > 0 ? growthPercentage : mockGrowthPercentage;

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
            ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex flex-col gap-[0.111vw]">
            <div className="flex flex-row gap-[0.556vw] items-center">
              <ArrowUp color="white" size={16} />
              <p className="text-[#72FFC7] font-bold font-inter">{displayGrowth}%</p>
            </div>
            <p className="text-[0.889vw] text-white/60 font-jakarta">
              {totalCampaigns > 0 ? `${totalCampaigns} kampanye aktif` : 'Belum ada kampanye'}
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
