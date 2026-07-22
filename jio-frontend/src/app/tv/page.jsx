import React from "react";
import BannerSection from "../../components/section/BannerSection";
import CategoriesSection from "../../components/section/CategoriesSection";
import { api, ENDPOINT } from "@/lib/api";

// Category list with fetchers
const list = [
  {
    label: "Comedy",
    href: "comedy",
    fetcher: async () => {
      const res = await api.get(ENDPOINT.fetchComedyTvShows);
      return [res.data?.response?.results || [], "tv"];
    },
  },
  {
    label: "Crime",
    href: "crime",
    fetcher: async () => {
      const res = await api.get(ENDPOINT.fetchCrimeTvShows);
      return [res.data?.response?.results || [], "tv"];
    },
  },
  {
    label: "Drama",
    href: "drama",
    fetcher: async () => {
      const res = await api.get(ENDPOINT.fetchDramaTvShows);
      return [res.data?.response?.results || [], "tv"];
    },
  },
  {
    label: "Action",
    href: "action",
    fetcher: async () => {
      const res = await api.get(ENDPOINT.fetchActionTvShows);
      return [res.data?.response?.results || [], "tv"];
    },
  },
];

// Banner Section Fetcher
const getTvBannerData = async () => {
  const res = await api.get(ENDPOINT.fetchMysteryTvShows);
  const data = [res.data?.response?.results || [], "tv"];
  // console.log("TV Banner Data:", data);
  return data;
};

export default function TvPage() {
  return (
    <div className="w-full rounded-lg flex flex-col gap-8">
      {/* Banner Section */}
      <BannerSection fetcher={getTvBannerData} />

      {/* Categories Section */}
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
