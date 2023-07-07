const withPWA = require("next-pwa")({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    // These are all the supported locales
    locales: ["de"],
    // This is the default locale used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "de",
  },
};

module.exports = process.env.LINT_ENV
  ? config
  : withPWA({
      ...config,
      pwa: {
        disable: process.env.NODE_ENV === "development",
        dest: "public",
      },
    });
