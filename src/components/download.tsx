/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import calendarPlus from "bootstrap-icons/icons/calendar-plus-fill.svg";
import stars from "bootstrap-icons/icons/stars.svg";

export default function Download() {
  return (
    <div class="my-4 flex flex-row justify-center px-1">
      <section class="rounded-sm bg-gray-300 p-4 text-center text-gray-900">
        <h2 class="text-xl font-semibold">
          <Stars />
          Downloade deinen Kalender!
          <Stars />
        </h2>

        <p class="py-2">
          Füge deine Schichtgruppe zu deiner{" "}
          <img class="mb-1 inline-block size-4" src={calendarPlus} />{" "}
          Kalender-App hinzu!
          <br />
          Oder lade ihn als Excel/
          <a
            href="https://de.libreoffice.org/discover/libreoffice/"
            target="_blank"
            rel="noreferrer"
            class="text-blue-700 underline hover:text-blue-500 hover:decoration-2 focus-visible:text-blue-500 focus-visible:decoration-2 focus-visible:ring-1 focus-visible:outline-hidden"
          >
            LibreOffice
          </a>{" "}
          Tabelle runter.
          <br />
          <br />
          <span class="mb-2 inline-block font-bold">
            Jetzt mit aktualisierten Kalendern für <em>2024</em> und darüber
            hinaus!
          </span>
          <br />
          <a
            href="/download"
            class="mx-auto inline-block text-blue-700 underline hover:text-blue-500 hover:decoration-2 focus-visible:text-blue-500 focus-visible:decoration-2 focus-visible:ring-1 focus-visible:outline-hidden"
          >
            <strong>Alle Download-Optionen!</strong>
          </a>
        </p>
      </section>
    </div>
  );
}

function Stars() {
  return (
    <>
      <span class="mr-2 hidden font-extrabold text-yellow-600 uppercase first:inline-block">
        neu
      </span>
      <img
        src={stars}
        width="32"
        height="32"
        alt=""
        class="inline-block first:mr-2 last:ml-2"
        style={{
          filter: "invert(0.9) sepia(1) saturate(5)",
        }}
      />
      <span class="mr-2 hidden font-extrabold text-yellow-600 uppercase last:inline-block">
        neu
      </span>
    </>
  );
}
