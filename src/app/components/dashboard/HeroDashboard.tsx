"use client";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import AddressCard from "./AddressCard";
import TotalDana from "./TotalDana";
import AddIcon from "@mui/icons-material/Add";
import NusantaraIcon from "../common/NusantaraIcon";

const HeroDashboard = () => {
  const router = useRouter();
  const { user } = usePrivy();

  // Extract name from email (part before @)
  const getUserName = () => {
    if (user?.email?.address) {
      const emailName = user.email.address.split('@')[0];
      // Capitalize first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return "User";
  };

  // Mock transaction data
  const mockTransactions = [
    {
      title: "Royalty Payment - Spotify",
      address: "0xD10c...9D6",
      link: "https://sepolia.basescan.org/tx/0x1234567890abcdef"
    },
    {
      title: "Investment Return",
      address: "0x742d...A3E",
      link: "https://sepolia.basescan.org/tx/0xabcdef1234567890"
    },
    {
      title: "Pool Distribution",
      address: "0x8B5C...2F1",
      link: "https://sepolia.basescan.org/tx/0xfedcba0987654321"
    }
  ];

  return (
    <section className="flex flex-col gap-[2.222vw] w-[75vw] ">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <p className="text-[2.222vw] font-bold text-[var(--color-emas-nusantara)] font-jakarta">Hai {getUserName()}!</p>
          <p className="text-[1.389vw] text-[var(--color-krem-lontar)] font-jakarta">
            Lihat pembaruan dan progress portofolio Anda
          </p>
        </div>
        <div className="flex flex-row gap-[1.111vw]">
          <button
            onClick={() => {
              router.push("/musician/create");
            }}
            className="btn-primary-nusantara w-fit aspect-[110/40] flex flex-row justify-center items-center gap-[0.556vw] rounded-[1.042vw] text-white p-[0.889vw] shadow-wayang"
          >
            <AddIcon sx={{ color: "#FFFFFF" }} />
            <p className="text-white font-medium text-[0.972vw] text-center font-jakarta">
              Unggah
            </p>
          </button>
          <button
            onClick={() => {
              router.push("/musician/music");
            }}
            className="btn-secondary-nusantara w-fit aspect-[231/40] flex flex-row justify-center items-center gap-[0.556vw] rounded-[1.042vw] text-white p-[0.889vw] shadow-wayang"
          >
            <NusantaraIcon icon="anyaman-wallet" size={20} />
            <p className="text-white font-medium text-[0.972vw] text-center font-jakarta">
              Investasi Pool Pendanaan
            </p>
          </button>
        </div>
      </div>
      <div className="w-full flex flex-row justify-between">
        <TotalDana />
        <div className="flex flex-col gap-[0.667vw]">
          <div className="flex flex-row justify-between items-center">
            <p className="text-[1.389vw] text-[var(--color-emas-nusantara)] font-bold font-jakarta">Transaksi</p>
            <p className="text-[0.972vw] text-[var(--color-krem-lontar)]/70 font-regular font-jakarta hover:text-[var(--color-emas-nusantara)] cursor-pointer transition-colors">
              Lihat Riwayat Payout
            </p>
          </div>
          {mockTransactions.map((transaction, index) => (
            <AddressCard
              key={index}
              addressTitle={transaction.title}
              address={transaction.address}
              onDetail={() => window.open(transaction.link, '_blank')}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroDashboard;
