"use client";

import { useState, useEffect } from "react";
import { usePrivy } from '@privy-io/react-auth';
import ContributorPath, { ContributorPathProps } from "@/app/components/user/ContributorPath";
import InvestCard, { InvestCardProps } from "@/app/components/user/InvestCard";
import { getActiveCampaigns, getUserProgressById, updateUserProgress } from "@/app/utils/localStorage";

// Mock campaigns for demo purposes
const mockCampaigns: InvestCardProps[] = [
  {
    campaignId: "mock-1",
    musicTitle: "Mejikuhibiniu",
    musicArtist: "Tenxi",
    coverImageUrl: "https://i.scdn.co/image/ab67616d00001e024d265eb3c717ab45470fdc8c",
    fundedPercentage: 75,
    riskLevel: "Low Risk",
    investorCount: 45,
    timeRemaining: "2d 0h",
    targetListeners: 15000,
    genre: "Indie Pop",
    goalAmount: 5000,
    raisedAmount: 3750,
    royaltyPercentage: 500, // 5%
  },
  {
    campaignId: "mock-2",
    musicTitle: "Pikiran yang matang",
    musicArtist: "Perunggu",
    coverImageUrl: "https://i.scdn.co/image/ab67616d00001e0292aaadd0be503d89c082ecbb",
    fundedPercentage: 62,
    riskLevel: "Medium Risk",
    investorCount: 32,
    timeRemaining: "1d 12h",
    targetListeners: 12500,
    genre: "Alternative Rock",
    goalAmount: 3000,
    raisedAmount: 1860,
    royaltyPercentage: 400, // 4%
  },
  {
    campaignId: "mock-3",
    musicTitle: "Alamak",
    musicArtist: "Rizky Febian, Adrian Khalif",
    coverImageUrl: "https://i.scdn.co/image/ab67616d00001e0201b9750a33d771645d7f043a",
    fundedPercentage: 88,
    riskLevel: "Low Risk",
    investorCount: 67,
    timeRemaining: "18h",
    targetListeners: 20000,
    genre: "Pop",
    goalAmount: 8000,
    raisedAmount: 7040,
    royaltyPercentage: 600, // 6%
  },
];

