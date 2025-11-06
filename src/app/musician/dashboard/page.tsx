import HeroDashboard from "@/app/components/dashboard/HeroDashboard";
import MusicPool from "@/app/components/dashboard/MusicPool";
import SmartContractAudit from "@/app/components/dashboard/SmartContractAudit";

export default function DashboardMusisi() {
  return (
    <section className="flex flex-col w-full gap-[2.222vw] relative">
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
