"use client";
import { useEffect, useState } from "react";
import Hero from "@/components/landingpage/Hero";
import { User } from "@/lib/type";
import { getPageData } from "@/lib/data";
import Temp_1 from "@/components/design/temp_1";
import Loader from "@/components/Loader";

export default function IndexPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const href = window.location.href;
    getPageData(href)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch page data:", error);
        setLoading(false);
      });

    return () => {};
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (user) {
    return <Temp_1 user={user} />;
  }

  return <Hero />;
}
