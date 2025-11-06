"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { 
  getTotalInvestorRoyalty, 
  getTotalCreatorRoyalty,
  getInvestmentsByUser,
  calculateInvestorRoyalty,
  getCampaignById,
  getMusicById
} from "@/app/utils/localStorage";
import { ArrowUp, Music } from "react-feather";

interface RoyaltyCardProps {
  userRole: "Creator" | "Investor";
}

interface RoyaltyDetail {
  musicTitle: string;
  campaignTitle: string;
  earnings: number;
  playCount: number;
}

const RoyaltyCard = ({ userRole }: RoyaltyCardProps) => {
  const { authenticated, user } = usePrivy();
  const [totalRoyalty, setTotalRoyalty] = useState(0);
  const [royaltyDetails, setRoyaltyDetails] = useState<RoyaltyDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authenticated && user?.id) {
      setLoading(true);
      
      if (userRole === "Creator") {
        // Calculate creator royalties
        const total = getTotalCreatorRoyalty(user.id);
        setTotalRoyalty(total);
      } else {
        // Calculate investor royalties
        const total = getTotalInvestorRoyalty(user.id);
        setTotalRoyalty(total);
        
        // Get detailed breakdown
        const investments = getInvestmentsByUser(user.id);
        const details: RoyaltyDetail[] = investments.map(inv => {
          const campaign = getCampaignById(inv.campaignId);
          const music = campaign ? getMusicById(campaign.musicTokenId) : null;
          
          return {
            musicTitle: music?.title || campaign?.musicTitle || "Unknown",
            campaignTitle: campaign?.description || "Campaign",
            earnings: calculateInvestorRoyalty(inv.id),
            playCount: 0, // Will be calculated in real implementation
          };
        }).filter(d => d.earnings > 0);
        
        setRoyaltyDetails(details);
      }
      
      setLoading(false);
    }
  }, [authenticated, user, userRole]);

  if (!authenticated) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-br from-[var(--color-hitam-ebony)] to-[var(--color-coklat-jati)]/20 rounded-[1.042vw] p-[1.667vw] border-2 border-[var(--color-coklat-jati)]/30 shadow-wayang relative overflow-hidden">
      {/* Batik Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none bg-repeat"
        style={{
          backgroundImage: "url('/assets/patterns/songket-pattern.svg')",
          backgroundSize: "150px",
        }}
      />
      
      <div className="relative z-10 flex flex-col gap-[1.111vw]">
        {/* Header */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-[0.333vw]">
            <p className="text-[var(--color-emas-nusantara)] font-jakarta text-[0.972vw] font-medium">
              {userRole === "Creator" ? "Pendapatan Royalti Creator" : "Pendapatan Royalti Investor"}
            </p>
            <div className="flex flex-row items-center gap-[0.556vw]">
              <p className="text-white font-jakarta text-[2.222vw] font-bold">
                ${totalRoyalty.toFixed(2)}
              </p>
              <div className="flex flex-row items-center gap-[0.222vw]">
                <ArrowUp size={16} className="text-[#72FFC7]" />
                <p className="text-[#72FFC7] font-inter text-[0.833vw] font-bold">
                  {totalRoyalty > 0 ? "+100%" : "0%"}
                </p>
              </div>
            </div>
          </div>
          <div className="w-[3.333vw] h-[3.333vw] rounded-full bg-[var(--color-emas-nusantara)]/20 flex items-center justify-center border-2 border-[var(--color-emas-nusantara)]">
            <Music size={24} className="text-[var(--color-emas-nusantara)]" />
          </div>
        </div>

        {/* Breakdown */}
        {userRole === "Investor" && royaltyDetails.length > 0 && (
          <div className="flex flex-col gap-[0.667vw]">
            <p className="text-[var(--color-krem-lontar)] font-jakarta text-[0.833vw] font-medium">
              Rincian Royalti:
            </p>
            <div className="flex flex-col gap-[0.444vw] max-h-[10vw] overflow-y-auto">
              {royaltyDetails.map((detail, idx) => (
                <div 
                  key={idx}
                  className="flex flex-row justify-between items-center bg-black/30 rounded-[0.444vw] p-[0.556vw] border border-[var(--color-coklat-jati)]/20"
                >
                  <div className="flex flex-col gap-[0.111vw]">
                    <p className="text-[var(--color-krem-lontar)] font-jakarta text-[0.833vw] font-medium">
                      {detail.musicTitle}
                    </p>
                    <p className="text-[var(--color-emas-nusantara)]/70 font-jakarta text-[0.694vw]">
                      {detail.campaignTitle}
                    </p>
                  </div>
                  <p className="text-white font-jakarta text-[0.972vw] font-bold">
                    ${detail.earnings.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-[var(--color-coklat-jati)]/10 rounded-[0.556vw] p-[0.778vw] border border-[var(--color-coklat-jati)]/30">
          <p className="text-[var(--color-krem-lontar)]/80 font-jakarta text-[0.694vw] leading-relaxed">
            {userRole === "Creator" 
              ? "💡 Royalti: $0.01 per pemutaran (≥30 detik atau selesai). Anda mendapat (100 - %royalti investor)%. Contoh: 100 play, 30% ke investor = Anda dapat $0.70, investor dapat $0.30."
              : "💡 Royalti: $0.01 per pemutaran (≥30 detik atau selesai). Anda mendapat bagian sesuai investasi × %royalti. Contoh: Invest $200/$800 (25%), 30% royalti, 100 play = $0.075."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoyaltyCard;
