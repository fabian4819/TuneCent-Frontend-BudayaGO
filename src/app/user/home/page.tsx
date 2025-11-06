import MusicPool from "@/app/components/dashboard/MusicPool";
import TopArtist from "@/app/components/landingpage/TopArtist";
import Leaderboard from "@/app/components/music/Leaderboard";
import PromotionalBanner from "@/app/components/dashboard/PromotionalBanner";
import RoyaltyCard from "@/app/components/common/RoyaltyCard";

const UserHomePage = () => {
  return (
    <section className="flex flex-col w-full gap-[2.222vw] relative">
      <PromotionalBanner />

      {/* Gorga Divider */}
      <div className="divider-gorga w-full my-6" />

      {/* Royalty Card for Investors */}
      <RoyaltyCard userRole="Investor" />

      {/* Gorga Divider */}
      <div className="divider-gorga w-full my-6" />

      <MusicPool title="Dibuat Untuk Anda" />

      {/* Gorga Divider */}
      <div className="divider-gorga w-full my-6" />

      <MusicPool title="Lanjutkan Mendengarkan" />

      {/* Gorga Divider */}
      <div className="divider-gorga w-full my-6" />

      <TopArtist />

      {/* Gorga Divider */}
      <div className="divider-gorga w-full my-6" />

      <div className="w-full flex flex-row gap-[1.111vw]">
        <Leaderboard category="Artist" />
        <Leaderboard category="Music" />
      </div>
    </section>
  );
};

export default UserHomePage;
