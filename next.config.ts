import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Config propia de Turbopack (Next 16)
  turbopack: {
    resolveAlias: {
      canvas: "./empty-module.ts",
    },
  },

  // si tienes más cosas (images, i18n, etc.), déjalas aquí
};

export default nextConfig;
