/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Suspense } from "preact/compat";
import { useLocation, lazy } from "preact-iso";
import style from "./style.module.css";

import home from "bootstrap-icons/icons/house-door-fill.svg";

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
          <img src={home} class={style.text_as_icon} alt="" />
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
