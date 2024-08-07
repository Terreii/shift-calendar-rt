/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import classNames from "classnames";
import { type ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import shifts, {
  type Shift,
  type ShiftModelKeys,
  type ShiftModelsWithFallbackKeys,
} from "../../lib/shifts";

/**
 * Renders a legend of definitions for the table.
 */
export default function Legend({
  shiftKey,
  year,
  month,
}: {
  shiftKey: ShiftModelKeys;
  year: number;
  month: number;
}) {
  const shiftTypes = useMemo(
    () => getShifts(shiftKey, year, month),
    [shiftKey, year, month],
  );
  return (
    <div class="mx-auto mb-8 flex flex-col items-start text-gray-900 px-safe md:flex-row">
      <dl class="grid grid-cols-[auto_1fr] items-start gap-2 px-4 py-2 md:px-2 md:py-0">
        {shiftTypes.map(([key, data]) => (
          <Cell key={shiftKey + key} id={key}>
            {data.name}
            <br />
            {toTimeString(data.start)} - {toTimeString(data.end)} Uhr
          </Cell>
        ))}
      </dl>

      <dl class="grid grid-cols-[auto_1fr] items-start gap-2 px-4 py-2 md:px-2 md:py-0">
        <Cell class="border-4 border-black font-bold underline">
          Aktuelle Schicht
        </Cell>

        <Cell class="bg-emerald-700 text-white">
          Schließtage (Ostern und Weihnachten)
        </Cell>

        <Cell
          class="bg-teal-400"
          href="https://www.schulferien.org/Baden-Wurttemb_/baden-wurttemb_.html"
        >
          Schulferien / Feiertage in Baden-Württemberg
        </Cell>

        <Cell
          class="bg-cyan-500"
          href="https://www.ramadan.de/wann-ist-ramadan/"
        >
          Ramadan (erster / letzter Fastentag)
        </Cell>

        <Cell
          class="border-4 border-red-600 bg-amber-300 px-0 text-black"
          href="https://www.zeitumstellung.de/termin-zeitumstellung.html"
        >
          Zeitumstellung
        </Cell>
      </dl>
    </div>
  );
}

function getShifts(
  shiftKey: ShiftModelKeys,
  year: number,
  month: number,
): [string, Shift][] {
  const fallbackShiftKey = getFallbackKey(shiftKey, year, month);
  const fallbackShifts = fallbackShiftKey
    ? shifts[fallbackShiftKey].shifts
    : {};

  const uniqueShiftsKeys = new Set<string>();

  return Object.entries(shifts[shiftKey].shifts) // Get all shift types
    .concat(Object.entries(fallbackShifts))
    .filter(([key]) => {
      // And filter out all not unique
      if (uniqueShiftsKeys.has(key)) return false;
      uniqueShiftsKeys.add(key);
      return true;
    });
}

function getFallbackKey(
  shiftKey: ShiftModelsWithFallbackKeys,
  year: number,
  month: number,
): ShiftModelsWithFallbackKeys | null {
  const shift = shifts[shiftKey];
  const [startYear, startMonth] = shift.startDate
    .split("-")
    .map((s) => parseInt(s, 10));
  if (year < startYear || (year === startYear && month < startMonth)) {
    return getFallbackKey(shift.fallback, year, month) ?? shift.fallback;
  }
  return null;
}

function toTimeString(time: [number, number]): string {
  return `${time[0]}:${String(time[1]).padStart(2, "0")}`;
}

/**
 * Legend of a cell for the table.
 * @param   param  React params.
 * @param   param.className     ClassName of the example cell.
 * @param   param.id            Content of the example cell.
 * @param   param.href          Info source URL.
 * @param   param.children      Description of the cell shown.
 */
function Cell({
  id,
  class: className,
  href,
  children,
}: {
  id?: string;
  class?: string;
  href?: string;
  children?: ComponentChildren;
}) {
  return (
    <>
      <dt
        class={classNames(
          "h-fit w-8 border border-black p-1 text-center",
          className,
        )}
      >
        {id || "1"}
      </dt>

      <dd id={id ? `${id}_description` : undefined} class="text-gray-900">
        {href ? (
          <a
            href={href}
            class="text-gray-900 underline decoration-blue-700 hover:decoration-blue-500 hover:decoration-2 focus-visible:decoration-blue-500 focus-visible:decoration-2 focus-visible:outline-none focus-visible:ring-1"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ) : (
          children
        )}
      </dd>
    </>
  );
}
