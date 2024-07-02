/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useMemo } from "preact/hooks";

import { getCalUrl } from "../../../lib/utils";
import { type ShiftModelKeys } from "../../../lib/shifts";

import style from "./style.module.css";
import formStyle from "../../form.module.css";

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
    <div id="share_menu" class={style.container}>
      <div class={style.scroll_container}>
        <label class={style.element_container}>
          Adresse zum teilen:
          <input
            id="share_url"
            class={style.share_address}
            type="url"
            readOnly
            value={url.toString()}
            onFocus={(event) => {
              (event.target! as HTMLInputElement).select();
            }}
          />
        </label>

        <h6 class={style.title}>Füge hinzu:</h6>

        <label class={style.share_label}>
          <input
            class={formStyle.checkbox}
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

        <label class={style.share_label}>
          <input
            class={formStyle.checkbox}
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

        <div class={style.buttons_row}>
          <button type="button" class={formStyle.cancel_button} onClick={hide}>
            Abbrechen
          </button>
          {"navigator" in globalThis && "share" in window.navigator ? ( // eslint-disable-line
            <button
              type="button"
              class={formStyle.accept_button}
              onClick={(event) => {
                event.preventDefault();

                window.navigator
                  .share({
                    url: url.toString(),
                    title: "Schichtkalender",
                    text: "Meine Schichten beim Bosch Reutlingen: " + url,
                  })
                  .then(() => {
                    hide();
                  });
              }}
            >
              Teilen
            </button>
          ) : (
            <a
              class={formStyle.accept_button}
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
