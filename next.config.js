/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Reduce dev-only double-invocations that can cause extra server logs
  reactStrictMode: false,
  experimental: {
    ppr: true,
  },
};

export default config;
