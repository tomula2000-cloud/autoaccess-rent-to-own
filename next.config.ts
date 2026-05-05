import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "auqnznddv3dcilxu.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/audio/:file*",
        destination:
          "https://auqnznddv3dcilxu.public.blob.vercel-storage.com/:file*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/audio/:file*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'none'; media-src 'self' https://*.public.blob.vercel-storage.com; style-src 'unsafe-inline'; img-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
