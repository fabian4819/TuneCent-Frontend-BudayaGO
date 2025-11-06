"use client";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { usePrivy } from '@privy-io/react-auth';
import TransactionSuccessModal from "@/app/components/common/TransactionSuccessModal";
import { saveMusic, generateId } from "@/app/utils/localStorage";
import { saveAudioFile, saveImageFile } from "@/app/utils/indexedDB";

export default function CreateUploadForm() {
  const { authenticated, user } = usePrivy();

  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerURL, setBannerURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);
  const [isProcessingBanner, setIsProcessingBanner] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{
    title: string;
    artist: string;
    genre: string;
    audioUrl: string;
    bannerUrl: string | null;
  } | null>(null);

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleArtist = (event: ChangeEvent<HTMLInputElement>) => {
    setArtist(event.target.value);
  };

  const handleGenre = (event: ChangeEvent<HTMLInputElement>) => {
    setGenre(event.target.value);
  };

  const handleDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleDuration = (event: ChangeEvent<HTMLInputElement>) => {
    setDuration(event.target.value);
  };

  const handleAudioUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setIsProcessingAudio(true);
      
      try {
        // Create preview URL (temporary, for preview only)
        const previewUrl = URL.createObjectURL(file);
        setAudioUrl(previewUrl);
        
        console.log('Audio file uploaded:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        setIsProcessingAudio(false);
      } catch (error) {
        console.error('Error processing audio:', error);
        alert("Gagal memproses file audio. Mohon coba lagi.");
        setIsProcessingAudio(false);
      }
    } else {
      alert("Mohon unggah file audio yang valid (MP3/WAV).");
    }
  };

  const handleBannerUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setIsProcessingBanner(true);
      
      try {
        // Create preview URL (temporary, for preview only)
        const previewUrl = URL.createObjectURL(file);
        setBannerURL(previewUrl);
        
        console.log('Banner image uploaded:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        setIsProcessingBanner(false);
      } catch (error) {
        console.error('Error processing banner:', error);
        alert("Gagal memproses gambar banner. Mohon coba lagi.");
        setIsProcessingBanner(false);
      }
    }
  };

  const handleCreateKarya = async () => {
    // Validation
    if (!authenticated) {
      alert("Mohon login terlebih dahulu");
      return;
    }

    if (!title || !artist || !audioFile) {
      alert("Mohon isi semua kolom yang diperlukan (Judul, Artis, dan File Audio)");
      return;
    }

    try {
      setIsUploading(true);

      // Get user ID for creator tracking
      const userId = user?.id || "guest";

      // Convert duration MM:SS to seconds
      let durationInSeconds = 180; // default 3 minutes
      if (duration) {
        const parts = duration.split(':');
        if (parts.length === 2) {
          durationInSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
      }

      // Generate unique ID for this music
      const musicId = generateId();

      // Save audio file to IndexedDB and get reference
      let audioReference = audioUrl;
      if (audioFile) {
        console.log('Saving audio file to IndexedDB...');
        audioReference = await saveAudioFile(musicId, audioFile);
        console.log('Audio saved with reference:', audioReference);
      }

      // Save banner image to IndexedDB if exists
      let bannerReference = '/assets/default-cover.png';
      if (bannerFile) {
        console.log('Saving banner image to IndexedDB...');
        bannerReference = await saveImageFile(musicId, bannerFile);
        console.log('Banner saved with reference:', bannerReference);
      }

      // Save music metadata to localStorage with IndexedDB references
      const musicData = {
        id: musicId,
        title,
        artist,
        genre: genre || "General",
        description: description || "",
        duration: durationInSeconds,
        coverImageUrl: bannerReference,
        audioFileUrl: audioReference, // This is the IndexedDB reference
        creatorAddress: userId,
        createdAt: new Date().toISOString(),
      };

      saveMusic(musicData);
      console.log('Music saved to localStorage with IndexedDB reference:', musicData);

      // Set success data for modal
      setSuccessData({
        title,
        artist,
        genre: genre || "General",
        audioUrl,
        bannerUrl: bannerURL,
      });

      // Show success modal after short delay
      setTimeout(() => {
        setShowSuccessModal(true);
        setIsUploading(false);
      }, 500);

    } catch (error) {
      console.error("Error creating music:", error);
      alert("Gagal mendaftarkan musik. Mohon coba lagi.");
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Reset form
    setTitle("");
    setArtist("");
    setGenre("");
    setDescription("");
    setDuration("");
    setAudioFile(null);
    setAudioUrl("");
    setBannerURL(null);
    setSuccessData(null);
  };

  return (
    <div className="w-full flex flex-col items-center gap-[2.222vw]">
      <div className="w-full grid grid-rows-3 grid-cols-2 gap-[1.667vw]">
        <div className="flex flex-col gap-[0.444vw]">
          <p className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">Judul</p>
          <div className="flex flex-col gap-[0.444vw]">
            <div className="flex flex-row w-[37.5vw] border-[0.056vw] border-[var(--color-coklat-jati)] rounded-[0.556vw] bg-black p-[0.778vw]">
              <input
                className="w-full text-[var(--color-krem-lontar)] bg-transparent font-jakarta text-[1.111vw] border-0 outline-0"
                type="text"
                value={title}
                placeholder="Contoh: Rayuan Pulau Kelapa"
                onChange={handleTitle}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[0.444vw]">
          <p className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">Artis</p>
          <div className="flex flex-col gap-[0.444vw]">
            <div className="flex flex-row w-[37.5vw] border-[0.056vw] border-[var(--color-coklat-jati)] rounded-[0.556vw] bg-black p-[0.778vw]">
              <input
                className="w-full text-[var(--color-krem-lontar)] bg-transparent font-jakarta text-[1.111vw] border-0 outline-0"
                type="text"
                value={artist}
                placeholder="Nama Artis"
                onChange={handleArtist}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[0.444vw]">
          <p className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">Genre</p>
          <div className="flex flex-col gap-[0.444vw]">
            <div className="flex flex-row w-[37.5vw] border-[0.056vw] border-[var(--color-coklat-jati)] rounded-[0.556vw] bg-black p-[0.778vw]">
              <input
                className="w-full text-[var(--color-krem-lontar)] bg-transparent font-jakarta text-[1.111vw] border-0 outline-0"
                type="text"
                value={genre}
                placeholder="Pop, Dangdut, Rock, dll"
                onChange={handleGenre}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[0.444vw]">
          <p className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">Deskripsi</p>
          <div className="flex flex-col gap-[0.444vw]">
            <div className="flex flex-row w-[37.5vw] border-[0.056vw] border-[var(--color-coklat-jati)] rounded-[0.556vw] bg-black p-[0.778vw]">
              <input
                className="w-full text-[var(--color-krem-lontar)] bg-transparent font-jakarta text-[1.111vw] border-0 outline-0"
                type="text"
                value={description}
                placeholder="Ceritakan tentang karya Anda..."
                onChange={handleDescription}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[0.444vw]">
          <p className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">Durasi</p>
          <div className="flex flex-col gap-[0.444vw]">
            <div className="flex flex-row w-[37.5vw] border-[0.056vw] border-[var(--color-coklat-jati)] rounded-[0.556vw] bg-black p-[0.778vw]">
              <input
                className="w-full text-[var(--color-krem-lontar)] bg-transparent font-jakarta text-[1.111vw] border-0 outline-0"
                type="text"
                value={duration}
                placeholder="Format (MM:SS)"
                onChange={handleDuration}
              />
            </div>
          </div>
        </div>
        {/* 🎧 Upload Song */}
        <div className="flex flex-col gap-[0.444vw]">
          <p className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">
            Unggah Lagu Anda
          </p>
          <div className="flex flex-col gap-[0.556vw]">
            {/* Input file */}
            <label className="cursor-pointer flex flex-row items-center justify-between w-[37.5vw] border-[0.069vw] border-[var(--color-coklat-jati)] rounded-[0.556vw] bg-black p-[0.778vw] hover:bg-[var(--color-coklat-jati)]/10 transition-all">
              <span className="text-[var(--color-krem-lontar)] font-jakarta text-[1.111vw]">
                {isProcessingAudio 
                  ? "Memproses file audio..." 
                  : audioFile 
                    ? audioFile.name 
                    : "Pilih File Audio (.mp3, .wav)"}
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
                disabled={isProcessingAudio}
              />
            </label>

            {/* Preview */}
            {audioUrl && !isProcessingAudio && (
              <div className="flex flex-col gap-[0.333vw]">
                <p className="text-[var(--color-emas-nusantara)]/70 font-jakarta text-[0.833vw]">
                  Preview Audio:
                </p>
                <audio
                  controls
                  src={audioUrl}
                  className="w-[37.5vw] rounded-[0.556vw] bg-neutral-800"
                />
              </div>
            )}
          </div>
        </div>
        {/* Upload Banner */}
        <div className="flex flex-col gap-[0.444vw]">
          <p className="text-[var(--color-emas-nusantara)] text-[0.972vw] font-medium font-jakarta">
            Unggah Banner Musik
          </p>
          <div className="flex flex-col gap-[0.556vw]">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="cursor-pointer w-[37.5vw] text-[var(--color-krem-lontar)] font-jakarta text-[0.972vw] border-[0.069vw] border-[var(--color-coklat-jati)] p-[0.778vw] rounded-[0.556vw] bg-black"
            />
            {bannerURL && (
              <div className="relative w-[37.5vw] h-[15vw] mt-[0.5vw]">
                <Image
                  src={bannerURL}
                  alt="Music Banner Preview"
                  fill
                  className="object-cover rounded-[0.556vw] border-[0.056vw] border-white"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleCreateKarya}
        disabled={isUploading || !authenticated}
        className="btn-primary-nusantara cursor-pointer w-[37.5vw] flex flex-row aspect-[408/36] justify-center items-center rounded-[0.556vw] disabled:opacity-50 disabled:cursor-not-allowed shadow-wayang"
      >
        <p className="text-[0.972vw] text-white font-jakarta font-semibold">
          {isUploading
            ? "Menyimpan..."
            : !authenticated
            ? "Login Terlebih Dahulu"
            : "Buat Karya"}
        </p>
      </button>

      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        transactionHash={null}
        title="Musik Berhasil Dibuat!"
      >
        <div className="space-y-[1.111vw]">
          <div className="bg-black border border-[var(--color-coklat-jati)] rounded-[0.556vw] p-[1.111vw]">
            <h3 className="font-semibold font-jakarta text-[var(--color-emas-nusantara)] text-[1.111vw] mb-[0.833vw]">Detail Musik</h3>
            <div className="space-y-[0.556vw]">
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Judul:</span>
                <span className="font-medium text-[var(--color-krem-lontar)] text-[0.833vw] font-jakarta">{successData?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Artis:</span>
                <span className="font-medium text-[var(--color-krem-lontar)] text-[0.833vw] font-jakarta">{successData?.artist}</span>
              </div>
              {successData?.genre && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-krem-lontar)]/70 text-[0.833vw] font-jakarta">Genre:</span>
                  <span className="font-medium text-[var(--color-krem-lontar)] text-[0.833vw] font-jakarta">{successData?.genre}</span>
                </div>
              )}
            </div>
          </div>

          {successData?.audioUrl && (
            <div>
              <p className="text-[0.833vw] text-[var(--color-emas-nusantara)] font-jakarta mb-[0.556vw]">Preview:</p>
              <audio
                controls
                src={successData.audioUrl}
                className="w-full rounded-[0.556vw]"
              />
            </div>
          )}

          {successData?.bannerUrl && (
            <div className="relative w-full h-[8.889vw]">
              <Image
                src={successData.bannerUrl}
                alt="Music Banner"
                fill
                className="object-cover rounded-[0.556vw] border border-white-darker"
                unoptimized
              />
            </div>
          )}
        </div>
      </TransactionSuccessModal>
    </div>
  );
}
