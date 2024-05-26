import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso";
import Helmet from "preact-helmet";

import Home from "./pages/Home.jsx";
import Impressum from "./pages/impressum";
import { NotFound } from "./pages/_404.jsx";

import Footer from "./components/footer";

import "modern-css-reset";
import "../styles/index.css";

export function App() {
  return (
    <LocationProvider>
      <Helmet
        titleTemplate="%s | Schichtkalender für Bosch Reutlingen"
        defaultTitle="Schichtkalender für Bosch Reutlingen"
      />

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
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
