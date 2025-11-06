import React from "react";
import SideBar from "../components/SideBar";
import ProfileRow from "../components/dashboard/ProfileRow";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-black w-full min-h-screen pt-[8vw]">
      <SideBar variant={"user"} />
      <div className="ml-[17.222vw] w-[calc(100vw-17.222vw)] flex flex-col px-[2.222vw] py-[1.111vw] gap-[1.111vw]">
        <div className="w-full">
          <ProfileRow userRole="User" />
        </div>
        <div className="">{children}</div>
      </div>
    </section>
  );
};

export default UserLayout;