const InvestPage = () => {
  const { authenticated, user } = usePrivy();
  const [campaigns, setCampaigns] = useState<InvestCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<ContributorPathProps>({
    currentLevel: "Bronze Investor",
    currentDescription: "0 investments completed",
    progressPercentage: 0,
    finalGoal: "Diamond Investor",
  });

  // Load campaigns from localStorage
  useEffect(() => {
    const loadCampaigns = () => {
      try {
        const activeCampaigns = getActiveCampaigns();

        // Transform localStorage campaigns to InvestCardProps
        const transformedCampaigns: InvestCardProps[] = activeCampaigns.map((campaign) => {
          const goal = parseFloat(campaign.goal);
          const raised = parseFloat(campaign.currentAmount);
          const fundedPercentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

          // Calculate time remaining
          const deadline = new Date(campaign.deadline);
          const now = new Date();
          const timeLeft = deadline.getTime() - now.getTime();
          const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

          let timeRemaining = "Expired";
          if (timeLeft > 0) {
            if (daysLeft > 0) {
              timeRemaining = `${daysLeft}d ${hoursLeft}h`;
            } else {
              timeRemaining = `${hoursLeft}h`;
            }
          }

          // Determine risk level based on funded percentage and time remaining
          let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Medium Risk";
          if (fundedPercentage > 70 && timeLeft > 2 * 24 * 60 * 60 * 1000) {
            riskLevel = "Low Risk";
          } else if (fundedPercentage < 30 || timeLeft < 24 * 60 * 60 * 1000) {
            riskLevel = "High Risk";
          }

          return {
            campaignId: campaign.id,
            musicTitle: campaign.musicTitle,
            musicArtist: "Creator", // You can enhance this by joining with music data
            coverImageUrl: undefined,
            fundedPercentage: Math.round(fundedPercentage),
            riskLevel,
            investorCount: campaign.backers,
            timeRemaining,
            targetListeners: Math.round(goal * 10), // Estimate based on funding goal
            genre: "Various",
            goalAmount: goal,
            raisedAmount: raised,
            royaltyPercentage: campaign.royaltyPercentage,
            description: campaign.description,
          };
        });

        // Combine: localStorage campaigns first, then mock campaigns
        const allCampaigns = [...transformedCampaigns, ...mockCampaigns];
        setCampaigns(allCampaigns);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        // Fallback to mock campaigns if error
        setCampaigns(mockCampaigns);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  // Load user progress
  useEffect(() => {
    if (authenticated && user?.id) {
      const progress = getUserProgressById(user.id);
      if (progress) {
        setUserProgress({
          currentLevel: progress.level,
          currentDescription: `${progress.totalInvestments} investments completed`,
          progressPercentage: progress.progressPercentage,
          finalGoal: "Diamond Investor",
        });
      }
    }
  }, [authenticated, user]);

  // Refresh campaigns after investment
  const handleInvestmentSuccess = () => {
    // Reload campaigns
    const activeCampaigns = getActiveCampaigns();
    const transformedCampaigns: InvestCardProps[] = activeCampaigns.map((campaign) => {
      const goal = parseFloat(campaign.goal);
      const raised = parseFloat(campaign.currentAmount);
      const fundedPercentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

      const deadline = new Date(campaign.deadline);
      const now = new Date();
      const timeLeft = deadline.getTime() - now.getTime();
      const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      let timeRemaining = "Expired";
      if (timeLeft > 0) {
        if (daysLeft > 0) {
          timeRemaining = `${daysLeft}d ${hoursLeft}h`;
        } else {
          timeRemaining = `${hoursLeft}h`;
        }
      }

      let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" = "Medium Risk";
      if (fundedPercentage > 70 && timeLeft > 2 * 24 * 60 * 60 * 1000) {
        riskLevel = "Low Risk";
      } else if (fundedPercentage < 30 || timeLeft < 24 * 60 * 60 * 1000) {
        riskLevel = "High Risk";
      }

      return {
        campaignId: campaign.id,
        musicTitle: campaign.musicTitle,
        musicArtist: "Creator",
        coverImageUrl: undefined,
        fundedPercentage: Math.round(fundedPercentage),
        riskLevel,
        investorCount: campaign.backers,
        timeRemaining,
        targetListeners: Math.round(goal * 10),
        genre: "Various",
        goalAmount: goal,
        raisedAmount: raised,
        royaltyPercentage: campaign.royaltyPercentage,
        description: campaign.description,
      };
    });

    // Combine with mock campaigns
    const allCampaigns = [...transformedCampaigns, ...mockCampaigns];
    setCampaigns(allCampaigns);

    // Update user progress
    if (authenticated && user?.id) {
      const progress = updateUserProgress(user.id, "User");
      setUserProgress({
        currentLevel: progress.level,
        currentDescription: `${progress.totalInvestments} investments completed`,
        progressPercentage: progress.progressPercentage,
        finalGoal: "Diamond Investor",
      });
    }
  };

  return (
    <section className="w-full flex flex-col bg-black gap-[1.667vw] relative">
      <div className="w-full flex flex-row justify-between relative z-[1]">
        <p className="font-jakarta font-bold text-[var(--color-emas-nusantara)] text-[1.667vw]">
          Selalu Dukung Artis Anda
        </p>
      </div>
      <div className="relative z-[1]">
        <ContributorPath {...userProgress} />
      </div>
      <div className="flex flex-col w-full p-[1.111vw] gap-[0.667vw] relative z-[1]">
        <p className="font-jakarta font-bold text-[var(--color-emas-nusantara)] text-[1.389vw]">
          Pool Pendanaan Aktif
        </p>

        {isLoading ? (
          <p className="text-[var(--color-krem-lontar)] font-jakarta text-center py-[2vw]">Memuat kampanye...</p>
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <InvestCard
              key={campaign.campaignId}
              {...campaign}
              onInvestSuccess={handleInvestmentSuccess}
            />
          ))
        ) : (
          <div className="text-center py-[2vw]">
            <p className="text-[var(--color-krem-lontar)] font-jakarta text-[1.111vw]">Tidak ada pool pendanaan aktif saat ini</p>
            <p className="text-[var(--color-krem-lontar)]/70 font-jakarta text-[0.833vw] mt-[0.556vw]">
              Creator dapat membuat pool pendanaan di halaman Dashboard mereka
            </p>
          </div>
        )}

        <div className="flex flex-row justify-between"></div>
      </div>
    </section>
  );
};

export default InvestPage;
