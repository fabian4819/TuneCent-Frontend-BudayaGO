"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getUserProgressById, getLocalMusic } from "@/app/utils/localStorage";

const YourPath = () => {
  const { authenticated, user } = usePrivy();
  const [progress, setProgress] = useState({
    currentLevel: "Registered Creator",
    currentWorks: 0,
    totalWorksForNextLevel: 5,
    finalGoal: "Legendary Creator",
    progressPercentage: 0,
  });

  useEffect(() => {
    if (authenticated && user?.id) {
      // Get user progress from localStorage
      const userProgress = getUserProgressById(user.id);
      
      if (!userProgress) return;

      // Get total music created by this user
      const allMusic = getLocalMusic();
      const totalWorks = allMusic.length; // Count all music in localStorage for now

      // Calculate works needed for next level based on current level
      let worksNeeded = 5;
      if (userProgress.level.includes("Bronze")) {
        worksNeeded = 10;
      } else if (userProgress.level.includes("Silver")) {
        worksNeeded = 20;
      } else if (userProgress.level.includes("Gold")) {
        worksNeeded = 50;
      }

      // Calculate progress percentage
      const percentage = Math.min((totalWorks / worksNeeded) * 100, 100);

      setProgress({
        currentLevel: userProgress.level,
        currentWorks: totalWorks,
        totalWorksForNextLevel: worksNeeded,
        finalGoal: "Legendary Creator",
        progressPercentage: Math.round(percentage),
      });
    }
  }, [authenticated, user]);

  return (
    <div className="flex flex-col w-full p-[1.111vw] gap-[0.667vw]">
      <p className="font-jakarta text-white text-[1.389vw] font-bold">
        Your Path
      </p>
      {/* Progress bar with dynamic percentage */}
      <div className="w-full aspect-[1036/11] flex flex-row justify-between bg-[#2A2A2A] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#B6ABBA] transition-all duration-300"
          style={{ width: `${progress.progressPercentage}%` }}
        ></div>
      </div>
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row items-center w-[14.816vw] aspect-[214/38] text-white gap-[0.667vw]">
          <div className="w-[2.5vw] bg-black-lighter aspect-[1/1] rounded"></div>
          <div className="font-jakarta flex flex-col gap-[0.111vw]">
            <p className="font-jakarta font-bold text-[1.111vw]">
              {progress.currentLevel}
            </p>
            <p className="font-jakarta font-regular text-[0.833vw] text-white">
              {progress.currentWorks}/{progress.totalWorksForNextLevel} karya terdaftar
            </p>
          </div>
        </div>
        <div className="flex flex-col font-jakarta text-end">
          <p className="text-[0.833vw] text-[#FFFEFF]">Tujuan Akhir</p>
          <p className="text-[1.111vw] text-[#FFFEFF]">
            {progress.finalGoal}
          </p>
        </div>
      </div>
    </div>
  );
};

export default YourPath;
