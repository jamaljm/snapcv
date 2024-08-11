"use client";
import React, { useRef, useState } from "react";
import OrbitingCircles from "@/components/magicui/orbiting-circles";
import Link from "next/link";
import { Input } from "@nextui-org/react";
import type { ConfettiRef } from "@/components/magicui/confetti";
import Confetti from "@/components/magicui/confetti";
import ShimmerButton from "@/components/magicui/shimmer-button";
import SparklesText from "@/components/magicui/sparkles-text";
import TextReveal from "@/components/magicui/text-reveal";
import { supabase } from "@/utils/supabase/client";
import { setCookie } from "cookies-next";
import { useCommonContext } from "@/Common_context";
import { useRouter } from "next/navigation";
import { reservedWords } from "@/lib/type";
import DotPattern from "../magicui/dot-pattern";
import Marquee from "../magicui/marquee";
import { MarqueeDemo } from "./Marquee";
import RetroGrid from "../magicui/retro-grid";
import Footer from "./Footer";

export default function Hero() {
  const { userData } = useCommonContext();
  const confettiRef = useRef<ConfettiRef>(null);
  const [shopSlug, setShopSlug] = useState("");
  const [slugError, setSlugError] = useState(false);
  const [oldSlug, setOldSlug] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Already taken!");

  const [isAvailable, setIsAvailable] = useState(false);
  const isError = slugError || isChecking;
  const router = useRouter();
  console.log(userData);
  if (userData) {
    router.push("/home");
  }

  const checkSlugUnique = async (slug: string): Promise<boolean> => {
    if (shopSlug === oldSlug) {
      return true;
    }
    if (reservedWords.includes(slug.toLowerCase())) {
      return false;
    }

    const { data, error } = await supabase
      .from("User")
      .select("userName")
      .eq("userName", slug);

    if (error) {
      console.error("Error checking slug:", error);
      return false;
    }

    return data.length === 0;
  };

  const handleBlur = async () => {
    setIsChecking(true);

    const isUnique = await checkSlugUnique(shopSlug);
    setIsChecking(false);
    if (shopSlug === "") {
      setIsAvailable(false);
    }
    if (isUnique && shopSlug !== "") {
      setIsAvailable(isUnique);
      setCookie("username", shopSlug, { maxAge: 60 * 60 * 24 * 100 });
    }
    setSlugError(!isUnique);
  };

  return (
    <>
      <div className="absolute flex justify-between items-center p-6 sm:p-8 px-4 sm:px-12 z-50 top-0 w-full">
        <h2 className="text-3xl sm:text-4xl flex items-center font-urbanist gap-1 font-semibold">
          <img className="w-7 sm:w-10" src="/logo.png" />
          Snapcv
        </h2>
        <Link
          className="text-black border-2 border-black/80 px-6 font-urbanist font-semibold py-1.5 sm:py-2 text-sm sm:text-base rounded-full"
          href="/login"
        >
          Sign in{" "}
        </Link>
      </div>

      <div className=" flex flex-col  h-screen px-6 w-full absolute justify-center  items-center  overflow-hidden rounded-lg bg-white ">
        <DotPattern className="right-0 opacity-80 absolute h-full sm:[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]" />{" "}
        <h1 className="pointer-events-none leading-tight sm:leading-none  bg-white/30 font-urbanist  w-full max-w-5xl sm:max-w-4xl z-50 whitespace-pre-wrap text-center text-4xl/relaxed sm:text-7xl font-semibold   dark:from-white ">
          Create a <SparklesText className="sm:mb-3" text="Stunning " />
          Portfolio that Gets You Hired
        </h1>
        <p className="text-lg/relaxed font-semibold text-gray-700 sm:text-xl/relaxed max-w-72 sm:max-w-xl  text-center font-urbanist mt-4 ">
          Get your portfolio in 20 seconds! Perfect for Professionals, Students,
          Coders, and More.
        </p>{" "}
        <div className=" mt-5 hidden sm:grid ml-4  sm:grid-cols-3 grid-cols-1 justify-center items-center w-full max-w-xl">
          <Input
            type="url"
            placeholder="Your name"
            labelPlacement="outside"
            radius="full"
            className="z-50  col-span-1 sm:col-span-2 max-w-xl rounded-full flex justify-center  w-full  font-urbanist font-semibold text-lg  min-w-lg"
            size="lg"
            classNames={{}}
            isInvalid={isError}
            errorMessage={errorMessage}
            value={shopSlug}
            onBlur={handleBlur}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.includes(" ")) {
                alert("Spaces are not allowed in the username.");
                return;
              }
              setSlugError(false);
              setShopSlug(e.target.value);
            }}
            endContent={
              <div className="pointer-events-none w-full justify-between pl-2 flex items-center">
                <span className="text-default-600 font-semibold text-lg">
                  .snapcv.me
                </span>
                {isAvailable && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
              </div>
            }
            startContent={
              <div className="pointer-events-none pl-2 flex items-center">
                <span className="text-default-600 font-semibold text-lg">
                  https://
                </span>
              </div>
            }
          />{" "}
          <Link
            href="/signup"
            className="w-full z-50 -mt-1.5 justify-center flex items-center"
          >
            <ShimmerButton className="shadow-2xl -ml-6  w-fit">
              <span className="whitespace-pre-wrap text-center text-sm   font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-base">
                {isAvailable ? `Claim ${shopSlug}` : "Create now"}{" "}
              </span>
            </ShimmerButton>{" "}
          </Link>
        </div>{" "}
        <div className=" mt-5 sm:hidden flex justify-center items-center gap-5  flex-col w-full max-w-lg">
          <Input
            type="url"
            placeholder="Your name"
            labelPlacement="outside"
            className="z-50  col-span-1 sm:col-span-2 max-w-xs flex justify-center  w-full  font-urbanist font-semibold text-lg rounded-xl min-w-lg"
            size="lg"
            classNames={{}}
            isInvalid={isError}
            errorMessage={errorMessage}
            value={shopSlug}
            onBlur={handleBlur}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSlugError(false);
              setShopSlug(e.target.value);
            }}
            endContent={
              <div className="pointer-events-none w-full justify-between pl-2 flex items-center">
                <span className="text-default-600 font-semibold text-lg">
                  .snapcv.me
                </span>
                {isAvailable && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
              </div>
            }
            startContent={
              <div className="pointer-events-none pl-2 flex items-center">
                <span className="text-default-600 font-semibold text-lg">
                  https://
                </span>
              </div>
            }
          />{" "}
          <Link
            href="/signup"
            className="w-fit z-50 justify-center flex items-center"
          >
            <ShimmerButton className="shadow-2xl w-fit">
              <span className="whitespace-pre-wrap text-center text-sm   font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-base">
                {isAvailable ? `Claim ${shopSlug} now` : "Create now"}{" "}
              </span>
            </ShimmerButton>{" "}
          </Link>
        </div>
        <MarqueeDemo />
      </div>

      <div className="w-full min-h-screen mt-[100vh] absolute flex justify-center items-center">
        {/* <TextReveal text="You're a coding genius, but I know you’ve got no time for portfolio website. So, I made it easy for you! 🚀" /> */}
        <TextReveal text="No time to build a portfolio because you're too busy? No worries—I've got you covered! ✨" />
        <RetroGrid />
        <Footer />
      </div>
    </>
  );
}
