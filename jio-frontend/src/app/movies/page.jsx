import React from "react";
import BannerSection from "../../components/section/BannerSection";
import CategoriesSection from "../../components/section/CategoriesSection";
import { api, ENDPOINT } from "@/lib/api";

// ✅ Category list with fetchers
const list = [
  {
    label: "Top Comedy Movies",
    href: "comedy",
    fetcher: async () => {
      const res = await api.get(ENDPOINT.fetchComedyMovies);
      return [res.data?.response?.results || [], "movies"];
    },
  },
  {
    label: "Top Horror Movies",
    href: "horror",
    fetcher: async () => {
      const res = await api.get(ENDPOINT.fetchHorrorMovies);
      return [res.data?.response?.results || [], "movies"];
    },
  },
  {
    label: "Top Romance Movies",
    href: "romance",
    fetcher: async () => {
      const res = await api.get(ENDPOINT.fetchRomanceMovies);
      return [res.data?.response?.results || [], "movies"];
    },
  },
  {
    label: "Top Action Movies",
    href: "action",
    fetcher: async () => {
      const res = await api.get(ENDPOINT.fetchActionMovies);
      return [res.data?.response?.results || [], "movies"];
    },
  },
];

// ✅ Banner Section Fetcher
const getMoviesBannerData = async () => {
  const res = await api.get(ENDPOINT.fetchAnimeMovies);
  const data = [res.data?.response?.results || [], "movies"];
  // console.log("Movies Banner Data:", data);
  return data;
};

export default function MoviesPage() {
  return (
    <div className="w-full rounded-lg flex flex-col gap-8">
      {/* Banner Section */}
      <BannerSection fetcher={getMoviesBannerData} />

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
