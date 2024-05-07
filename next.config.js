import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
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

export default process.env.LINT_ENV || process.env.NODE_ENV === "development"
  ? config
  : withSerwist(config);
