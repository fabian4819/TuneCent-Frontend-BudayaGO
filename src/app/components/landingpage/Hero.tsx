"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NusantaraIcon from "../common/NusantaraIcon";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="w-full flex flex-col gap-[1.528vw] justify-center items-center relative min-h-[60vh] py-[4vw]">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />

      {/* Content */}
      <div className="flex flex-col w-[68vw] text-center relative z-10">
        <p className="font-bold font-jakarta text-[5vw] text-gradient-emas whitespace-nowrap drop-shadow-lg">
          Karena Setiap Nada
          <br />
          Berhak Mendapat Haknya
        </p>
        <p className="text-[1.2vw] text-[var(--color-emas-nusantara)] font-jakarta mt-2">
          TuneCent Indonesia
        </p>
      </div>
      <p className="font-regular font-jakarta text-[1.667vw] text-white text-center relative z-10 max-w-[60vw] leading-relaxed">
        Miliki suara Anda. Raih penghasilan yang layak. Tanpa label. Tanpa perantara.
        <br />
        Hanya Anda dan pendengar Anda di blockchain
      </p>
      <div className="w-[60vw] flex flex-row justify-center gap-[1.111vw] relative z-10">
        <button
          onClick={() => {
            router.push("/user/home");
          }}
          className="btn-secondary-nusantara cursor-pointer w-[16.25vw] flex flex-row justify-center items-center gap-[0.5vw] transition-nusantara hover:scale-105"
        >
          <NusantaraIcon icon="angklung-note" size={20} />
          <p className="text-[0.972vw] font-jakarta font-semibold">
            Temukan Musik
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/musician/dashboard");
          }}
          className="btn-primary-nusantara cursor-pointer w-[16.25vw] flex flex-row justify-center items-center gap-[0.5vw]"
        >
          <NusantaraIcon icon="gamelan-icon" size={20} />
          <p className="text-[0.972vw] font-jakarta font-semibold">
            Mulai Berkarya
          </p>
        </button>
      </div>
    </section>
  );
};

export default Hero;
