import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso";

import { NotFound } from "./pages/_404.jsx";

export function App() {
  return (
    <LocationProvider>
      <main>
        <Router>
          <Route path="/" component={() => <h1>Hello World</h1>} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
