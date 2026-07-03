"use client";

// please add mobile navbar and make it responsive

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Button, Snippet } from "@nextui-org/react";
import { CommonContext } from "@/Common_context";
import { supabase } from "@/utils/supabase/client";

export default function Navbar() {
  const { logout, userData } = useContext(CommonContext);
  const [user, setUser] = useState<any>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("userName")
        .eq("userId", userData?.user.id);

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        if (data && data.length > 0) {
          setUser(data[0].userName);
        }
      }
    };
    if (userData?.user.id) fetchUserData();
  }, [userData]);
  return (
    <>
      <header className="py-4 z-50   bg-white border-b border-neutral-200  top-0">
        <div className=" px-4 mx-auto sm:px-8 lg:px-10 ">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link
                href="/snapcv"
                title="snapcv"
                className="flex gap-2 justify-center items-center text-2xl font-semibold"
              >
                <img src="/logo.png" className="h-8" /> Snapcv
              </Link>
            </div>
            <nav className=" sm:flex gap-3">
              <Snippet
                variant="bordered"
                classNames={{
                  base: "rounded-xl border py-[.23rem] ",
                  pre: "font-dmSans font-medium",
                  symbol: "hidden",
                }}
                className="hidden font-dmSans  sm:flex"
              >
                {`${user}.snapcv.me`}
              </Snippet>{" "}
              {user && (
                <Link
                  href={`/badge/${user}`}
                  title="Add a card to your GitHub profile README"
                  className="rounded-xl py-1 px-3 hidden sm:flex justify-center items-center gap-1.5 font-dmSans border font-semibold text-sm hover:bg-neutral-50"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-gray-700"
                  >
                    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" />
                  </svg>
                  GitHub badge
                </Link>
              )}
              <Button
                onClick={() => logout()}
                variant="bordered"
                className="rounded-xl py-1 flex justify-center items-center font-dmSans border font-semibold "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
                Logout
              </Button>{" "}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
