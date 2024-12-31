"use client";
import React, { useRef, useState } from "react";
import OrbitingCircles from "@/components/magicui/orbiting-circles";
import Link from "next/link";
import { Button, Input } from "@nextui-org/react";
import type { ConfettiRef } from "@/components/magicui/confetti";
import Confetti from "@/components/magicui/confetti";
import ShimmerButton from "@/components/magicui/shimmer-button";
import IconCloud from "@/components/magicui/icon-cloud";
import TypingAnimation from "@/components/magicui/typing-animation";
import BlurFade from "@/components/magicui/blur-fade";
import { useRouter } from "next/navigation";
import { useCommonContext } from "@/Common_context";
import WordPullUp from "@/components/magicui/word-pull-up";
const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];
export default function page() {
  const confettiRef = useRef<ConfettiRef>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userData } = useCommonContext();
  if (userData) {
    router.push("/home");
  }
  const SigninWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await response.json();
      setLoading(false);
      if (!data?.url) throw new Error("No url returned");
      router.push(data.url);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute flex justify-between items-center p-6 sm:p-8 px-4 sm:px-12 z-50 top-0 w-full">
        <Link
          href="/snapcv"
          className="text-3xl sm:text-4xl flex items-center font-urbanist gap-1 font-bold"
        >
          <img className="w-7 sm:w-10" src="/logo.png" />
          Snapcv
        </Link>{" "}
        <Link href="/signup">
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm   font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-base">
              Sign up
            </span>
          </ShimmerButton>
        </Link>
      </div>

      <div className=" flex  flex-col h-full p-6 z-40 w-full absolute justify-center  items-center  overflow-hidden rounded-lg ">
        <div className="py-10 px-6 max-w-sm  sm:max-w-lg border w-full justify-center items-center flex flex-col rounded-xl bg-white min-h-64">
          <WordPullUp
            className="max-w-5xl flex-1 sm:max-w-4xl  text-black/90 text-2xl/relaxed  font-urbanist sm:text-3xl/relaxed font-semibold whitespace-pre-wrap  text-center dark:text-white"
            words="Welcome back 👋"
          />
          <BlurFade
            className="w-full flex-1 flex mt-8 h-fit justify-center items-start"
            duration={0.4}
            delay={1}
          >
            <Button
              onClick={SigninWithGoogle}
              className="  text-black font-urbanist bg-slate-200 border-2 font-medium font-body1 py-2.5 px-7 w-fit"
            >
              <GoogleIcon /> Sign in with Google{" "}
            </Button>{" "}
          </BlurFade>
        </div>
      </div>

      <div className=" flex flex-col  h-screen w-full absolute justify-center  items-center  overflow-hidden rounded-lg bg-white ">
        <OrbitingCircles
          className="h-[40px] w-[40px] border-none bg-transparent"
          duration={20}
          delay={20}
          radius={90}
        ></OrbitingCircles>
        <OrbitingCircles
          className="h-[50px] w-[50px] border-none bg-transparent"
          duration={20}
          delay={10}
          radius={90}
        ></OrbitingCircles>
        {/* Outer Circles (reverse) */}
        <OrbitingCircles
          className="h-[45px] w-[45px] border-none bg-transparent"
          radius={180}
          duration={20}
          reverse
        ></OrbitingCircles>
        <OrbitingCircles
          className="h-[60px] w-[60px] border-none bg-transparent"
          radius={275}
          duration={30}
          delay={20}
          reverse
        ></OrbitingCircles>{" "}
        <OrbitingCircles
          className="h-[60px] w-[60px] border-none bg-transparent"
          radius={275}
          duration={20}
          delay={10}
          reverse
        ></OrbitingCircles>{" "}
        <OrbitingCircles
          className="h-[70px] w-[70px] border-none bg-transparent"
          radius={360}
          duration={40}
          delay={30}
        ></OrbitingCircles>{" "}
        <OrbitingCircles
          className="h-[70px] w-[70px] border-none bg-transparent"
          radius={360}
          duration={40}
          delay={10}
        ></OrbitingCircles>{" "}
        <IconCloud iconSlugs={slugs} />
      </div>
    </>
  );
}

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 48 48"
    className="size-6"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);
