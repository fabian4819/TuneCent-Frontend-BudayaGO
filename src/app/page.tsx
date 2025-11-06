import MusicPool from "./components/dashboard/MusicPool";
import Navbar from "./components/Navbar";
import Hero from "./components/landingpage/Hero";
import Leaderboard from "./components/music/Leaderboard";
import TopArtist from "./components/landingpage/TopArtist";

export default function Home() {
  return (
    <div className="flex flex-col gap-[3.333vw] items-center justify-center overflow-x-hidden bg-black font-sans min-h-screen relative">
      {/* Animated Top & Bottom Pattern Borders */}
      <div className="batik-top-border" />
      <div className="batik-bottom-border" />

      {/* Animated Corner Patterns - Stay in Corners */}
      <div className="batik-corner-pattern batik-corner-top-left" />
      <div className="batik-corner-pattern batik-corner-top-right" />
      <div className="batik-corner-pattern batik-corner-bottom-left" />
      <div className="batik-corner-pattern batik-corner-bottom-right" />

      {/* Animated Side Borders */}
      <div className="batik-side-border batik-left-border" />
      <div className="batik-side-border batik-right-border" />

      {/* Floating Accent Patterns - Small Corner Accents */}
      <div className="batik-floating-accent batik-accent-tl" />
      <div className="batik-floating-accent batik-accent-tr" />
      <div className="batik-floating-accent batik-accent-bl" />
      <div className="batik-floating-accent batik-accent-br" />

      <Navbar />
      <main className="flex flex-col w-[75vw] gap-[5.556vw] py-[2.222vw] pt-[var(--nav-h)] row-start-2 sm:items-start relative z-[1]">
        <Hero />

        {/* Gorga Divider */}
        <div className="divider-gorga w-full my-8" />

        <MusicPool title="Lagu Trending" />

        {/* Gorga Divider */}
        <div className="divider-gorga w-full my-8" />

        <TopArtist />

        {/* Gorga Divider */}
        <div className="divider-gorga w-full my-8" />

        <div className="w-full flex flex-row justify-between gap-[1.111vw]">
          <Leaderboard />
          <Leaderboard category="Music" />
        </div>
      </main>
    </div>
  );
}
