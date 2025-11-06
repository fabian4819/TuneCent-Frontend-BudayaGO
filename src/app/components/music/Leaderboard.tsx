"use client";
import NusantaraIcon from "../common/NusantaraIcon";

interface LeaderboardArrayProps {
  rank: number;
  artist: string;
  score: string;
  isYourProfile?: boolean;
  isTopProfile?: boolean;
}

const LeaderboardMusisiArray: LeaderboardArrayProps[] = [
  {
    rank: 49,
    artist: "Juicy Luicy",
    score: "9.812",
    isYourProfile: false,
  },
  {
    rank: 50,
    artist: "Tenxi",
    score: "9.700",
    isYourProfile: true,
  },
  {
    rank: 51,
    artist: "Hindia",
    score: "9.650",
    isYourProfile: false,
  },
  {
    rank: 52,
    artist: "Rizky Febian",
    score: "9.600",
    isYourProfile: false,
  },
];

const LeaderboardArtistArray: LeaderboardArrayProps[] = [
  {
    rank: 1,
    artist: "NIKI",
    score: "9.812",
    isTopProfile: true,
  },
  {
    rank: 2,
    artist: "Tenxi",
    score: "9.700",
    isTopProfile: false,
  },
  {
    rank: 3,
    artist: "Hindia",
    score: "9.650",
    isTopProfile: false,
  },
  {
    rank: 4,
    artist: "Rizky Febian",
    score: "9.600",
    isTopProfile: false,
  },
];

const LeaderboardMusicArray: LeaderboardArrayProps[] = [
  {
    rank: 1,
    artist: "Mejikuhibiniu",
    score: "9.812",
    isTopProfile: true,
  },
  {
    rank: 2,
    artist: "Rasakan Nikmatnya Hidup",
    score: "9.700",
    isTopProfile: false,
  },
  {
    rank: 3,
    artist: "Pikiran Yang Matang",
    score: "9.650",
    isTopProfile: false,
  },
  {
    rank: 4,
    artist: "Kau Pemeran Utama di Sebuah Opera",
    score: "9.600",
    isTopProfile: false,
  },
];

interface LeaderboardProps {
  category?: "Artist" | "Music" | "Musician";
}

