"use client";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Image from 'next/image';

const Navbar = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  // Get the first wallet (primary wallet)
  const wallet = wallets[0];

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[var(--nav-h)] flex flex-row justify-center p-[1.667vw] bg-[#0A0A0A] z-[100] border-b-2 border-[var(--color-coklat-jati)]/30 overflow-hidden">
      {/* Subtle Batik Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/patterns/songket-pattern.svg')",
          backgroundSize: "200px",
          backgroundRepeat: "repeat"
        }}
      />
      <div className="w-[80vw] flex flex-row justify-between relative z-10">
        <div className="flex flex-row items-center gap-[0.833vw]">
          <Image
            src="/assets/logo.png"
            alt="TuneCent Logo"
            width={64}
            height={64}
            className="w-[3.333vw] h-[3.333vw] object-contain"
          />
          <div className="flex flex-col gap-[0.222vw] text-white">
            <p className="font-jakarta font-bold text-[1.111vw] text-white">
              TuneCent Indonesia
            </p>
            <p className="font-jakarta text-[0.889vw] text-[var(--color-emas-nusantara)]">
              Miliki Suara Anda
            </p>
          </div>
        </div>
        {/* <div className="relative flex flex-row justify-center items-center w-[32.917vw] gap-[1.778vw] aspect-[474/44] rounded-[1.042vw] bg-gradient-to-r from-[#8B609B]/20 to-[#302135]/20">
            {NavbarMenu.map((menuKey) => (
              <button
                key={menuKey.menuName}
                onClick={() => handleClickMenu(menuKey.link)}
              >
                <p className="cursor-pointer text-white font-jakarta font-regular text-[1.111vw]">
                  {menuKey.menuName}
                </p>
              </button>
            ))}
          </div> */}

        {/* Privy Login/Logout Button */}
        {ready && !authenticated ? (
          <button
            onClick={login}
            className="btn-primary-nusantara px-[1.5vw] py-[0.5vw] text-[0.889vw]"
          >
            Hubungkan Dompet
          </button>
        ) : ready && authenticated ? (
          <div className="flex flex-row items-center gap-[0.833vw]">
            {wallet && (
              <div className="px-[1vw] py-[0.5vw] bg-gradient-to-r from-[var(--color-emas-nusantara)]/20 to-[var(--color-oranye-terracotta)]/20 rounded-[0.5vw] text-[var(--color-emas-nusantara)] font-jakarta text-[0.778vw] border border-[var(--color-emas-nusantara)]/30">
                {formatAddress(wallet.address)}
              </div>
            )}
            <button
              onClick={logout}
              className="px-[1.5vw] py-[0.5vw] border-2 border-[var(--color-coklat-jati)] rounded-[0.5vw] text-white font-jakarta font-medium text-[0.889vw] hover:bg-[var(--color-coklat-jati)] transition-colors"
            >
              Putuskan
            </button>
          </div>
        ) : (
          <div className="px-[1.5vw] py-[0.5vw] bg-gradient-to-r from-[var(--color-emas-nusantara)]/20 to-[var(--color-oranye-terracotta)]/20 rounded-[0.5vw] text-white/50 font-jakarta text-[0.889vw]">
            Memuat...
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
