"use client";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Image from 'next/image';
import { useMemo } from 'react';
import { RiMenuLine } from 'react-icons/ri';

interface NavbarProps {
  onToggleSidebar?: () => void;
  showHamburger?: boolean;
  userRole?: "Creator" | "User";
}

const Navbar = ({ onToggleSidebar, showHamburger = false, userRole }: NavbarProps) => {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get username from various sources (same logic as ProfileRow)
  const username = useMemo(() => {
    if (!authenticated || !user) return "Guest";

    // Priority: Twitter username > Discord username > GitHub username > Email name > Wallet address
    if (user.twitter?.username) return user.twitter.username;
    if (user.discord?.username) return user.discord.username;
    if (user.github?.username) return user.github.username;
    if (user.email?.address) {
      // Extract name part from email (before @)
      const emailName = user.email.address.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    if (wallets.length > 0) {
      return formatAddress(wallets[0].address);
    }

    return "User";
  }, [authenticated, user, wallets]);

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
      <div className="w-[80vw] flex flex-row justify-between items-center relative z-10">
        <div className="flex flex-row items-center gap-[0.833vw]">
          {/* Hamburger Menu */}
          {showHamburger && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="w-[2.5vw] h-[2.5vw] flex items-center justify-center rounded-full bg-[var(--color-coklat-jati)] hover:bg-[var(--color-emas-nusantara)] transition-colors shadow-wayang border-2 border-[var(--color-emas-nusantara)]/30 mr-[0.556vw]"
              aria-label="Toggle sidebar"
            >
              <RiMenuLine className="w-[1.25vw] h-[1.25vw] text-[var(--color-krem-lontar)]" />
            </button>
          )}

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

        {/* Privy Login/Logout Button */}
        {ready && !authenticated ? (
          <button
            onClick={login}
            className="btn-primary-nusantara px-[1.5vw] py-[0.5vw] text-[0.889vw]"
          >
            Login
          </button>
        ) : ready && authenticated ? (
          <div className="flex flex-row items-center gap-[0.833vw]">
            {/* User Info with Role */}
            <div className="flex flex-row items-center gap-[0.556vw] px-[1vw] py-[0.5vw] bg-gradient-to-r from-[var(--color-emas-nusantara)]/20 to-[var(--color-oranye-terracotta)]/20 rounded-[0.5vw] border border-[var(--color-emas-nusantara)]/30">
              <p className="text-[var(--color-krem-lontar)] font-jakarta text-[0.889vw] font-semibold">
                {username}
              </p>
              {userRole && (
                <>
                  <div className="w-[0.139vw] h-[0.833vw] bg-[var(--color-emas-nusantara)]/40" />
                  <p className="text-[var(--color-emas-nusantara)] font-jakarta text-[0.778vw] font-medium">
                    {userRole}
                  </p>
                </>
              )}
            </div>
            <button
              onClick={logout}
              className="px-[1.5vw] py-[0.5vw] border-2 border-[var(--color-coklat-jati)] rounded-[0.5vw] text-white font-jakarta font-medium text-[0.889vw] hover:bg-[var(--color-coklat-jati)] transition-colors"
            >
              Logout
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
