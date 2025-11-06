import HeroDashboard from "@/app/components/dashboard/HeroDashboard";
import MusicPool from "@/app/components/dashboard/MusicPool";
import SmartContractAudit from "@/app/components/dashboard/SmartContractAudit";

export default function DashboardMusisi() {
  return (
    <section className="flex flex-col w-[75vw] gap-[2.222vw] relative">
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

      <HeroDashboard />

      {/* Gorga Divider */}
      <div className="divider-gorga w-full my-6" />

      <MusicPool title="Musik Anda" showCampaignButton={true} />

      {/* Gorga Divider */}
      <div className="divider-gorga w-full my-6" />

      <MusicPool title="Pool Pendanaan" showCampaignButton={true} />

      {/* Gorga Divider */}
      <div className="divider-gorga w-full my-6" />

      <SmartContractAudit isLanding={false} />
    </section>
  );
}
