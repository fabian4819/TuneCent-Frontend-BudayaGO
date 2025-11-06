"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { 
  getActiveCampaigns, 
  getInvestmentsByUser,
  getMusicPlayCount,
  getLocalMusic 
} from "@/app/utils/localStorage";

interface QuickStatsCardProps {
  category: string;
  categoryCount: number;
}

const QuickStats = () => {
  const { authenticated, user } = usePrivy();
  const [stats, setStats] = useState<QuickStatsCardProps[]>([
    {
      category: "Active Pools",
      categoryCount: 0,
    },
    {
      category: "Kontributor",
      categoryCount: 0,
    },
    {
      category: "Total Plays",
      categoryCount: 0,
    },
    {
      category: "Avg Funded",
      categoryCount: 0,
    },
  ]);

  useEffect(() => {
    if (authenticated && user?.id) {
      // Get active campaigns
      const campaigns = getActiveCampaigns();
      const activePools = campaigns.length;

      // Get total contributors (unique investors across all campaigns)
      const investments = getInvestmentsByUser(user.id);
      const contributors = investments.length;

      // Get total plays across all music
      const allMusic = getLocalMusic();
      const totalPlays = allMusic.reduce((sum, music) => {
        return sum + getMusicPlayCount(music.id);
      }, 0);

      // Calculate average funded percentage
      const avgFunded = campaigns.length > 0 
        ? Math.round(
            campaigns.reduce((sum, c) => {
              const funded = (parseFloat(c.currentAmount) / parseFloat(c.goal)) * 100;
              return sum + Math.min(funded, 100);
            }, 0) / campaigns.length
          )
        : 0;

      setStats([
        {
          category: "Active Pools",
          categoryCount: activePools,
        },
        {
          category: "Kontributor",
          categoryCount: contributors,
        },
        {
          category: "Total Plays",
          categoryCount: totalPlays,
        },
        {
          category: "Avg Funded",
          categoryCount: avgFunded,
        },
      ]);
    }
  }, [authenticated, user]);

  return (
    <div className="flex flex-col w-[30vw] aspect-[426/280] bg-neutral-black-base gap-[1.111vw] p-[1.111vw] justify-center">
      <div className="flex flex-row w-full justify-between">
        <p className="font-bold text-[1.389vw] text-white font-jakarta">
          Quick Stats
        </p>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 w-full aspect-[378/178] gap-[0.333vw]">
        {stats.map((dataKey) => (
          <div key={dataKey.category}>
            <div className="flex flex-col justify-center items-center bg-black w-[12.778vw] aspect-[184/81] rounded-[0.694vw] gap-[0.222vw]">
              <p className="text-white font-inter text-[0.833vw]">
                {dataKey.category}
              </p>
              <p className="text-white font-inter font-bold text-[1.667vw]">
                {dataKey.categoryCount}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className=""></div>
    </div>
  );
};

export default QuickStats;
