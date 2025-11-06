"use client";

import { useState } from "react";
import { usePrivy } from '@privy-io/react-auth';
import TransactionSuccessModal from "@/app/components/common/TransactionSuccessModal";
import { saveCampaign, generateId } from "@/app/utils/localStorage";

interface CreateCampaignModalProps {
  musicId: string;
  musicTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateCampaignModal({
  musicId,
  musicTitle,
  onClose,
  onSuccess,
}: CreateCampaignModalProps) {
  const { authenticated, user } = usePrivy();

  const [goalAmount, setGoalAmount] = useState<string>("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState<string>("25");
  const [durationInDays, setDurationInDays] = useState<string>("30");
  const [lockupPeriodInDays, setLockupPeriodInDays] = useState<string>("90");
  const [description, setDescription] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [poolData, setPoolData] = useState<{
    musicTitle: string;
    goalAmount: string;
    royaltyPercentage: string;
    duration: string;
    lockupPeriod: string;
    description: string;
  } | null>(null);

  const handleSubmit = () => {
    if (!authenticated) {
      alert("Mohon login terlebih dahulu");
      return;
    }

    if (!goalAmount || parseFloat(goalAmount) <= 0) {
      alert("Mohon masukkan target pendanaan yang valid");
      return;
    }

    const royalty = parseFloat(royaltyPercentage);
    if (royalty <= 0 || royalty > 50) {
      alert("Persentase royalti harus antara 0.01% dan 50%");
      return;
    }

    setIsCreating(true);

    try {
      // Calculate deadline
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + parseInt(durationInDays));

      // Get user ID
      const userId = user?.id || "guest";

      // Save campaign to localStorage
      const campaignData = {
        id: generateId(),
        musicTokenId: musicId,
        musicTitle: musicTitle,
        goal: goalAmount,
        royaltyPercentage: royalty,
        deadline: deadline.toISOString(),
        lockupPeriod: parseInt(lockupPeriodInDays),
        currentAmount: "0",
        backers: 0,
        creatorAddress: userId,
        description: description || `Pool pendanaan untuk musik ${musicTitle}`,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      };

      saveCampaign(campaignData);
      console.log('Campaign saved to localStorage:', campaignData);

      // Set success data for modal
      setPoolData({
        musicTitle,
        goalAmount,
        royaltyPercentage,
        duration: durationInDays,
        lockupPeriod: lockupPeriodInDays,
        description: description || `Pool pendanaan untuk musik ${musicTitle}`,
      });

      // Show success modal
      setTimeout(() => {
        setIsCreating(false);
        setShowSuccessModal(true);
        onSuccess?.();
      }, 500);

    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Gagal membuat kampanye. Mohon coba lagi.");
      setIsCreating(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setPoolData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[var(--color-hitam-ebony)] border-2 border-[var(--color-coklat-jati)] rounded-[1.111vw] p-[2.222vw] w-[50vw] max-h-[80vh] overflow-y-auto shadow-wayang">
        <div className="flex justify-between items-center mb-[1.667vw]">
          <h2 className="text-[var(--color-emas-nusantara)] text-[1.667vw] font-bold font-jakarta">
            Buat Pool Pendanaan
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-krem-lontar)] text-[1.5vw] hover:text-[var(--color-emas-nusantara)] transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-[var(--color-krem-lontar)]/70 text-[0.972vw] mb-[1.111vw] font-jakarta">
          Musik: <span className="text-[var(--color-krem-lontar)] font-semibold">{musicTitle}</span>
        </p>

        <div className="flex flex-col gap-[1.111vw]">
          {/* Goal Amount */}
          <div className="flex flex-col gap-[0.444vw]">
            <label className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">
              Target Pendanaan (USD)
            </label>
            <input
              type="number"
              step="100"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder="1000"
              className="w-full text-[var(--color-krem-lontar)] bg-black border border-[var(--color-coklat-jati)] rounded-[0.556vw] p-[0.778vw] text-[1.111vw] outline-none focus:border-[var(--color-emas-nusantara)] transition-colors font-jakarta"
            />
          </div>

          {/* Royalty Percentage */}
          <div className="flex flex-col gap-[0.444vw]">
            <label className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">
              Bagian Royalti untuk Pendukung (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.01"
              max="50"
              value={royaltyPercentage}
              onChange={(e) => setRoyaltyPercentage(e.target.value)}
              placeholder="25"
              className="w-full text-[var(--color-krem-lontar)] bg-black border border-[var(--color-coklat-jati)] rounded-[0.556vw] p-[0.778vw] text-[1.111vw] outline-none focus:border-[var(--color-emas-nusantara)] transition-colors font-jakarta"
            />
            <p className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">
              Pendukung akan menerima {royaltyPercentage}% dari royalti masa depan
            </p>
          </div>

          {/* Campaign Duration */}
          <div className="flex flex-col gap-[0.444vw]">
            <label className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">
              Durasi Kampanye (Hari)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={durationInDays}
              onChange={(e) => setDurationInDays(e.target.value)}
              placeholder="30"
              className="w-full text-[var(--color-krem-lontar)] bg-black border border-[var(--color-coklat-jati)] rounded-[0.556vw] p-[0.778vw] text-[1.111vw] outline-none focus:border-[var(--color-emas-nusantara)] transition-colors font-jakarta"
            />
          </div>

          {/* Lockup Period */}
          <div className="flex flex-col gap-[0.444vw]">
            <label className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">
              Periode Penguncian (Hari)
            </label>
            <input
              type="number"
              min="0"
              value={lockupPeriodInDays}
              onChange={(e) => setLockupPeriodInDays(e.target.value)}
              placeholder="90"
              className="w-full text-[var(--color-krem-lontar)] bg-black border border-[var(--color-coklat-jati)] rounded-[0.556vw] p-[0.778vw] text-[1.111vw] outline-none focus:border-[var(--color-emas-nusantara)] transition-colors font-jakarta"
            />
            <p className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">
              Periode di mana pendukung tidak dapat menarik bagian mereka
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[0.444vw]">
            <label className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">
              Deskripsi Pool (Opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang pool pendanaan ini..."
              rows={3}
              className="w-full text-[var(--color-krem-lontar)] bg-black border border-[var(--color-coklat-jati)] rounded-[0.556vw] p-[0.778vw] text-[1.111vw] outline-none focus:border-[var(--color-emas-nusantara)] transition-colors font-jakarta resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[1.111vw] mt-[1.111vw]">
            <button
              onClick={handleSubmit}
              disabled={isCreating || !authenticated}
              className="btn-primary-nusantara flex-1 text-white rounded-[0.556vw] p-[0.778vw] text-[0.972vw] font-semibold font-jakarta disabled:opacity-50 disabled:cursor-not-allowed shadow-wayang"
            >
              {isCreating ? "Membuat..." : !authenticated ? "Login Terlebih Dahulu" : "Buat Pool"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[var(--color-coklat-jati)] text-[var(--color-krem-lontar)] rounded-[0.556vw] p-[0.778vw] text-[0.972vw] font-semibold font-jakarta hover:bg-[var(--color-coklat-jati)]/80 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        transactionHash={null}
        title="Pool Berhasil Dibuat!"
      >
        <div className="space-y-[1.111vw]">
          <div className="bg-black border border-[var(--color-coklat-jati)] rounded-[0.556vw] p-[1.111vw]">
            <h3 className="font-semibold font-jakarta text-[var(--color-emas-nusantara)] text-[1.111vw] mb-[0.833vw]">Detail Pool</h3>
            <div className="space-y-[0.556vw]">
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Musik:</span>
                <span className="font-medium text-[var(--color-krem-lontar)] text-[0.833vw] font-jakarta">{poolData?.musicTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Target Pendanaan:</span>
                <span className="font-bold text-[var(--color-emas-nusantara)] text-[0.833vw] font-jakarta">${poolData?.goalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Bagian Royalti:</span>
                <span className="font-medium text-[var(--color-hijau-pandan)] text-[0.833vw] font-jakarta">{poolData?.royaltyPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Durasi:</span>
                <span className="font-medium text-[var(--color-krem-lontar)] text-[0.833vw] font-jakarta">{poolData?.duration} hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Periode Penguncian:</span>
                <span className="font-medium text-[var(--color-krem-lontar)] text-[0.833vw] font-jakarta">{poolData?.lockupPeriod} hari</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-hijau-pandan)] bg-opacity-20 border border-[var(--color-hijau-pandan)] rounded-[0.556vw] p-[1.111vw]">
            <p className="text-[0.833vw] text-[var(--color-krem-lontar)] font-jakarta">
              Pool pendanaan Anda telah dibuat! Investor sekarang dapat berkontribusi pada kampanye musik Anda di halaman Invest.
            </p>
          </div>

          <div className="bg-[var(--color-merah-kebangsaan)] bg-opacity-20 border border-[var(--color-emas-nusantara)] rounded-[0.556vw] p-[1.111vw]">
            <h4 className="font-semibold font-jakarta text-[var(--color-emas-nusantara)] text-[0.972vw] mb-[0.556vw]">Langkah Selanjutnya:</h4>
            <ul className="text-[0.833vw] text-[var(--color-krem-lontar)] font-jakarta list-disc list-inside space-y-[0.278vw]">
              <li>Pool akan muncul di halaman Invest</li>
              <li>Bagikan ke investor potensial</li>
              <li>Pantau progress pendanaan Anda</li>
            </ul>
          </div>
        </div>
      </TransactionSuccessModal>
    </div>
  );
}
