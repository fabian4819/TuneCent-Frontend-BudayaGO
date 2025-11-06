"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import MusicPoolCard from "./MusicPoolCard";
import { RiArrowRightUpLine } from "@remixicon/react";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import ArtistProfileExpanded from "./ArtistProfileExpanded";
import CreateCampaignModal from "./CreateCampaignModal";
import { listMusic, MusicData } from "@/app/services/musicApi";
import { usePrivy } from "@privy-io/react-auth";
import { getLocalMusic, savePlayHistory, generateId } from "@/app/utils/localStorage";
import { loadMediaFromReference, isIndexedDBReference } from "@/app/utils/indexedDB";

interface MusicPoolProps {
  title?: string;
  onClickLanjut?: () => void;
  showCampaignButton?: boolean; // Show "Buat Pool Pendanaan" button (only for musicians)
}

interface MusicProps {
  musicId: number | string;
  musicTitle: string;
  musicCloseHour: number;
  musicOnClick: () => void;
  musicIcon?: string;
  musicArtist: string;
  musicUrl: string;
  coverImageUrl?: string;
  genre?: string;
}

const DummyMusic: MusicProps[] = [
  {
    musicId: 1,
    musicTitle: "Mejikuhibiniu",
    musicCloseHour: 48,
    musicArtist: "Tenxi",
    musicOnClick: () => {},
    musicUrl: "/assets/songs/mejikuhibiniu.mp3",
    coverImageUrl:
      "https://i.scdn.co/image/ab67616d00001e024d265eb3c717ab45470fdc8c",
    genre: "Indie Pop",
  },
  {
    musicId: 2,
    musicTitle: "Pikiran yang matang",
    musicCloseHour: 12,
    musicArtist: "Perunggu",
    musicOnClick: () => {},
    musicUrl: "/assets/songs/pikiran-yang-matang.mp3",
    coverImageUrl:
      "https://i.scdn.co/image/ab67616d00001e0292aaadd0be503d89c082ecbb",
    genre: "Alternative Rock",
  },
  {
    musicId: 3,
    musicTitle: "Alamak",
    musicCloseHour: 24,
    musicArtist: "Rizky Febian, Adrian Khalif",
    musicOnClick: () => {},
    musicUrl: "/assets/songs/alamak.mp3",
    coverImageUrl:
      "https://i.scdn.co/image/ab67616d00001e0201b9750a33d771645d7f043a",
    genre: "Pop",
  },
  {
    musicId: 4,
    musicTitle: "kids",
    musicCloseHour: 48,
    musicArtist: "Hindia",
    musicOnClick: () => {},
    musicUrl: "/assets/songs/kids-hindia.mp3",
    coverImageUrl:
      "https://i.scdn.co/image/ab67616d00001e0205898628baab6ef07a0a4d03",
    genre: "Indie",
  },
  {
    musicId: 5,
    musicTitle: "Tabola Bale",
    musicCloseHour: 18,
    musicArtist: "Silet Open Up, Jacson Zeran, Juan Reza, Diva Aurel",
    musicOnClick: () => {},
    musicUrl: "/assets/songs/tabola-bale.mp3",
    coverImageUrl:
      "https://i.scdn.co/image/ab67616d00001e0210df7b8e9b3ed2588888a8ae",
    genre: "Hip Hop",
  },
];

