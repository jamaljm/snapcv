"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import NumberTicker from "../magicui/number-ticker";

export function PortfolioCountButton() {
  const [count, setCount] = useState(100); // Default value

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/noOfPortfolio");
        if (response.ok) {
          const data = await response.json();
          setCount(data.count || count);
        }
      } catch (error) {
        console.error("Error fetching portfolio count:", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <div
      className={cn(
        "hidden px-6 py-2 rounded-full bg-[#18181b] max-w-52 gap-2 overflow-hidden whitespace-pre sm:flex",
        "group relative w-full justify-center gap-2 transition-all duration-300 ease-out"
      )}
    >
      <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
        <span className="ml-2 text-white font-urbanist">Total Portfolios</span>
      </div>
      <div className="mr-2 flex items-center gap-1 text-sm md:flex">
        <NumberTicker
          value={count}
          className="font-dmSans flex text-base font-medium text-white"
        />
      </div>
    </div>
  );
}
