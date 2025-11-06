"use client";
import ContractClarityScore from "@/app/components/music/ContractClarityScore";
import Leaderboard from "@/app/components/music/Leaderboard";
import ResonansiTerkini from "@/app/components/music/ResonansiTerkini";
import YourPath from "@/app/components/music/YourPath";

const MusicPage = () => {
  return (
    <section className="w-full flex flex-col bg-black gap-[1.667vw]">
      <p className="font-jakarta font-bold text-white text-[1.667vw]">
        Your Music Trends
      </p>
      <YourPath />
      <div className="w-full flex flex-row gap-[1.667vw]">
        <Leaderboard />
        <ContractClarityScore />
      </div>
      <ResonansiTerkini />
      <div className="flex flex-col w-full p-[1.111vw] gap-[0.667vw]">
        <p className="font-jakarta text-white text-[1.389vw]">Portofolio</p>
        <div className="flex flex-row justify-between"></div>
      </div>
    </section>
  );
};

export default MusicPage;
