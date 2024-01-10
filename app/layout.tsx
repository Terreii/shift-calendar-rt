/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Footer from "../components/footer";
import Header from "../components/header/core";
import InstallPrompt from "../components/install-prompt";

import "modern-css-reset";
import "../styles/index.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Schichtkalender für Bosch Reutlingen",
    default: "Schichtkalender für Bosch Reutlingen",
  },
  description:
    "Inoffizieller Schichtkalender für Bosch Reutlingen. Listet alle Kontischichten von Bosch Reutlingen auf.",
  appleWebApp: {
    title: "Schichtkalender",
    statusBarStyle: "default",
  },
  generator: "Next.js",
  alternates: {
    canonical: "https://schichtkalender.app/",
  },
  applicationName: "Schichtkalender Bosch RtP1",
  keywords: [
    "Schichtkalender",
    "Bosch",
    "Reutlingen",
    "Kontischicht",
    "Kalender",
  ],
  authors: {
    name: "Christopher Astfalk",
    url: "https://christopher-astfalk.de/",
  },
  creator: "Christopher Astfalk",
  publisher: "Christopher Astfalk",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#064E3B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Header />
        {children}
        <Footer />
        <InstallPrompt />
        {new Date().getDate() <= 2 && <Analytics />}
        <SpeedInsights />
      </body>
    </html>
  );
}
