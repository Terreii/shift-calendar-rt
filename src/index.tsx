import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useState } from "preact/hooks";
import {
  LocationProvider,
  Router,
  Route,
  useLocation,
  lazy,
  hydrate,
  prerender as ssr,
} from "preact-iso";
import Helmet from "preact-helmet";

import Home from "./pages/Home";
import { NotFound } from "./pages/_404.jsx";

import Footer from "./components/Footer";
import Header from "./components/Header";
import InstallPrompt from "./components/InstallPrompt";

import "modern-css-reset";
import "./index.css";

const Calendar = lazy(() => import("./pages/Calendar"));
const Download = lazy(() => import("./pages/Download"));
const Impressum = lazy(() => import("./pages/impressum"));

export function App() {
  return (
    <LocationProvider>
      <Helmet
        titleTemplate="%s | Schichtkalender für Bosch Reutlingen"
        defaultTitle="Schichtkalender für Bosch Reutlingen"
      />
      <Header />

      <Router>
        <Route path="/" component={Home} />
        <Route path="/cal" component={Redirector} />
        <Route path="/cal/*" component={Calendar} />
        <Route path="/download" component={Download} />
        <Route path="/impressum" component={Impressum} />
        <Route default component={NotFound} />
      </Router>

      <Footer />
      <InstallPrompt />
      <AnalyticsContainer />
    </LocationProvider>
  );
}

function AnalyticsContainer() {
  const [shouldRender] = useState(() => ({
    analytics: new Date().getDate() <= 2, // Only render analytics for the first 2 days in a month.
    speed: Math.floor(Math.random() * 20) === 0, // Only render speed insights for 5% of visits.
  }));
  return (
    <>
      {shouldRender.analytics && <Analytics />}
      {shouldRender.speed && <SpeedInsights />}
    </>
  );
}

function Redirector() {
  const { route } = useLocation();
  route("/", true);
  return null;
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app")!);
}

export async function prerender(data) {
  const { links = [], ...rest } = await ssr(<App {...data} />);
  const filteredLinks = Array.from(links).filter(
    (link) => !link.startsWith("/cal"),
  );
  return { ...rest, links: new Set(filteredLinks) };
}
