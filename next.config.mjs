const nextConfig = {
  reactStrictMode: true,
  env: {
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI,
    LINKEDIN_STATE: process.env.LINKEDIN_STATE,
    LINKEDIN_SCOPE: process.env.LINKEDIN_SCOPE,
  },
};

export default nextConfig;
