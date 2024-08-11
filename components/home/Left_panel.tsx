"use client";

import React from "react";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import { useCommonContext } from "@/Common_context";
import { usePathname } from "next/navigation";

export default function LeftPanel() {
  const { userData } = useCommonContext();

  return (
    <div className="container  h-full px-4 w-full mx-auto sm:px-6 md:px-0 py-1">
      <div className="border-b-1  sticky top-0 border-neutral-200 flex justify-center px-6 sm:px-5 mx-auto w-full py-9">
        <div className="flex flex-col justify-start">
          <div className="flex gap-2 place-content-between">
            <Avatar src={userData?.user.user_metadata.avatar_url} />
          </div>
        </div>
      </div>

      <div className="px-8  sticky top-28 py-10">
        <div className="flex flex-col gap-1">
          <NavItem
            name="Home"
            displayName="Home"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            }
          />

          <NavItem
            name="Profile"
            displayName="Profile"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}

const NavItem = ({
  name,
  displayName,
  icon,
}: {
  name: string;
  displayName: string;
  icon: JSX.Element;
}) => {
  const pathname = usePathname();
  let page = pathname.split("/")[1];
  const isSelected = page === name.toLowerCase();

  return (
    <Link href={`/${name.toLowerCase()}`}>
      <button
        className={`flex gap-2 items-center p-4 justify-center w-full ${
          isSelected ? "bg-slate-100 rounded-xl " : "rounded-xl "
        } hover:bg-blue-100`}
        // onClick={() => setPage(name.toLowerCase())}
      >
        {icon}
        {/* <p
          className={`${
            isSelected ? "text-neutral-700" : "text-neutral-600"
          } text-sm font-body1 font-medium`}
        >
          {displayName ? displayName : name}
        </p> */}
      </button>
    </Link>
  );
};
