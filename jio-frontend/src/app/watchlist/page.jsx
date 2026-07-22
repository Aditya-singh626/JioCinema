"use client";
import CategoriesSectionWatchlist from "../../components/section/CategoriesSectionWatchlist";
import { buttonVariants } from "@/components/ui/button";
import { api, ENDPOINT } from "@/lib/api";
import { cn } from "@/lib/utils";
import { FolderLockIcon } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function WatchList() {
  const userData = useSelector((state) => state.user);
  const [watchlistData, setWatchlistData] = useState([]);
  // const [count, setCount] = useState(0);

  // Effect 1: Runs when login status changes
  useEffect(() => {
    // console.log("Effect 1: login status changed → fetching data");
    // console.log("userData.isLoggedIn = ",userData.isLoggedIn);

    const fetchData = async () => {
      if (userData.isLoggedIn) {
        try {
          const res = await api.get(ENDPOINT.getWishlist);
          setWatchlistData(res?.data?.data || []);
          // console.log("API response = ", res?.data?.data);

          // increment count once when data is fetched
          // setCount((prev) => prev + 1);
        } catch (error) {
          console.error("Error fetching watchlist:", error);
        }
      }
    };
    // console.log("run");
    fetchData();
  }, [userData.isLoggedIn]);

  // Effect 2: Runs whenever watchlistData changes

  {
    /*  useEffect(() => {
    console.log("Effect 2: watchlist updated = ", watchlistData);
    console.log("Current count = ", count);
  }, [watchlistData]);*/
  }

  const fetcher = useCallback(async () => {
    return watchlistData || [];
  }, [watchlistData]);

  const title = "Watchlist";

  return (
    <div className=" mt-[10px] p-4">
      {userData.isLoggedIn ? (
        <CategoriesSectionWatchlist
          fetcher={fetcher}
          title={title}
          id="watchlistheading"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
          <FolderLockIcon
            className="w-32 h-32 text-slate-400"
            strokeWidth={1.2}
          />
          <p className="text-base text-slate-400">
            Login to see your watchlist
          </p>
          <Link
            href={"/login"}
            className={cn(buttonVariants(), "rounded-full px-6 mt-4")}
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default WatchList;
