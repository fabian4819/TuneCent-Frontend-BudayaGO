"use client";

import { useState, useEffect } from "react";
import ContributorPath, { ContributorPathProps } from "@/app/components/user/ContributorPath";
import InvestCard, { InvestCardProps } from "@/app/components/user/InvestCard";
import { useGetTotalCampaigns, useGetCampaign, CampaignStatus } from "@/app/hooks/useCrowdfundingPool";
import { listMusic, MusicData } from "@/app/services/musicApi";

// Mock data for contributor path
const contributorPathData: ContributorPathProps = {
  currentLevel: "Silver Contributor",
  currentDescription: "5 investments completed",
  progressPercentage: 65,
  finalGoal: "Diamond Contributor",
};

// Mock data for investment opportunities - similar to MusicPool DummyMusic
const InvestmentOpportunities: InvestCardProps[] = [
  {
    campaignId: 1,
    musicTitle: "Mejikuhibiniu",
    musicArtist: "Tenxi",
    coverImageUrl: "https://i.scdn.co/image/ab67616d00001e024d265eb3c717ab45470fdc8c",
    fundedPercentage: 75,
    riskLevel: "Low Risk",
    investorCount: 45,
    timeRemaining: "2d 0h",
    targetListeners: 15000,
    genre: "Indie Pop",
  },
  {
    campaignId: 2,
    musicTitle: "Pikiran yang matang",
    musicArtist: "Perunggu",
    coverImageUrl: "https://i.scdn.co/image/ab67616d00001e0292aaadd0be503d89c082ecbb",
    fundedPercentage: 62,
    riskLevel: "Medium Risk",
    investorCount: 32,
    timeRemaining: "1d 12h",
    targetListeners: 12500,
    genre: "Alternative Rock",
  },
  {
    campaignId: 3,
    musicTitle: "Alamak",
    musicArtist: "Rizky Febian, Adrian Khalif",
    coverImageUrl: "https://i.scdn.co/image/ab67616d00001e0201b9750a33d771645d7f043a",
    fundedPercentage: 88,
    riskLevel: "Low Risk",
    investorCount: 67,
    timeRemaining: "18h",
    targetListeners: 20000,
    genre: "Pop",
  },
  {
    campaignId: 4,
    musicTitle: "kids",
    musicArtist: "Hindia",
    coverImageUrl: "https://i.scdn.co/image/ab67616d00001e0205898628baab6ef07a0a4d03",
    fundedPercentage: 45,
    riskLevel: "High Risk",
    investorCount: 18,
    timeRemaining: "3d 6h",
    targetListeners: 18000,
    genre: "Indie",
  },
];

const InvestPage = () => {
  const { totalCampaigns } = useGetTotalCampaigns();
  const [campaigns, setCampaigns] = useState<InvestCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!totalCampaigns || totalCampaigns === 0) {
        // If no campaigns, show mock data for demo
        setCampaigns(InvestmentOpportunities.map((inv, i) => ({ ...inv, campaignId: i + 1 })));
        setIsLoading(false);
        return;
      }

      try {
        // Fetch all music data first
        const musicResponse = await listMusic({ limit: 100 });
        const musicMap = new Map(
          musicResponse.data.map((music) => [music.token_id, music])
        );

        // For now, show mock data with campaign IDs
        // TODO: Implement proper campaign fetching using useGetCampaign hook for each campaign
        const campaignsWithIds = InvestmentOpportunities.slice(0, totalCampaigns).map((inv, i) => ({
          ...inv,
          campaignId: i + 1,
        }));

        setCampaigns(campaignsWithIds);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        // Fallback to mock data
        setCampaigns(InvestmentOpportunities.map((inv, i) => ({ ...inv, campaignId: i + 1 })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [totalCampaigns]);

  return (
    <section className="w-[75vw] flex flex-col bg-black gap-[1.667vw] relative">
      {/* Animated Top & Bottom Pattern Borders */}
      <div className="batik-top-border" />
      <div className="batik-bottom-border" />

      {/* Animated Corner Patterns - Stay in Corners */}
      <div className="batik-corner-pattern batik-corner-top-left" />
      <div className="batik-corner-pattern batik-corner-top-right" />
      <div className="batik-corner-pattern batik-corner-bottom-left" />
      <div className="batik-corner-pattern batik-corner-bottom-right" />

      {/* Animated Side Borders */}
      <div className="batik-side-border batik-left-border" />
      <div className="batik-side-border batik-right-border" />

      {/* Floating Accent Patterns - Small Corner Accents */}
      <div className="batik-floating-accent batik-accent-tl" />
      <div className="batik-floating-accent batik-accent-tr" />
      <div className="batik-floating-accent batik-accent-bl" />
      <div className="batik-floating-accent batik-accent-br" />

      <div className="w-full flex flex-row justify-between relative z-[1]">
        <p className="font-jakarta font-bold text-[var(--color-emas-nusantara)] text-[1.667vw]">
          Selalu Dukung Artis Anda
        </p>
      </div>
      <div className="relative z-[1]">
        <ContributorPath {...contributorPathData} />
      </div>
      <div className="flex flex-col w-full p-[1.111vw] gap-[0.667vw] relative z-[1]">
        <p className="font-jakarta font-bold text-[var(--color-emas-nusantara)] text-[1.389vw]">
          Penawaran Spesial untuk Anda
        </p>

        {isLoading ? (
          <p className="text-[var(--color-krem-lontar)] font-jakarta text-center py-[2vw]">Memuat kampanye...</p>
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => <InvestCard key={campaign.campaignId} {...campaign} />)
        ) : (
          <div className="text-center py-[2vw]">
            <p className="text-[var(--color-krem-lontar)] font-jakarta text-[1.111vw]">Tidak ada kampanye aktif saat ini</p>
            <p className="text-[var(--color-krem-lontar)]/70 font-jakarta text-[0.833vw] mt-[0.556vw]">
              Periksa kembali nanti untuk peluang investasi baru
            </p>
          </div>
        )}

        <div className="flex flex-row justify-between"></div>
      </div>
    </section>
  );
};

export default InvestPage;
