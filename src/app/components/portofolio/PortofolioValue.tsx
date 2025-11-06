"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import DanaChart from "../dashboard/DanaChart";
import { ArrowUp } from "react-feather";
import { getCampaignsByCreator, getInvestmentsByUser } from "@/app/utils/localStorage";

const PortofolioValue = () => {
  const { authenticated, user } = usePrivy();
  const [totalValue, setTotalValue] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);

  useEffect(() => {
    if (authenticated && user?.id) {
      // Get all campaigns created by this user
      const campaigns = getCampaignsByCreator(user.id);
      
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
  const mockTotalValue = 20000000;
  const mockGrowthPercentage = 30;
  const displayValue = authenticated && totalValue > 0 ? totalValue : mockTotalValue;
  const displayGrowth = authenticated && growthPercentage > 0 ? growthPercentage : mockGrowthPercentage;

  return (
    <div className="w-[38.194vw] flex flex-col justify-between bg-black rounded-[1.042vw] p-[1.883vw]">
      <div className="flex flex-col gap-[0.111vw]">
        <p className="text-[1.333vw] font-jakarta text-white">Total Value</p>
        <div className="w-full flex flex-row gap-[1.333vw]">
          <p className="text-[2.222vw] text-white font-[700] font-jakarta">
            ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex flex-row gap-[0.556vw] items-center">
            <ArrowUp color="white" size={16} />
            <p className="text-[#72FFC7] font-bold font-inter">{displayGrowth}%</p>
          </div>
        </div>
      </div>
      <div>
        <DanaChart variant="studio" />
      </div>
    </div>
  );
};

export default PortofolioValue;
