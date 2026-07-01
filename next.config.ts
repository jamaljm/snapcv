import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Remote hosts allowed for next/image. Portfolio avatars/logos live in
    // Supabase Storage; OAuth avatars come from Google/GitHub.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "www.snapcv.me" },
    ],
  },
};

export default nextConfig;