const MusicPool = ({
  title = "Your Top Song",
  showCampaignButton = false,
}: MusicPoolProps) => {
  const { authenticated, user } = usePrivy();
  const [activeSongId, setActiveSongId] = useState<number | string | null>(null);
  const [activeSong, setActiveSong] = useState<MusicProps | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [musicList, setMusicList] = useState<MusicProps[]>(DummyMusic);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedMusicForCampaign, setSelectedMusicForCampaign] =
    useState<MusicProps | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playStartTimeRef = useRef<number>(0); // Track when play started

  // Generate random closing hours
  const generateRandomCloseHour = () => {
    const options = [6, 12, 18, 24, 48, 72, 96]; // 6h, 12h, 18h, 1d, 2d, 3d, 4d
    return options[Math.floor(Math.random() * options.length)];
  };

  // Fetch music data from backend and merge with localStorage
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        // Get localStorage music
        const localMusic = getLocalMusic();
        const transformedLocalMusic: MusicProps[] = localMusic.map((music) => ({
          musicId: music.id, // Keep original string ID from localStorage
          musicTitle: music.title,
          musicCloseHour: generateRandomCloseHour(),
          musicArtist: music.artist,
          musicOnClick: () => {},
          musicUrl: music.audioFileUrl,
          coverImageUrl: music.coverImageUrl,
          genre: music.genre,
        }));

        // Fetch backend music
        const response = await listMusic({ limit: 5 });

        // Transform backend data to match MusicProps interface
        const transformedBackendMusic: MusicProps[] = response.data.map(
          (music: MusicData) => ({
            musicId: music.token_id,
            musicTitle: music.title,
            musicCloseHour: generateRandomCloseHour(),
            musicArtist: music.artist,
            musicOnClick: () => {},
            musicUrl: music.audio_file_url,
            coverImageUrl: music.cover_image_url,
            genre: music.genre,
          })
        );

        // Merge: localStorage music first (newest), then backend, then dummy
        const mergedMusic = [
          ...transformedLocalMusic,
          ...transformedBackendMusic,
          ...DummyMusic
        ];
        setMusicList(mergedMusic.slice(0, 5)); // Limit to 5 songs
      } catch (error) {
        console.error("Failed to fetch music:", error);
        // Try to use localStorage music only
        const localMusic = getLocalMusic();
        if (localMusic.length > 0) {
          const transformedLocalMusic: MusicProps[] = localMusic.map((music) => ({
            musicId: music.id, // Keep original string ID
            musicTitle: music.title,
            musicCloseHour: generateRandomCloseHour(),
            musicArtist: music.artist,
            musicOnClick: () => {},
            musicUrl: music.audioFileUrl,
            coverImageUrl: music.coverImageUrl,
            genre: music.genre,
          }));
          // Merge with dummy data
          setMusicList([...transformedLocalMusic, ...DummyMusic].slice(0, 5));
        }
        // Keep using dummy data if localStorage is also empty
      }
    };

    fetchMusic();
  }, []);

  useEffect(() => {
    if (activeSong) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const loadAndPlayAudio = async () => {
        try {
          console.log('Loading audio:', activeSong.musicTitle);
          console.log('Audio URL/Reference:', activeSong.musicUrl.substring(0, 50) + '...');
          
          // Check if this is an IndexedDB reference
          let audioUrl = activeSong.musicUrl;
          if (isIndexedDBReference(activeSong.musicUrl)) {
            console.log('Loading from IndexedDB...');
            const loadedUrl = await loadMediaFromReference(activeSong.musicUrl);
            if (!loadedUrl) {
              console.error('Failed to load audio from IndexedDB');
              alert(`Tidak dapat memuat "${activeSong.musicTitle}". File audio tidak ditemukan.`);
              setIsPlaying(false);
              return;
            }
            audioUrl = loadedUrl;
            console.log('Audio loaded from IndexedDB successfully');
          }

          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          playStartTimeRef.current = Date.now(); // Track play start time

          audio.addEventListener("loadedmetadata", () => {
            console.log('Audio loaded successfully, duration:', audio.duration);
            setDuration(audio.duration);
          });

          audio.addEventListener("timeupdate", () => {
            setProgress(audio.currentTime);
            
            // Track play after 30 seconds (considered a valid play)
            if (audio.currentTime >= 30 && authenticated && user?.id) {
              const playDuration = (Date.now() - playStartTimeRef.current) / 1000;
              if (playDuration >= 30) {
                // Save play history once per session
                savePlayHistory({
                  id: generateId(),
                  musicId: String(activeSong.musicId),
                  musicTitle: activeSong.musicTitle,
                  userId: user.id,
                  playedAt: new Date().toISOString(),
                  duration: audio.currentTime,
                });
                // Reset to avoid duplicate tracking
                playStartTimeRef.current = Date.now() + 1000000; // Set far future
              }
            }
          });

          audio.addEventListener("ended", () => {
            setIsPlaying(false);
            setProgress(0);
            
            // Track full play completion
            if (authenticated && user?.id) {
              savePlayHistory({
                id: generateId(),
                musicId: String(activeSong.musicId),
                musicTitle: activeSong.musicTitle,
                userId: user.id,
                playedAt: new Date().toISOString(),
                duration: audio.duration,
              });
            }
          });

          audio.addEventListener("error", (e) => {
            console.error("Audio playback error:", e);
            console.error("Error details:", audio.error);
            console.error("Failed to load audio:", activeSong.musicUrl.substring(0, 50));
            console.error("Music title:", activeSong.musicTitle);
            alert(`Tidak dapat memutar "${activeSong.musicTitle}". Format audio mungkin tidak didukung.`);
            setIsPlaying(false);
          });

          await audio.play().catch((error) => {
            console.error("Audio play failed:", error);
            console.error("Play error for:", activeSong.musicTitle);
            setIsPlaying(false);
          });

          setIsPlaying(true);
        } catch (error) {
          console.error('Error in loadAndPlayAudio:', error);
          setIsPlaying(false);
        }
      };

      loadAndPlayAudio();

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeAttribute("src");
        }
      };
    }
  }, [activeSong, authenticated, user]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  // Klik dari MusicPoolCard
  const handleTogglePlay = (music: MusicProps) => {
    setActiveSongId((prev) => (prev === music.musicId ? null : music.musicId));
    if (activeSong?.musicId === music.musicId) {
      // Toggle jika sama
      togglePlayPause();
    } else {
      setActiveSong(music);
      setIsProfileExpanded(true); // Show artist profile when playing
    }
  };

  // Handle close/stop music
  const handleClosePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActiveSong(null);
    setActiveSongId(null);
    setIsPlaying(false);
    setProgress(0);
  };

  // Format detik → menit:detik
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Format closing hours to display
  const formatCloseTime = (hours: number) => {
    if (hours >= 24) {
      const days = hours / 24;
      return `${days} hari`;
    }
    return `${hours} jam`;
  };

  const handleCreateCampaign = (music: MusicProps) => {
    setSelectedMusicForCampaign(music);
    setShowCampaignModal(true);
  };

  return (
    <>
      <section className="flex flex-col w-[75vw] gap-[1.111vw]">
        <div className="flex flex-row justify-between items-end">
          <p className="text-[1.667vw] text-[var(--color-emas-nusantara)] font-bold font-jakarta">{title}</p>
          <button
            onClick={() => {}}
            className="cursor-pointer text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta hover:text-[var(--color-emas-nusantara)] transition-colors"
          >
            Lihat Semua
          </button>
        </div>
        <div className="w-full flex flex-row justify-center rounded-[1.042vw] bg-neutral-400 text-white"></div>
        <div className="flex flex-row gap-[2.667vw]">
          {musicList.map((music) => (
            <div
              onClick={music.musicOnClick}
              key={music.musicId}
              className="flex flex-col gap-[1.111vw]"
            >
              <MusicPoolCard
                isPlayingSong={activeSongId === music.musicId}
                onClickPlay={() => handleTogglePlay(music)}
                coverImageUrl={music.coverImageUrl}
              />
              <div className="cursor-pointer flex flex-col gap-[0.556vw]">
                <div className="flex flex-row justify-between text-start">
                  <div className="flex flex-col gap-[0.333vw]">
                    <p className="text-[var(--color-krem-lontar)] font-jakarta text-[1.111vw] font-[700]">
                      {music.musicTitle}
                    </p>
                    <p className="text-[var(--color-emas-nusantara)] font-jakarta text-[0.833vw] font-regular">
                      {music.musicArtist}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Lihat detail lagu"
                    title="Lihat detail"
                    onClick={() => {
                      setActiveSong(music);
                      setIsProfileExpanded(true);
                    }}
                    className="cursor-pointer w-[2.5vw] h-[2.5vw] min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-[var(--color-coklat-jati)] hover:bg-[var(--color-emas-nusantara)] transition-transform hover:scale-105 shadow-wayang"
                  >
                    <RiArrowRightUpLine color="var(--color-krem-lontar)" size={20} />
                  </button>
                </div>

                {/* Create Funding Pool Button - Only for Musicians */}
                {showCampaignButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateCampaign(music);
                    }}
                    className="btn-primary-nusantara w-full text-white text-[0.833vw] font-semibold py-[0.444vw] px-[0.778vw] rounded-[0.444vw] transition-colors shadow-wayang"
                  >
                    Buat Pool Pendanaan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tampilkan Detail Artist */}
      {isProfileExpanded && activeSong && (
        <ArtistProfileExpanded
          songTitle={activeSong.musicTitle}
          artist={activeSong.musicArtist}
          coverImageUrl={activeSong.coverImageUrl}
          genre={activeSong.genre}
          onClose={() => setIsProfileExpanded(false)}
        />
      )}

      {/* Create Campaign Modal */}
      {showCampaignModal && selectedMusicForCampaign && (
        <CreateCampaignModal
          musicId={String(selectedMusicForCampaign.musicId)}
          musicTitle={selectedMusicForCampaign.musicTitle}
          onClose={() => {
            setShowCampaignModal(false);
            setSelectedMusicForCampaign(null);
          }}
          onSuccess={() => {
            // Refresh music list or show success message
            console.log("Pool created successfully!");
          }}
        />
      )}

      {/* Tampilkan bar lagu di bawah layar */}
      {activeSong && (
        <div className="fixed z-[20] bottom-0 left-0 w-full aspect-[1440/96] bg-[var(--color-hitam-ebony)] border-t-2 border-[var(--color-coklat-jati)] px-[2vw] flex flex-row justify-between items-center shadow-[0_-4px_12px_rgba(0,0,0,0.5)]">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-[18.472vw] flex flex-row gap-[1.111vw] items-center">
              {/* Album Cover Image */}
              <div className="w-[3.75vw] aspect-[1/1] rounded-[0.4vw] overflow-hidden border-2 border-[var(--color-coklat-jati)] relative">
                {activeSong.coverImageUrl ? (
                  <Image
                    src={activeSong.coverImageUrl}
                    alt={activeSong.musicTitle}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--color-coklat-jati)] to-[var(--color-emas-nusantara)]" />
                )}
              </div>
              <div className="flex flex-col text-white">
                <p className="text-[1vw] font-bold font-jakarta text-[var(--color-krem-lontar)]">{activeSong.musicTitle}</p>
                <p className="text-[0.8vw] text-[var(--color-emas-nusantara)] font-jakarta">
                  {activeSong.musicArtist}
                </p>
              </div>
            </div>
            <div className="w-[55.555vw] flex flex-col items-center gap-[0.222vw]">
              <div className="flex flex-row gap-[1.111vw] w- items-center">
                <FiSkipBack size={20} color={"var(--color-coklat-jati)"} />
                {isPlaying ? (
                  <button
                    onClick={togglePlayPause}
                    className="cursor-pointer"
                    aria-label="Jeda"
                    title="Jeda"
                  >
                    <FaPauseCircle size={36} color={"var(--color-emas-nusantara)"} />
                  </button>
                ) : (
                  <button
                    onClick={togglePlayPause}
                    className="cursor-pointer"
                    aria-label="Putar"
                    title="Putar"
                  >
                    <FaPlayCircle size={36} color={"var(--color-emas-nusantara)"} />
                  </button>
                )}
                <FiSkipForward size={20} color={"var(--color-coklat-jati)"} />
              </div>
              {/* Progress bar */}

              <div className="w-full flex flex-row items-center gap-[0.5vw]">
                <span className="text-[var(--color-krem-lontar)] text-[0.7vw] font-jakarta">
                  {formatTime(progress)}
                </span>
                <progress
                  className="w-full h-[0.4vw] rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-[var(--color-coklat-jati)]/30 [&::-webkit-progress-value]:bg-[var(--color-emas-nusantara)] [&::-moz-progress-bar]:bg-[var(--color-emas-nusantara)]"
                  max={Math.max(1, Math.floor(duration))}
                  value={Math.min(Math.floor(progress), Math.max(1, Math.floor(duration)))}
                  aria-label="Kemajuan pemutaran"
                />
                <span className="text-[var(--color-krem-lontar)] text-[0.7vw] font-jakarta">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-[1vw] items-center">
              {/* Close Button */}
              <button
                onClick={handleClosePlayer}
                className="cursor-pointer w-[2.5vw] h-[2.5vw] flex items-center justify-center rounded-full bg-[var(--color-coklat-jati)]/50 hover:bg-[var(--color-merah-kebangsaan)] transition-colors border border-[var(--color-coklat-jati)]"
                aria-label="Tutup pemutar"
                title="Tutup dan hentikan musik"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-krem-lontar)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPool;
