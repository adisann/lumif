import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "/register",
        permanent: false,
      },
      {
        source: "/auth/signup",
        destination: "/register",
        permanent: false,
      },
      {
        source: "/forgot-password",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/reset-password",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/auth/forgot-password",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/auth/reset-password",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
      },
      {
        source: "/register",
        destination: "/auth/register",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
};

export default nextConfig;
