"use client";
import { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import MusicPool from "@/app/components/dashboard/MusicPool";
import TopArtist from "@/app/components/landingpage/TopArtist";

const UserSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality with API
  };

  return (
    <section className="flex flex-col w-full gap-[2.222vw]">
      <div className="flex flex-col gap-[1.111vw]">
        <h1 className="text-white font-jakarta font-bold text-[2.222vw]">
          Search
        </h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {searchQuery ? (
        <div className="flex flex-col gap-[2.222vw]">
          <p className="text-white font-jakarta text-[1.111vw]">
            Search results for &quot;{searchQuery}&quot;
          </p>
          <MusicPool title="Songs" />
          <TopArtist />
        </div>
      ) : (
        <div className="flex flex-col gap-[2.222vw]">
          <MusicPool title="Popular Songs" />
          <TopArtist />
        </div>
      )}
    </section>
  );
};

export default UserSearchPage;
