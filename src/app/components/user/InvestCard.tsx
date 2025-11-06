"use client";

import { useState } from "react";
import MusicPoolCard from "../dashboard/MusicPoolCard";
import { IoPeopleSharp } from "react-icons/io5";
import { FaHourglassEnd } from "react-icons/fa";
import { usePrivy } from '@privy-io/react-auth';
import { saveInvestment, generateId } from "@/app/utils/localStorage";
import TransactionSuccessModal from "@/app/components/common/TransactionSuccessModal";

export interface InvestCardProps {
  campaignId: string;
  musicTitle: string;
  musicArtist: string;
  coverImageUrl?: string;
  fundedPercentage: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  investorCount: number;
  timeRemaining: string;
  targetListeners: number;
  genre?: string;
  goalAmount?: number;
  raisedAmount?: number;
  royaltyPercentage?: number;
  description?: string;
  onInvestSuccess?: () => void;
}

const InvestCard = ({
  campaignId,
  musicTitle,
  musicArtist,
  coverImageUrl,
  fundedPercentage,
  riskLevel,
  investorCount,
  timeRemaining,
  targetListeners,
  goalAmount,
  raisedAmount,
  royaltyPercentage,
  onInvestSuccess,
}: InvestCardProps) => {
  const { authenticated, user } = usePrivy();

  const [investAmount, setInvestAmount] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [investmentData, setInvestmentData] = useState<{
    amount: string;
    campaignId: string;
    musicTitle: string;
    musicArtist: string;
    royaltyPercentage?: number;
  } | null>(null);

  const getRiskColorClass = (risk: string) => {
    switch (risk) {
      case "Low Risk":
        return "text-[#72FFC7]";
      case "Medium Risk":
        return "text-[#FFD700]";
      case "High Risk":
        return "text-[#FF6B6B]";
      default:
        return "text-[#72FFC7]";
    }
  };

  const handleInvest = () => {
    if (!authenticated) {
      alert("Mohon hubungkan akun Anda untuk berinvestasi");
      return;
    }

    if (!investAmount || parseFloat(investAmount) <= 0) {
      alert("Masukkan jumlah investasi yang valid");
      return;
    }

    if (!user?.id) {
      alert("User ID tidak ditemukan");
      return;
    }

    setIsProcessing(true);

    try {
      // Create investment object
      const investment = {
        id: generateId(),
        campaignId,
        musicTitle,
        investorAddress: user.id,
        amount: investAmount,
        investedAt: new Date().toISOString(),
        royaltyShare: royaltyPercentage || 0,
      };

      // Save investment - this will automatically update the campaign
      saveInvestment(investment);

      // Save investment data for success modal
      setInvestmentData({
        amount: investAmount,
        campaignId,
        musicTitle,
        musicArtist,
        royaltyPercentage,
      });

      // Show success modal after a brief delay
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccessModal(true);
      }, 500);

    } catch (error) {
      console.error("Error processing investment:", error);
      alert("Gagal memproses investasi. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setInvestAmount("");
    setInvestmentData(null);
    
    // Trigger parent refresh
    if (onInvestSuccess) {
      onInvestSuccess();
    }
  };

  return (
    <div className="flex flex-row w-full gap-[1.111vw]">
      <div className="w-[13.333vw]">
        <MusicPoolCard playable={false} coverImageUrl={coverImageUrl} />
      </div>
      <div className="w-full flex flex-col gap-[0.556vw] p-[0.556vw]">
        <div className="flex flex-col gap-[0.222vw]">
          <h5 className="text-[1.111vw] font-jakarta text-white font-bold">
            {musicTitle}
          </h5>
          <div className="w-full flex flex-row justify-between">
            <p className="text-[1.111vw] font-jakarta text-white font-regular">
              {musicArtist}
            </p>
            <p className="text-[0.889vw] font-jakarta text-white font-regular">
              {fundedPercentage}% terdanai
            </p>
          </div>
          <div className="w-full aspect-[1036/11] flex flex-row justify-between bg-[var(--color-hitam-ebony)] rounded-full overflow-hidden relative">
            <div
              className="aspect-[1036/11] flex flex-row justify-between bg-gradient-to-r from-[var(--color-merah-kebangsaan)] to-[var(--color-emas-nusantara)] rounded-full transition-all duration-300 absolute left-0 top-0"
              style={{ width: `${Math.min(fundedPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex flex-row gap-[1.333vw]">
            <p className={`font-jakarta text-[0.8333vw] font-semibold ${getRiskColorClass(riskLevel)}`}>
              {riskLevel}
            </p>
            <div className="flex flex-row justify-center items-center gap-[0.444vw]">
              <IoPeopleSharp size={16} color="white" />
              <p className="text-white font-jakarta text-[0.833vw]">
                {investorCount}
              </p>
            </div>
            <div className="flex flex-row justify-center items-center gap-[0.444vw]">
              <FaHourglassEnd size={16} color="white" />
              <p className="text-white font-jakarta text-[0.833vw]">
                {timeRemaining}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row justify-between">
          <div className="flex flex-row items-end gap-[1vw]">
            <h2 className="font-jakarta font-bold text-white text-[2.222vw]">
              {targetListeners.toLocaleString()}
            </h2>
            <p className="font-jakarta text-white text-[1.111vw] mb-[0.333vw]">
              Listeners
            </p>
          </div>
          <div className="flex flex-col gap-[0.556vw]">
              <div className="flex flex-row gap-[0.556vw]">
                <input
                  className="font-inter text-white bg-transparent border-2 border-white px-[1.111vw] py-[0.556vw] rounded-[0.556vw] text-[1.111vw] outline-none w-[8vw]"
                  type="number"
                  step="1"
                  placeholder="0 USD"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  disabled={isProcessing}
                />
                <button
                  onClick={handleInvest}
                  disabled={isProcessing || !authenticated}
                  className="w-[7.431vw] bg-gradient-to-r from-[var(--color-merah-kebangsaan)] to-[var(--color-emas-nusantara)] flex justify-center items-center rounded-[0.486vw] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-wayang"
                >
                  <p className="font-inter text-white text-[0.972vw] font-medium">
                    {isProcessing ? "Memproses..." : "Investasi"}
                  </p>
                </button>
              </div>

            {/* Royalty Info */}
            {royaltyPercentage && (
              <p className="text-[var(--color-krem-lontar)]/70 text-[0.722vw] font-jakarta">
                Anda akan menerima {royaltyPercentage / 100}% dari royalti masa depan
              </p>
            )}

            {/* Goal Info */}
            {goalAmount && raisedAmount !== undefined && (
              <p className="text-[var(--color-krem-lontar)]/70 text-[0.722vw] font-jakarta">
                ${raisedAmount} USD / ${goalAmount} USD terkumpul
              </p>
            )}
          </div>
        </div>
      </div>

      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        transactionHash={undefined}
        title="Investasi Berhasil!"
      >
        <div className="space-y-[1.111vw]">
          <div className="bg-black border border-[var(--color-coklat-jati)] rounded-[0.556vw] p-[1.111vw]">
            <h3 className="font-semibold font-jakarta text-white text-[1.111vw] mb-[0.833vw]">Investasi Anda</h3>
            <div className="space-y-[0.556vw]">
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Jumlah:</span>
                <span className="font-bold text-white text-[0.833vw] font-jakarta">${investmentData?.amount} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Musik:</span>
                <span className="font-medium text-white text-[0.833vw] font-jakarta">{investmentData?.musicTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Artis:</span>
                <span className="font-medium text-white text-[0.833vw] font-jakarta">{investmentData?.musicArtist}</span>
              </div>
              {investmentData?.royaltyPercentage && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Bagi Hasil Royalti:</span>
                  <span className="font-medium text-[var(--color-emas-nusantara)] text-[0.833vw] font-jakarta">
                    {investmentData.royaltyPercentage / 100}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[var(--color-merah-kebangsaan)]/20 to-[var(--color-emas-nusantara)]/20 border border-[var(--color-emas-nusantara)]/30 rounded-[0.556vw] p-[1.111vw]">
            <p className="text-[0.833vw] text-[var(--color-krem-lontar)] font-jakarta">
              Investasi Anda telah berhasil! Anda sekarang adalah kontributor kampanye musik ini dan akan menerima pembayaran royalti berdasarkan performa musik tersebut.
            </p>
          </div>

          {coverImageUrl && (
            <div className="rounded-[0.556vw] overflow-hidden border border-white-darker">
              <MusicPoolCard playable={false} coverImageUrl={coverImageUrl} />
            </div>
          )}
        </div>
      </TransactionSuccessModal>
    </div>
  );
};

export default InvestCard;
