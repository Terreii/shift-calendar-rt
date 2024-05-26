/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Suspense } from "preact/compat";
import { useLocation, lazy } from "preact-iso";
import style from "./style.module.css";

const Controls = lazy(() => import("./Controls"));

/**
 * Renders the Header.
 */
export default function Header() {
  const { path } = useLocation();

  return (
    <header class={style.container}>
      <h1
        class={style.header}
        title="Home. Gehe zur Auswahl der Schichtmodelle"
      >
        <a href="/" class={style.header_link}>
          <span class={style.short_text}>Kalender</span>
          <span class={style.long_text}>Kontischichtkalender Rt</span>
          <svg
            class={style.text_as_icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </a>
      </h1>

      {path.startsWith("/cal") && (
        <Suspense fallback={() => <div />}>
          <Controls />
        </Suspense>
      )}
    </header>
  );
}
