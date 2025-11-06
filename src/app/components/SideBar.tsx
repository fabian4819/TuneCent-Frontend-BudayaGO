"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  RiDashboardLine,
  RiMusic2Line,
  RiFolderMusicLine,
  RiAddCircleLine,
  RiWalletLine,
  RiHome5Line,
  RiSearchLine,
  RiLineChartLine,
  RiSettings3Line,
  RiLogoutBoxRLine,
} from "react-icons/ri";

interface SideBarProps {
  variant?: "musician" | "user";
  isOpen: boolean;
  onToggle: () => void;
}
interface SideBarMenuProps {
  id: number;
  menu: string;
  icon: React.ElementType;
  link: string;
}

const SideBarMenuMusician: SideBarMenuProps[] = [
  { id: 1, menu: "Dashboard", icon: RiDashboardLine, link: "dashboard" },
  { id: 2, menu: "Music", icon: RiMusic2Line, link: "music" },
  { id: 3, menu: "Portofolio", icon: RiFolderMusicLine, link: "portofolio" },
  { id: 4, menu: "Create", icon: RiAddCircleLine, link: "create" },
  { id: 5, menu: "Wallet", icon: RiWalletLine, link: "wallet" },
];

const SideBarMenuUser: SideBarMenuProps[] = [
  { id: 1, menu: "Home", icon: RiHome5Line, link: "home" },
  { id: 2, menu: "Search", icon: RiSearchLine, link: "search" },
  { id: 3, menu: "Invest", icon: RiLineChartLine, link: "invest" },
  { id: 4, menu: "Settings", icon: RiSettings3Line, link: "settings" },
  { id: 5, menu: "Sign Out", icon: RiLogoutBoxRLine, link: "" },
];

const SideBar = ({ variant = "musician", isOpen, onToggle }: SideBarProps) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>(() =>
    variant === "musician" ? "Dashboard" : "Home"
  );

  const handleClickMenu = (menu: string, link: string) => {
    setActiveMenu(menu);
    if (variant === "musician") router.push(`/musician/${link.toLowerCase()}`);
    else {
      if (menu === "Sign Out") router.push("/");
      else router.push(`/user/${link.toLowerCase()}`);
    }
  };

  return (
    <div className={`fixed left-0 top-[var(--nav-h)] h-[calc(100vh-var(--nav-h))] flex flex-col bg-neutral-black-base w-[17.222vw] px-[1.111vw] py-[1.667vw] gap-[2vw] overflow-y-auto transition-transform duration-300 ease-in-out z-40 border-r-2 border-[var(--color-coklat-jati)]/30 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button
        onClick={() => router.push("/")}
        className="flex flex-row gap-[0.556vw] items-center cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="w-[4.167vw] aspect-[60/47] relative">
          <Image
            src="/assets/logo.png"
            alt="TuneCent Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="font-jakarta flex flex-col">
          <p className="text-[1.25vw] font-bold text-white">TuneCent</p>
          <p className="text-[0.833vw] font-regular text-white">
            Own your sound
          </p>
        </div>
      </button>

      {variant === "musician" ? (
        <div className="flex flex-col gap-[0.667vw] w-full">
          {SideBarMenuMusician.map((key) => {
            const IconComponent = key.icon;
            return (
              <button
                key={key.id}
                onClick={() => {
                  handleClickMenu(key.menu, key.link);
                }}
                className={
                  activeMenu === key.menu
                    ? `cursor-pointer w-full aspect-[228/65] flex flex-row items-center px-[1vw] gap-[1.111vw] bg-purple-base rounded-[0.486vw]`
                    : `cursor-pointer w-full aspect-[228/65] flex flex-row items-center px-[1vw] gap-[1.111vw] rounded-[0.486w]`
                }
              >
                <IconComponent className="w-[1.5vw] h-[1.5vw] text-white" />
                <p className="text-[1vw] font-jakarta text-white">{key.menu}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-[0.667vw] w-full">
          {SideBarMenuUser.map((key) => {
            const IconComponent = key.icon;
            return (
              <button
                key={key.id}
                onClick={() => {
                  handleClickMenu(key.menu, key.link);
                }}
                className={
                  activeMenu === key.menu
                    ? `cursor-pointer w-full aspect-[228/65] flex flex-row items-center px-[1vw] gap-[1.111vw] bg-purple-base rounded-[0.486vw]`
                    : `cursor-pointer w-full aspect-[228/65] flex flex-row items-center px-[1vw] gap-[1.111vw] rounded-[0.486w]`
                }
              >
                <IconComponent className="w-[1.5vw] h-[1.5vw] text-white" />
                <p className="text-[1vw] font-jakarta text-white">{key.menu}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SideBar;
