"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NumberTicker from "../magicui/number-ticker";

export function GithubButton() {
  const [stars, setStars] = useState(10); // Default value

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/jamaljm/snapcv",
          {
            headers: process.env.GITHUB_OAUTH_TOKEN
              ? {
                  Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
                  "Content-Type": "application/json",
                }
              : {},
            next: {
              revalidate: 3600,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count || stars); // Update stars if API response is valid
        }
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
      }
    };

    fetchStars();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <Link
      className={cn(
        "hidden px-6 py-2 rounded-full bg-[#18181b] max-w-52 gap-2 overflow-hidden whitespace-pre sm:flex",
        "group relative w-full justify-center gap-2  transition-all duration-300 ease-out  "
      )}
      target="_blank"
      href="https://github.com/jamaljm/snapcv"
    >
      <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
      <div className="flex items-center">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-6 fill-white"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
          ></path>
        </svg>{" "}
        <span className="ml-1 text-white font-urbanist">Star on GitHub</span>{" "}
      </div>
      <div className=" mr-2 flex items-center gap-1 text-sm md:flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 fill-yellow-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
        <NumberTicker
          value={stars}
          className=" font-dmSans flex text-base  font-medium text-white dark:text-black"
        />
      </div>
    </Link>
  );
}
