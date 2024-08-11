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
        .from("User")
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
                href="/"
                title=""
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
