"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useCommonContext } from "@/Common_context";
import GithubCard from "@/components/github_wrap_portfolio/github-card";
import GithubCard2 from "@/components/github_wrap/github-card";
import { toPng } from "html-to-image";

export default function page() {
  const router = useRouter();
  const { userData } = useCommonContext();
  const [isLoading, setIsLoading] = useState(true);
  const [githubData, setGithubData] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (ref.current) {
      try {
        const dataUrl = await toPng(ref.current, {
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: "#111827",
          style: {
            transform: "scale(0.9)",
          },
          filter: (node) => {
            return !node.classList?.contains("loading");
          },
        });

        const link = document.createElement("a");
        link.download = `github-wrap-${
          new Date().toISOString().split("T")[0]
        }.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
        setTimeout(downloadImage, 1000);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("githubWrap")
        .eq("userId", userData?.user.id);

      if (error || data.length === 0) {
        router.push("/create");
        console.error("Error fetching user data:", error);
      } else {
        if (data && data.length > 0) {
          setGithubData(data[0].githubWrap);
          setIsLoading(false);
          setTimeout(downloadImage, 3000);
        }
      }
    };
    if (userData?.user.id) {
      fetchUserData();
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <div
        ref={ref}
        className="max-w-7xl mx-auto p-8 rounded-lg"
        style={{
          backgroundColor: "#111827",
          transform: "scale(1)",
          transformOrigin: "center",
        }}
      >
        {!isLoading && githubData && (
          <>
            <div className="sm:hidden block">
              <GithubCard data={githubData} />
            </div>
            <div className="hidden sm:block">
              <GithubCard2 data={githubData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
