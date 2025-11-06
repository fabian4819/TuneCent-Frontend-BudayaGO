import NFTList from "@/app/components/portofolio/NFTList";
import PortofolioValue from "@/app/components/portofolio/PortofolioValue";

const PortofolioPage = () => {
  return (
    <section className="w-full flex flex-col bg-black gap-[1.667vw]">
      <p className="font-jakarta font-bold text-white text-[1.667vw]">
        Your Trending Pool Music
      </p>
      <div className="flex flex-col w-full p-[1.111vw] gap-[0.667vw]">
        <p className="font-jakarta text-white text-[1.389vw]">Studio</p>
        <div className="flex flex-row justify-between">
          <PortofolioValue />
          <NFTList />
        </div>
      </div>
      <div className="flex flex-col w-full p-[1.111vw] gap-[0.667vw]">
        <p className="font-jakarta text-white text-[1.389vw]">Portofolio</p>
        <div className="flex flex-row justify-between">
          <PortofolioValue />
          <NFTList />
        </div>
      </div>
    </section>
  );
};

export default PortofolioPage;
