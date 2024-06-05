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

import Header from "./components/Header";
import Footer from "./components/Footer";

import "modern-css-reset";
import "../styles/index.css";

const Calendar = lazy(() => import("./pages/Calendar"));
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
        <Route path="/cal" component={Redirector} />
        <Route path="/cal/*" component={Calendar} />
        <Route path="/impressum" component={Impressum} />
        <Route default component={NotFound} />
      </Router>

      <Footer />
    </LocationProvider>
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
