"use client";

import React, { useState } from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

const MusicianLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="bg-black w-full min-h-screen pt-[var(--nav-h)]">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showHamburger={true}
        userRole="Creator"
      />
      <SideBar
        variant="musician"
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="w-full flex flex-row justify-center pt-[2.222vw]">
        <div className="w-[80vw] flex flex-col">
          {children}
        </div>
      </div>
    </section>
  );
};

export default MusicianLayout;
