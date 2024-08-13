/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import {
  shift66Name,
  shift64Name,
  shiftWfW,
  shiftAddedNight,
  type ShiftModelKeys,
} from "../../lib/shifts";
import { shiftModelText } from "../../lib/constants";

const urls = {
  [shift66Name]: [
    "/assets/6-6_gruppe_1.ics",
    "/assets/6-6_gruppe_2.ics",
    "/assets/6-6_gruppe_3.ics",
    "/assets/6-6_gruppe_4.ics",
    "/assets/6-6_gruppe_5.ics",
    "/assets/6-6_gruppe_6.ics",
  ],
  [shift64Name]: [
    "/assets/6-4_gruppe_1.ics",
    "/assets/6-4_gruppe_2.ics",
    "/assets/6-4_gruppe_3.ics",
    "/assets/6-4_gruppe_4.ics",
    "/assets/6-4_gruppe_5.ics",
  ],
  [shiftWfW]: [
    "/assets/wfw_gruppe_1.ics",
    "/assets/wfw_gruppe_2.ics",
    "/assets/wfw_gruppe_3.ics",
    "/assets/wfw_gruppe_4.ics",
    "/assets/wfw_gruppe_5.ics",
    "/assets/wfw_gruppe_6.ics",
  ],
  [shiftAddedNight]: [
    "/assets/nacht_gruppe_1.ics",
    "/assets/nacht_gruppe_2.ics",
    "/assets/nacht_gruppe_3.ics",
  ],
};

export default function Download({
  shiftModel,
}: {
  shiftModel: ShiftModelKeys;
}) {
  if (!(shiftModel in urls)) {
    return (
      <div class="my-4 flex flex-row justify-center px-1">
        <section class="rounded bg-gray-300 p-4 text-center text-gray-900">
          Für dieses Schichtmodell sind die Kalender noch in Arbeit
          <SheetDownload inWork />
        </section>
      </div>
    );
  }

  return (
    <div class="my-4 flex flex-row justify-center px-1">
      <section class="rounded bg-gray-300 p-4 text-center text-gray-900">
        <h4 class="text-xl font-semibold">
          Downloade einen {shiftModelText[shiftModel]} Kalender
        </h4>

        <p class="py-2">
          Füge deine Schichtgruppe zu deiner Kalender-App hinzu!
        </p>

        <div class="my-2 grid grid-cols-3 gap-6">
          {urls[shiftModel].map((href, index) => {
            const group = index + 1;
            return (
              <a
                key={shiftModel + group}
                class="mx-auto inline-block text-blue-700 underline hover:text-blue-500 hover:decoration-2 focus-visible:text-blue-500 focus-visible:decoration-2 focus-visible:outline-none focus-visible:ring-1"
                href={href}
                download={`${shiftModelText[shiftModel]} - Gruppe ${group}.ics`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Gruppe {group}
              </a>
            );
          })}
        </div>

        <SheetDownload />
      </section>
    </div>
  );
}

function SheetDownload({ inWork = false }: { inWork?: boolean }) {
  return (
    <p class="py-2">
      Oder lade ihn {inWork && "schon"} als Excel/
      <a
        href="https://de.libreoffice.org/discover/libreoffice/"
        target="_blank"
        rel="noreferrer"
      >
        LibreOffice
      </a>{" "}
      Tabelle runter:
      <br />
      <br />
      <a
        href="/download"
        class="mx-auto inline-block text-blue-700 underline hover:text-blue-500 hover:decoration-2 focus-visible:text-blue-500 focus-visible:decoration-2 focus-visible:outline-none focus-visible:ring-1"
      >
        <strong>Alle Download-Optionen!</strong>
      </a>
    </p>
  );
}
