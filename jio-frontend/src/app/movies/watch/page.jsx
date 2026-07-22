// import ShareButton from "@/components/atom/ShareButton";
import WishlistButton from "../../../components/section/WatchlistButton";
import { buttonVariants } from "@/components/ui/button";
import { api, ENDPOINT } from "@/lib/api";
import { FilmIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = async ({ searchParams }) => {
  const { id, poster_path } = await searchParams;
  const res = await api.get(ENDPOINT.getMovieDetails(id));
  const videos = await api.get(ENDPOINT.getMovieVideos(id));

  // ✅ check if your backend returns .result or .results
  const key = videos.data?.response?.results?.[0]?.key;
  const details = res.data?.response;

  console.log("id", id);
  console.log(details);
  console.log(key);
  console.log("posterpath", poster_path);

  return (
    <div className="mt-[50px]">
      {details ? (
        <>
          {/* YouTube trailer */}
          {key ? (
            <iframe
              className="w-full aspect-video lg:h-[70vh]"
              src={`https://www.youtube.com/embed/${key}`}
              title="YouTube Trailer"
              allow="fullscreen"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-center text-gray-500">No trailer available</p>
          )}

          <div className="flex flex-wrap gap-4 px-4 lg:px-10 py-8 items-center">
            <h1 className="text-2xl font-bold">
              {details.name || details.title}
            </h1>
            <WishlistButton
              wishlist={{
                id: details.id,
                name: details.name || details.title,
                media_type: "movies",
                poster_path: poster_path,
              }}
            />
            {/* <ShareButton /> */}
          </div>
        </>
      ) : (
        // error fallback
        <div className="w-full h-[60vh] flex flex-col gap-4 items-center justify-center text-slate-400">
          <FilmIcon className="w-[100px] h-[100px]" />
          <p>Uh Oh! Video is unavailable.</p>
          <Link href={"/"} className={buttonVariants()}>
            Take me Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
