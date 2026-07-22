import React, { Suspense } from "react";
import { Skeleton } from "../ui/Skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { getWatchUrl, media } from "@/lib/api";
import { InboxIcon } from "lucide-react";
import { getWatchUrlhome } from "@/lib/api";

function BannerSection({ fetcher }) {
  return (
    <Suspense fallback={<BannerSectionFallback />}>
      {/* BannerSectionContent is a server component, so it can be async */}
      <BannerSectionContent fetcher={fetcher} />
    </Suspense>
  );
}

// ✅ Server Component can be async
async function BannerSectionContent({ fetcher }) {
  const data = await fetcher();
  const result = data?.[0]; // safer access
  const mediaType = data?.[1]; // "tv" or "movie"

  if (!result || result.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[400px] py-12">
        <InboxIcon
          className="w-32 h-32 text-slate-400 mb-10"
          strokeWidth={1.2}
        />
        <p className="text-lg text-gray-500">No items found.</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{ align: "center", loop: true }}
      className="w-full px-4 md:px-0"
    >
      <CarouselContent>
        {result.map((vid) => (
          <CarouselItem key={vid.id} className="w-full max-w-[650px] h-[500px]">
            <Link
              href={
                mediaType?.length != 0
                  ? getWatchUrl(vid?.id, mediaType, vid?.poster_path)
                  : getWatchUrlhome(vid?.id, vid?.poster_path)
              }
            >
              <Image
                src={media(vid.poster_path)}
                alt={vid?.title || ""}
                width={650}
                height={500}
                className="bg-black rounded-lg  object-contain"
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="absolute bottom-15 right-[8%] hidden md:flex">
        <div className="flex w-[60px]">
          <CarouselPrevious className="w-[60px] h-[60px] cursor-pointer" />
          <CarouselNext className="w-[60px] h-[60px] ml-2 cursor-pointer" />
        </div>
      </div>
    </Carousel>
  );
}

function BannerSectionFallback() {
  return (
    <div className="flex items-center justify-center gap-5">
      <Skeleton className="h-[500px] w-[700px] rounded-lg" />
      <Skeleton className="h-[500px] w-[700px] rounded-lg" />
      <Skeleton className="h-[500px] w-[700px] rounded-lg" />
    </div>
  );
}

export default BannerSection;
