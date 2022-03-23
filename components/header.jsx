/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from "react";
import Link from "next/link";

import Menu from "./menu";
import ShareMenu from "./share-menu";
import NavLinks from "./header-nav-links";

import { useQueryProps, useSaveSettings } from "../hooks/settings";

import style from "./header.module.css";

/**
 * Renders the Header.
 */
export default function Header() {
  const { url, year, month, isFullYear, group, search, shiftModel } =
    useQueryProps();
  useSaveSettings(url, shiftModel, group);

  const [showMenu, setShowMenu] = useShowMenu("nav");
  const [showShareMenu, setShowShareMenu] = useShowMenu("#share_menu");

  return (
    <header className={style.container}>
      <h1 className={style.header}>
        <Link href="/">
          <a className={style.header_link}>
            <span className={style.short_text}>Kalender</span>
            <span className={style.long_text}>Kontischichtkalender Rt</span>
            <svg
              title="Home. Gehe zur Auswahl der Schichtmodelle"
              className={style.text_as_icon}
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
        </Link>
      </h1>
      <nav className={style.navi}>
        <NavLinks
          isFullYear={isFullYear}
          month={month}
          year={year}
          group={group}
          shiftModel={shiftModel}
        />

        <Menu
          show={showMenu}
          isFullYear={isFullYear}
          month={month}
          year={year}
          search={search}
          group={group}
          shiftModel={shiftModel}
          setShowMenu={setShowMenu}
          onShare={() => {
            setShowMenu(false);
            setShowShareMenu(true);
          }}
        />
      </nav>

      {showShareMenu && (
        <ShareMenu
          group={group}
          month={month}
          year={year}
          search={search}
          shiftModel={shiftModel}
          hide={() => {
            setShowShareMenu(false);
          }}
        />
      )}
    </header>
  );
}

/**
 * Handle the show state of a menu.
 * @param {string} insideSelector Selector for the container,
 *                                clicking outside of which the menu will close the menu.
 */
function useShowMenu(insideSelector) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      // Hide on click outside of insideSelector
      const hide = (event) => {
        if (event.target.closest(insideSelector) == null) {
          setShow(false);
        }
      };

      // Hide on hitting ESC
      const keyEvent = (event) => {
        if (event.code === "Escape" || event.keyCode === 27) {
          setShow(false);

          // Focus the menu toggle button, Because both menus start from there.
          const element = document.getElementById("menu_summary");
          if (element) {
            element.focus();
          }
        }
      };

      window.addEventListener("click", hide);
      window.addEventListener("keyup", keyEvent);
      return () => {
        window.removeEventListener("click", hide);
        window.removeEventListener("keyup", keyEvent);
      };
    }
  }, [show, insideSelector]);

  return [show, setShow];
}
