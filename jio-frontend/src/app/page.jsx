import React from "react";
import BannerSection from "../components/section/BannerSection";
import { api, ENDPOINT } from "@/lib/api";
import CategoriesSection from "../components/section/CategoriesSection";
const list = [
  {
    label: "Top Rated",
    href: "top-rated",
    fetcher: async function getTopRatedData() {
      const resp = await api.get(ENDPOINT.discoverTopRated);
      const data = resp?.data?.response?.results;
      return [data,""];
    },
  },
  {
    label: "Popular",
    href: "popular",
    fetcher: async function getPopular() {
      const resp = await api.get(ENDPOINT.discoverTrending);
      const data = resp?.data?.response?.results;
      return [data,""];
    },
  },
  {
    label: "Upcoming",
    href: "upcoming",
    fetcher: async function getUpcoming() {
      const resp = await api.get(ENDPOINT.discoverUpcoming);
      const data = resp?.data?.response?.results;
      return [data,""];
    },
  },
];
const getMoviesBannerData = async () => {
  const res = await api.get(ENDPOINT.fetchAnimeMovies);
  // console.log("Movies Banner Data:", res); // Log the data for debugging
  return [res.data?.response?.results,""];
};

export default function Home() {
  return (
    <div className="w-full rounded-lg flex flex-col gap-8">
      <BannerSection fetcher={getMoviesBannerData} />
      {list.map((item) => (
        <CategoriesSection
          className="scroll-container"
          key={item.href}
          title={item.label}
          id={item.href}
          fetcher={item.fetcher}
        />
      ))}
    </div>
  );
}
