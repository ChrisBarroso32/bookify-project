import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [
          { protocol: "https",  hostname: "covers.openlibrary.org" },
          { protocol: "https",  hostname: "qpxifd2zy0dg8xno.public.blob.vercel-storage.com" },
        ]},
};

export default nextConfig;
