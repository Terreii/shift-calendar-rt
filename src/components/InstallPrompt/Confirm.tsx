/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import style from "./style.module.css";
import formStyles from "../../form.module.css";

const hiddenState = { scale: 0.99, translate: "0 0.5rem", opacity: 0 };
const shownState = { scale: 1, translate: "none", opacity: 1 };

export default function Confirm({
  children,
  confirmText,
  onClick,
}: {
  children: ComponentChildren;
  confirmText: string | ComponentChildren;
  onClick: (didConfirm: boolean) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [isShowing, setIsShowing] = useState(false);
  useEffect(() => {
    if (shouldAnimate(container.current)) {
      let isActive = true;
      const animation = container.current?.animate([hiddenState, shownState], {
        duration: 250,
        fill: "both",
      });
      animation?.finished.then(() => {
        if (isActive) {
          setIsShowing(true);
        }
      });
      return () => {
        isActive = false;
      };
    }
    setIsShowing(true);
  }, []);

  const onClose = async (confirmed: boolean) => {
    if (shouldAnimate(container.current)) {
      await container.current?.animate([shownState, hiddenState], {
        duration: 250,
        fill: "forwards",
      }).finished;
    }
    onClick(confirmed);
  };

  return (
    <aside
      class={isShowing ? style.container : style.container_initial}
      ref={container}
    >
      <div class={style.content}>{children}</div>

      <div class={style.buttons_row}>
        <button
          type="button"
          class={formStyles.accept_button_with_img}
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
          class={formStyles.cancel_button}
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
