import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      new URL("https://yynwzhiazwhtnrdbobyd.supabase.co/storage/v1/object/public/product-images/**"),
      new URL("https://images.unsplash.com/**"),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
