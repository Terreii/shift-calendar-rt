"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useMemo } from "react";

import { getCalUrl } from "../lib/utils";

import style from "./menu.module.css";
import formStyle from "../styles/form.module.css";

/**
 * Display the share menu.
 * @param params             - Preact props.
 * @param params.group       - Number of selected group. 0 = no group selected/all
 * @param params.month       - Searched day's month.
 * @param params.year        - Searched day's year.
 * @param params.search      - Searched day.
 * @param params.shiftModel  - Name of the selected shift-model.
 * @param hide               - Hide the share menu.
 */
export default function ShareMenu({
  group,
  year,
  month,
  search,
  shiftModel,
  hide,
}: {
  group: number;
  year?: number;
  month?: number;
  search?: number;
  shiftModel: string;
  hide: () => void;
}) {
  const [addGroup, setAddGroup] = useState(false);
  const [addSearch, setAddSearch] = useState(false);
  const [addShiftModel, setAddShiftModel] = useState(false);

  useEffect(() => {
    if (group === 0 && addGroup) {
      setAddGroup(false);
    }
  }, [group, addGroup]);

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
      const url = new URL("/", window.location.href);

      if (addShiftModel) {
        url.pathname = getCalUrl({
          shiftModel,
          isFullYear: false,
          year: addSearch ? year : null,
          month: addSearch ? month : null,
        });

        if (addSearch && search != null) {
          url.searchParams.set("search", search.toString());
        }
        if (addGroup && group > 0) {
          url.searchParams.set("group", group.toString());
        }
      }

      return url;
    } catch (err) {
      return "";
    }
  }, [
    year,
    month,
    addGroup,
    group,
    addSearch,
    search,
    addShiftModel,
    shiftModel,
  ]);

  return (
    <div id="share_menu" className={style.container}>
      <div className={style.scroll_container}>
        <label className={style.element_container}>
          Adresse zum teilen:
          <input
            id="share_url"
            className={style.share_address}
            type="url"
            readOnly
            value={url.toString()}
            onFocus={(event) => {
              event.target.select();
            }}
          />
        </label>

        <h6 className={style.title}>Füge hinzu:</h6>

        <label className={style.share_label}>
          <input
            className={formStyle.checkbox}
            type="checkbox"
            checked={addShiftModel}
            onChange={(event) => {
              setAddShiftModel(event.target.checked);
              if (!event.target.checked && addGroup) {
                setAddGroup(false);
              }
              if (!event.target.checked && addSearch) {
                setAddSearch(false);
              }
            }}
          />
          Schichtmodell
        </label>

        <label className={style.share_label}>
          <input
            className={formStyle.checkbox}
            type="checkbox"
            checked={addGroup}
            disabled={group === 0}
            onChange={(event) => {
              if (group === 0 || group == null) return;

              setAddGroup(event.target.checked);
              if (event.target.checked && !addShiftModel) {
                setAddShiftModel(true);
              }
            }}
          />
          Gruppe
          {group === 0 && (
            <small>
              <br />
              Momentan sind alle Gruppen ausgewählt.
            </small>
          )}
        </label>

        <label className={style.share_label}>
          <input
            className={formStyle.checkbox}
            type="checkbox"
            checked={addSearch}
            disabled={search == null}
            onChange={(event) => {
              if (search == null) return;

              setAddSearch(event.target.checked);
              if (event.target.checked && !addShiftModel) {
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

        <div className={style.buttons_row}>
          <button
            type="button"
            className={formStyle.cancel_button}
            onClick={hide}
          >
            Abbrechen
          </button>
          {"navigator" in globalThis && "share" in window.navigator ? ( // eslint-disable-line
            <button
              type="button"
              className={formStyle.accept_button}
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
              className={formStyle.accept_button}
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
