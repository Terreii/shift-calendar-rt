import {
  LocationProvider,
  Router,
  Route,
  lazy,
  hydrate,
  prerender as ssr,
} from "preact-iso";
import Helmet from "preact-helmet";

import Home from "./pages/Home";
import { NotFound } from "./pages/_404.jsx";

import Header from "./components/Header";
import Footer from "./components/Footer";

import "modern-css-reset";
import "../styles/index.css";

const Impressum = lazy(() => import("./pages/Impressum"));

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
        <Route path="/impressum" component={Impressum} />
        <Route default component={NotFound} />
      </Router>

      <Footer />
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app")!);
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