const Leaderboard = ({ category = "Artist" }: LeaderboardProps) => {
  const getCategoryIndonesian = () => {
    if (category === "Artist") return "Artis";
    if (category === "Music") return "Musik";
    return "Musisi";
  };

  return (
    <div className="nusantara-card flex flex-col w-[36.667vw] aspect-[528/268] p-[1.111vw] rounded-[0.486vw] gap-[0.556vw] shadow-wayang border-ukiran relative overflow-hidden">
      {/* Subtle Kawung Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url('/assets/patterns/kawung-pattern.svg')",
          backgroundSize: "150px",
          backgroundRepeat: "repeat"
        }}
      />
      <div className="w-full flex flex-row items-center justify-between pb-[0.667vw] border-b-[0.069vw] border-[var(--color-coklat-jati)] relative z-[1]">
        <p className="text-[var(--color-emas-nusantara)] text-[1.389vw] font-jakarta font-bold">
          Papan Peringkat - Top {getCategoryIndonesian()}
        </p>
        <button
          onClick={() => {}}
          className="cursor-pointer text-[0.972vw] text-[var(--color-coklat-jati)] font-regular font-jakarta hover:text-[var(--color-emas-nusantara)] transition-colors"
        >
          Lihat Semua
        </button>
      </div>
      {category === "Musician" ? (
        <div className="flex flex-col w-full aspect-[481/180] p-[0.444vw] gap-[0.556vw] relative z-[1]">
          {LeaderboardMusisiArray.map((leaderboardKey) => (
            <div
              key={leaderboardKey.rank}
              className="w-full flex flex-row justify-between p-[0.222vw]"
            >
              {leaderboardKey.isYourProfile ? (
                <div className="w-full flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-[0.667vw] font-jakarta text-[var(--color-hitam-ebony)]">
                    <p className="text-[1.667vw] font-bold text-[var(--color-emas-nusantara)]">
                      {leaderboardKey.rank}
                    </p>
                    <div className="flex flex-col gap-[0.111vw]">
                      <p className="text-[1.389vw] font-bold text-[var(--color-hitam-ebony)]">
                        {leaderboardKey.artist}
                      </p>
                      <p className="text-[0.833vw] text-[var(--color-coklat-jati)]">
                        skor: {leaderboardKey.score}
                      </p>
                    </div>
                  </div>
                  <div className="w-[3.889vw] aspect-[56/24] bg-gradient-to-r from-[var(--color-merah-kebangsaan)] to-[var(--color-emas-nusantara)] flex justify-center items-center rounded-[0.347vw] p-[0.333vw]">
                    <p className="text-white font-jakarta text-[0.833vw] text-center font-semibold">
                      Anda
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-[0.667vw] font-jakarta">
                  <p className="text-[1vw] font-bold text-[var(--color-emas-nusantara)]/80 min-w-[1.5vw]">{leaderboardKey.rank}</p>
                  <div className="flex flex-col gap-[0.111vw]">
                    <p className="text-[1.05vw] font-semibold text-[var(--color-hitam-ebony)]">{leaderboardKey.artist}</p>
                    <p className="text-[0.833vw] text-[var(--color-coklat-jati)]">
                      skor: {leaderboardKey.score}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : category === "Artist" ? (
        <div className="flex flex-col w-full aspect-[481/180] p-[0.444vw] gap-[0.556vw] relative z-[1]">
          {LeaderboardArtistArray.map((leaderboardKey) => (
            <div
              key={leaderboardKey.rank}
              className="w-full flex flex-row justify-between p-[0.222vw]"
            >
              {leaderboardKey.isTopProfile ? (
                <div className="w-full flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-[0.667vw] font-jakarta text-[var(--color-hitam-ebony)]">
                    <div className="relative">
                      <p className="text-[1.667vw] font-bold text-[var(--color-emas-nusantara)]">
                        {leaderboardKey.rank}
                      </p>
                      <div className="absolute -top-1 -right-2">
                        <NusantaraIcon icon="mahkota-crown" size={16} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-[0.111vw]">
                      <p className="text-[1.389vw] font-bold text-[var(--color-hitam-ebony)]">
                        {leaderboardKey.artist}
                      </p>
                      <p className="text-[0.833vw] text-[var(--color-coklat-jati)]">
                        skor: {leaderboardKey.score}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-[0.667vw] font-jakarta">
                  <p className="text-[1vw] font-bold text-[var(--color-emas-nusantara)]/80 min-w-[1.5vw]">{leaderboardKey.rank}</p>
                  <div className="flex flex-col gap-[0.111vw]">
                    <p className="text-[1.05vw] font-semibold text-[var(--color-hitam-ebony)]">{leaderboardKey.artist}</p>
                    <p className="text-[0.833vw] text-[var(--color-coklat-jati)]">
                      skor: {leaderboardKey.score}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col w-full aspect-[481/180] p-[0.444vw] gap-[0.556vw] relative z-[1]">
          {LeaderboardMusicArray.map((leaderboardKey) => (
            <div
              key={leaderboardKey.rank}
              className="w-full flex flex-row justify-between p-[0.222vw]"
            >
              {leaderboardKey.isTopProfile ? (
                <div className="w-full flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-[0.667vw] font-jakarta text-[var(--color-hitam-ebony)]">
                    <div className="relative">
                      <p className="text-[1.667vw] font-bold text-[var(--color-emas-nusantara)]">
                        {leaderboardKey.rank}
                      </p>
                      <div className="absolute -top-1 -right-2">
                        <NusantaraIcon icon="mahkota-crown" size={16} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-[0.111vw]">
                      <p className="text-[1.389vw] font-bold text-[var(--color-hitam-ebony)]">
                        {leaderboardKey.artist}
                      </p>
                      <p className="text-[0.833vw] text-[var(--color-coklat-jati)]">
                        skor: {leaderboardKey.score}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-[0.667vw] font-jakarta">
                  <p className="text-[1vw] font-bold text-[var(--color-emas-nusantara)]/80 min-w-[1.5vw]">{leaderboardKey.rank}</p>
                  <div className="flex flex-col gap-[0.111vw]">
                    <p className="text-[1.05vw] font-semibold text-[var(--color-hitam-ebony)]">{leaderboardKey.artist}</p>
                    <p className="text-[0.833vw] text-[var(--color-coklat-jati)]">
                      skor: {leaderboardKey.score}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
