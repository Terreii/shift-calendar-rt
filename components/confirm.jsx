/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useEffect, useRef, useState } from "react";

import style from "./prompts.module.css";
import formStyles from "../styles/form.module.css";

const hiddenState = { scale: 0.99, translate: "0 0.5rem", opacity: 0 };
const shownState = { scale: 1, translate: "none", opacity: 1 };

export default function Confirm({ children, confirmText, onClick }) {
  const container = useRef(null);
  const [isShowing, setIsShowing] = useState(false);
  useEffect(() => {
    if (shouldAnimate(container.current)) {
      let isActive = true;
      const animation = container.current.animate([hiddenState, shownState], {
        duration: 250,
        fill: "both",
      });
      animation.finished.then(() => {
        if (isActive) {
          setIsShowing(true);
        }
      });
      return () => {
        isActive = false;
      };
    } else {
      setIsShowing(true);
    }
  }, []);

  const onClose = async (confirmed) => {
    if (shouldAnimate(container.current)) {
      await container.current.animate([shownState, hiddenState], {
        duration: 250,
        fill: "forwards",
      }).finished;
    }
    onClick(confirmed);
  };

  return (
    <aside
      className={isShowing ? style.container : style.container_initial}
      ref={container}
    >
      <div className={style.content}>{children}</div>

      <div className={style.buttons_row}>
        <button
          type="button"
          className={formStyles.accept_button_with_img}
          onClick={() => {
            onClose(true);
          }}
        >
          {confirmText}
        </button>
        <button
          type="button"
          onClick={() => {
            onClose(false);
          }}
          title="Klicke um den Kalender nicht zu installieren"
          className={formStyles.cancel_button}
        >
          Abbrechen
        </button>
      </div>
    </aside>
  );
}

/**
 * Check if the user prefers reduced motion.
 * @param {HTMLElement} element   Element to animate.
 * @returns {boolean} The User prefers reduced motion.
 */
function shouldAnimate(element) {
  return (
    element?.animate &&
    !window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  );
}
