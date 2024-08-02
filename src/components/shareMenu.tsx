/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useMemo } from "preact/hooks";

import { getCalUrl } from "../../lib/utils";
import { type ShiftModelKeys } from "../../lib/shifts";
import Button, { acceptClasses } from "./button";

/**
 * Display the share menu.
 * @param params             - Preact props.
 * @param params.month       - Searched day's month.
 * @param params.year        - Searched day's year.
 * @param params.search      - Searched day.
 * @param params.shiftModel  - Name of the selected shift-model.
 * @param hide               - Hide the share menu.
 */
export default function ShareMenu({
  year,
  month,
  search,
  shiftModel,
  hide,
}: {
  year?: number;
  month?: number;
  search?: number;
  shiftModel: ShiftModelKeys;
  hide: () => void;
}) {
  const [addSearch, setAddSearch] = useState(false);
  const [addShiftModel, setAddShiftModel] = useState(false);

  useEffect(() => {
    if (search == null && addSearch) {
      setAddSearch(false);
    }
  }, [search, addSearch]);

  useEffect(() => {
    document.getElementById("share_url")?.focus();
    return () => {
      const element = document.getElementById("menu_summary");
      if (element) {
        element.focus();
      }
    };
  }, []);

  const url = useMemo(() => {
    try {
      const base = addShiftModel
        ? getCalUrl({
            shiftModel,
            isFullYear: false,
            year: addSearch ? year! : undefined,
            month: addSearch ? month : undefined,
            day: addSearch && search !== null ? search : null,
          })
        : "/";

      return new URL(base, window.location.href);
    } catch (err) {
      return "";
    }
  }, [year, month, addSearch, search, addShiftModel, shiftModel]);

  return (
    <div
      id="share_menu"
      class="absolute overflow-y-auto overscroll-contain bg-emerald-900 text-white shadow-lg -max-h-screen-safe-offset-12 right-safe-offset-0 top-safe-offset-12"
    >
      <div class="flex flex-col items-stretch justify-center p-3">
        <label class="flex flex-col">
          Adresse zum teilen:
          <input
            id="share_url"
            class="-ml-1 rounded border-0 bg-transparent p-1 text-white"
            type="url"
            readOnly
            value={url.toString()}
            onFocus={(event) => {
              (event.target! as HTMLInputElement).select();
            }}
          />
        </label>

        <h6 class="m-0 mt-5 p-0 text-lg">Füge hinzu:</h6>

        <label class="mt-5">
          <input
            class="mr-1 size-4 accent-violet-700"
            type="checkbox"
            checked={addShiftModel}
            onInput={(event) => {
              const element = event.target as HTMLInputElement;
              setAddShiftModel(element.checked);
              if (!element.checked && addSearch) {
                setAddSearch(false);
              }
            }}
          />
          Schichtmodell
        </label>

        <label class="mt-5">
          <input
            class="mr-1 size-4 accent-violet-700"
            type="checkbox"
            checked={addSearch}
            disabled={search == null}
            onInput={(event) => {
              if (search == null) return;

              const element = event.target as HTMLInputElement;
              setAddSearch(element.checked);
              if (element.checked && !addShiftModel) {
                setAddShiftModel(true);
              }
            }}
          />
          Der gesuchte Tag
          {search == null && (
            <small>
              <br />
              Momentan gibt es kein Suchergebnis.
            </small>
          )}
        </label>

        <div class="mt-5 grid grid-cols-2 gap-5">
          <Button type="cancel" onClick={hide}>
            Abbrechen
          </Button>
          {"navigator" in globalThis && "share" in window.navigator ? ( // eslint-disable-line
            <Button
              type="accept"
              onClick={(event) => {
                event.preventDefault();

                window.navigator
                  .share({
                    url: url.toString(),
                    title: "Schichtkalender",
                    text: `Meine Schichten beim Bosch Reutlingen: ${url}`,
                  })
                  .then(() => {
                    hide();
                  });
              }}
            >
              Teilen
            </Button>
          ) : (
            <a
              class={acceptClasses}
              href={`mailto:?subject=Schichtkalender&body=Meine Schichten beim Bosch Reutlingen: ${url
                .toString()
                .replace(/&/g, "%26")}`}
              onClick={() => {
                setTimeout(hide, 16);
              }}
            >
              Teilen
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
