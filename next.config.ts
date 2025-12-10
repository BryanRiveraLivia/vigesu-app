import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Lo que ya tenías antes para Turbopack
  turbopack: {
    resolveAlias: {
      canvas: "./empty-module.ts",
    },
  },

  // si tienes más opciones (images, headers, etc.), déjalas aquí
};

export default withNextIntl(nextConfig);
