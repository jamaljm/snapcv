"use client";
import { getCookie } from "cookies-next";
import DotPattern from "@/components/magicui/dot-pattern";
import React, { useRef, useState, useEffect } from "react";
import { avatar, Input, Spinner } from "@nextui-org/react";
import type { ConfettiRef } from "@/components/magicui/confetti";
import { supabase } from "@/utils/supabase/client";
import { setCookie } from "cookies-next";
import { useCommonContext } from "@/Common_context";
import { useRouter } from "next/navigation";
import { reservedWords } from "@/lib/type";
import axios from "axios";
import confetti from "canvas-confetti";
import Navbar from "@/components/create/Navbar";

import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import withAuth from "@/utils/authProtect";
interface User {
  userId: string;
  email: string;
  avatarUrl: string;
  userName?: string; // Make userName optional
  fullName: string;
}

function Page() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userData } = useCommonContext();
  const confettiRef = useRef<ConfettiRef>(null);
  const [shopSlug, setShopSlug] = useState("");
  const [slugError, setSlugError] = useState(false);
  const [oldSlug, setOldSlug] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Already taken!");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [resumeUrl, setResumeUrl] = useState("");
  const [aiCreating, setAiCreating] = useState(false);

  const [isAvailable, setIsAvailable] = useState(false);
  const isError = slugError || isChecking;
  console.log("userData", userData);
  useEffect(() => {
    const user = getCookie("username");
    if (user) {
      setShopSlug(user);
      setOldSlug(user);
    }
  }, []);

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
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (aiCreating) {
      const handleIncrement = (prev: any) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 10;
      };
      const interval = setInterval(() => setValue(handleIncrement), 2500);

      return () => clearInterval(interval);
    } else {
      setValue(100);
    }
  }, [aiCreating]);

  useEffect(() => {
    const insertUser = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("userName")
        .eq("userId", userData?.user.id);
      if (error) {
        setLoading(false);
        return;
      }
      if (data.length > 0) {
        router.push("/home");
        return;
      }
      if (data.length === 0) {
        setLoading(false);
      }
    };

    insertUser();
  }, [userData]);
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner color="default" />
      </div>
    );
  }

  const handleFileUpload = async (file: File) => {
    setUploadStatus("uploading");
    const { data, error } = await supabase.storage
      .from("resume")
      .upload(
        `public/${userData?.user.id}/resume${Math.floor(
          1000 + Math.random() * 9000
        )}.pdf`,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("idle");
      return;
    }

    if (data) {
      setUploadStatus("uploaded");
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume/${data.path}`;
      setResumeUrl(fileUrl);
    }
  };

  const ManuallyCreate = async () => {
    if (!shopSlug) {
      alert("Please enter your portfolio domain");
      return;
    }
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
    const { data, error } = await supabase.from("User").insert({
      userId: userData?.user.id,
      userName: shopSlug.toLowerCase(),
      avatarUrl: userData?.user.user_metadata.avatar_url,
      fullName: userData?.user.user_metadata.full_name,
      email: userData?.user.email,
    });

    if (error) {
      console.error("Error inserting user:", error);
    }

    if (!error) {
      router.push("/home");
    }
  };

  const generateai = async () => {
    if (!resumeUrl) {
      alert("Please upload your resume");
      return;
    }
    if (!shopSlug) {
      alert("Please enter your portfolio domain");
      return;
    }
    setAiCreating(true);
    setValue(0);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/extract-pdf`,
        {
          pdfUrl: resumeUrl,
        }
      );
      console.log("AI Generated Result:", response);
      const result = response.data;
      setValue(80);
      // result.userName = shopSlug;
      // result.avatarUrl = userData?.user_metadata.avatarUrl;
      // result.userId = userData?.user.id;
      console.log("AI Generated Result:", result);
      // Filter out null values from the result object
      const end = Date.now() + 3 * 1000; // 3 seconds
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
      setValue(90);
      const extendedResult = await {
        ...result,
        userName: shopSlug.toLowerCase(),
        avatarUrl: userData?.user.user_metadata.avatar_url,
        userId: userData?.user.id,
        email: userData?.user.email,
      };
      const { data, error } = await supabase
        .from("User")
        .insert(extendedResult);

      if (error) {
        console.error("Error inserting user:", error);
      }
      setValue(100);
      if (!error) {
        router.push("/home");
      }

      console.log("AI Generated Result:", result);
    } catch (error) {
      console.error("Error in AI generation:", error);
      alert("Error in AI generation");
      setAiCreating(false);
    }
    return null;
  };

  return (
    <div className="h-screen flex flex-col w-full">
      <div>
        <Navbar />
      </div>
      <div className="w-full h-full px-7 flex flex-col justify-between items-center ">
        {aiCreating ? (
          <div className="flex justify-start mt-20 flex-col items-center gap-10">
            <DotPattern className="absolute mt-16 [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]" />
            <h1 className="text-3xl z-50  pb-0 text-black font-semibold font-urbanist text-center">
              AI is generating
            </h1>
            <AnimatedCircularProgressBar
              max={100}
              min={0}
              value={value}
              gaugePrimaryColor="rgb(79 70 229)"
              gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            />
          </div>
        ) : (
          <div className="max-w-xl -mt-4 rounded-3xl  min-h-64 h-full w-full flex flex-col justify-center items-center">
            <DotPattern className="absolute [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]" />
            <h1 className="text-3xl z-50  pb-12 text-black font-semibold font-urbanist text-center">
              Create your portfolio
            </h1>
            <Input
              type="text"
              placeholder=""
              labelPlacement="outside"
              label="Claim your portfolio domain"
              className="z-50 inputbar text-gray-600  col-span-1 sm:col-span-2 font-semibold max-w-sm flex justify-center  w-full  font-urbanist  text-lg rounded-xl min-w-lg"
              size="lg"
              classNames={{
                input: "font-semibold text-lg",
                label: "font-semibold text-base text-black/80",
              }}
              isInvalid={isError}
              errorMessage={errorMessage}
              value={shopSlug}
              onBlur={handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z]/g, "");
                setSlugError(false);
                setShopSlug(value);
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
                <div className="pointer-events-none justify-between pl-2 flex items-center">
                  <span className="text-default-600 font-semibold text-lg">
                    https://
                  </span>
                </div>
              }
            />
            <div className="flex z-50 mt-8 flex-col gap-2 sm:gap-0 w-full justify-center text-sm  items-center">
              <p className="w-full text-start max-w-sm font-medium mb-2.5 text-base">
                Upload resume for instant portfolio (PDF)
              </p>
              <div className="flex max-w-sm w-full justify-center  gap-2 items-center flex-row flex-wrap">
                {resumeUrl ? (
                  <div className="w-12 h-12 flex items-center justify-center  bg-gray-100 rounded-xl">
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
                        d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center  bg-gray-100 rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-slate-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                  </div>
                )}

                <label className=" flex flex-row gap-2 text-slate-500 cursor-pointer shadow-xs justify-center items-center  flex-1 px-3 h-12 border-black/40 rounded-xl border-dashed border  bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 text-slate-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  {uploadStatus === "idle" && "Upload resume or CV (PDF)"}
                  {uploadStatus === "uploading" && "Uploading..."}
                  {uploadStatus === "uploaded" && "resume uploaded"}
                  <input
                    onChange={(event) => {
                      // setIsError(false);
                      if (event.target.files) {
                        handleFileUpload(event.target.files[0]);
                      }
                    }}
                    type="file"
                    className="  w-full hidden  font-body font-light text-black/80 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-gray-700 hover:file:bg-slate-400"
                  />
                </label>
              </div>
            </div>
            <button
              onClick={generateai}
              className="mt-8 z-50 w-full hover:opacity-85 hover:scale-105 transform-gpu max-w-sm flex justify-center items-center gap-2 font-urbanist bg-black text-white font-semibold  transition-transform duration-500 ease-in-out text-base rounded-xl py-2.5"
              style={{
                backgroundImage: `
      radial-gradient(23.3125rem 23.3125rem at 50% -0.625rem, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0)),
      linear-gradient(to bottom, #212126 19.125rem, #131316 62.9375rem)
    `,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
              Generate By AI
            </button>
            <div className="relative w-full max-w-sm mt-5 z-50">
              <div
                className="absolute inset-0  flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t  border-gray-500"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 text-xs font-normal text-gray-600 bg-white">
                  Or
                </span>
              </div>
            </div>
            <button
              onClick={ManuallyCreate}
              className="mt-5 z-50 w-full transition-transform duration-500 ease-in-out hover:scale-105 hover:bg-gray-200  max-w-sm flex justify-center items-center gap-2 font-urbanist border-2 border-black/80 text-black/80 font-semibold text-base rounded-xl py-2.5"
            >
              Create Manually
            </button>
          </div>
        )}
        <div></div>
      </div>
    </div>
  );
}

export default withAuth(Page);
