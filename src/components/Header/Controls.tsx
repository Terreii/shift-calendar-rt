/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import {
  useState,
  useEffect,
  type Dispatch,
  type StateUpdater,
} from "preact/hooks";

import Menu from "../Menu";
import ShareMenu from "../Menu/ShareMenu";
import NavLinks from "./Nav-Links";

import { useQueryProps } from "./useQueryProps";

import style from "./style.module.css";

/**
 * Renders the Header.
 */
export default function Header() {
  const { year, month, isFullYear, search, shiftModel } = useQueryProps();

  const [showMenu, setShowMenu] = useShowMenu("nav");
  const [showShareMenu, setShowShareMenu] = useShowMenu("#share_menu");

  return (
    <>
      <nav className={style.navi}>
        <NavLinks
          isFullYear={isFullYear}
          month={month}
          year={year}
          shiftModel={shiftModel}
        />

        <Menu
          show={showMenu}
          isFullYear={isFullYear}
          month={month}
          year={year}
          search={search}
          shiftModel={shiftModel}
          setShowMenu={setShowMenu}
          onShare={(event) => {
            event.stopPropagation();
            setShowMenu(false);
            setShowShareMenu(true);
          }}
        />
      </nav>

      {showShareMenu && (
        <ShareMenu
          month={month}
          year={year}
          search={search ?? undefined}
          shiftModel={shiftModel}
          hide={() => {
            setShowShareMenu(false);
          }}
        />
      )}
    </>
  );
}

/**
 * Handle the show state of a menu.
 * @param insideSelector Selector for the container,
 *                       clicking outside of which the menu will close the menu.
 */
function useShowMenu(
  insideSelector: string,
): [boolean, Dispatch<StateUpdater<boolean>>] {
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
