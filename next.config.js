import nextPwa from "next-pwa";
const withPWA = nextPwa({
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

export default process.env.LINT_ENV || process.env.NODE_ENV === "development"
  ? config
  : withPWA({
      ...config,
      pwa: {
        dest: "public",
      },
    });
