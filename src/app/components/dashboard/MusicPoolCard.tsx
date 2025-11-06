"use client";
import { useState, useEffect } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPauseCircle, FaSpotify, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import { loadMediaFromReference, isIndexedDBReference } from "@/app/utils/indexedDB";

interface MusicPoolCardProps {
  onClickPlay?: () => void;
  isPlayingSong?: boolean;
  playable?: boolean;
  coverImageUrl?: string;
}

const MusicPoolCard = ({
  onClickPlay,
  isPlayingSong = false,
  playable = true,
  coverImageUrl,
}: MusicPoolCardProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [displayCoverUrl, setDisplayCoverUrl] = useState<string | undefined>(coverImageUrl);

  // Load cover image from IndexedDB if needed
  useEffect(() => {
    const loadCoverImage = async () => {
      if (coverImageUrl && isIndexedDBReference(coverImageUrl)) {
        const loadedUrl = await loadMediaFromReference(coverImageUrl);
        if (loadedUrl) {
          setDisplayCoverUrl(loadedUrl);
        }
      } else {
        setDisplayCoverUrl(coverImageUrl);
      }
    };

    loadCoverImage();
  }, [coverImageUrl]);

  const hoveringAndPlay = (hovering: boolean, playing: boolean) => {
    if (!playing) setIsHovered(false);
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => hoveringAndPlay(isHovered, isPlayingSong)}
        className={`relative flex flex-col w-[12.9vw] aspect-[192/177] `}
      >
        {playable && isHovered && (
          <button
            onClick={onClickPlay}
            className="cursor-pointer absolute right-[1.111vw] bottom-[1.111vw] z-20 transition-transform hover:scale-110"
          >
            {isPlayingSong ? (
              <FaPauseCircle size={44} className="text-[var(--color-emas-nusantara)] drop-shadow-[0_2px_8px_rgba(212,175,55,0.6)]" />
            ) : (
              <FaCirclePlay size={44} className="text-[var(--color-emas-nusantara)] drop-shadow-[0_2px_8px_rgba(212,175,55,0.6)]" />
            )}
          </button>
        )}
        <div className="bg-black-lighter aspect-[192/177] flex flex-row-reverse p-[0.111vw] relative overflow-hidden border-2 border-[var(--color-coklat-jati)] rounded-[0.556vw]">
          {/* Batik Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none z-[1]"
            style={{
              backgroundImage: "url('/assets/patterns/kawung-pattern.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />

          {displayCoverUrl && (
            <Image
              src={displayCoverUrl}
              alt="Album cover"
              fill
              className="object-cover"
              unoptimized
            />
          )}
          <div className="flex flex-row gap-[0.333vw] p-[0.556vw] relative z-10">
            <div className="w-[1.5vw] bg-[var(--color-emas-nusantara)] h-[1.5vw] rounded-full flex items-center justify-center border border-[var(--color-coklat-jati)]">
              <FaSpotify size={18} color="#1DB954" />
            </div>
            <div className="w-[1.5vw] bg-[var(--color-emas-nusantara)] h-[1.5vw] rounded-full flex items-center justify-center border border-[var(--color-coklat-jati)]">
              <FaYoutube size={18} color="#FF0000" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPoolCard;
