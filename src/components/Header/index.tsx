/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Suspense } from "preact/compat";
import { useLocation, lazy } from "preact-iso";

import home from "bootstrap-icons/icons/house-door-fill.svg";

const Controls = lazy(() => import("./Controls"));

/**
 * Renders the Header.
 */
export default function Header() {
  const { path } = useLocation();

  return (
    <header
      class="px-safe sticky top-0 left-0 z-50 flex h-12 flex-row items-center justify-between bg-emerald-900 shadow-lg"
      style={{ viewTransitionName: "header" }}
    >
      <h1
        class="m-0 pl-4 align-baseline text-2xl font-normal"
        title="Home. Gehe zur Auswahl der Schichtmodelle"
      >
        <a
          href="/"
          class="rounded-sm text-white ring-offset-2 ring-offset-emerald-900 hover:underline focus-visible:underline focus-visible:ring-4 focus-visible:outline-hidden"
        >
          <span class="hidden min-[350px]:inline sm:hidden">Kalender</span>
          <span class="hidden sm:inline">Kontischichtkalender Rt</span>
          <img src={home} class="size-6 invert min-[350px]:hidden" alt="" />
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
