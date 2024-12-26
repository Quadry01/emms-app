import type { NextConfig } from "next";
require('dotenv').config();

module.exports = {
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
