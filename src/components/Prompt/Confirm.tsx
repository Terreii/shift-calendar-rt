/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import classNames from "classnames";
import { type ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import Button from "../button";

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
      class={classNames(
        "sm:mb-safe sm:ml-safe sticky bottom-0 left-0 flex w-full flex-col border-0 border-t border-gray-200 bg-white text-gray-900 shadow-lg sm:bottom-1 sm:left-1 sm:max-w-96 sm:rounded-sm sm:border",
        { "translate-y-4 scale-95 opacity-0": isShowing },
      )}
      ref={container}
    >
      <div class="p-5">{children}</div>

      <div class="m-3 mr-5 flex flex-row items-center justify-end gap-5">
        <Button
          type="accept"
          hasImg
          onClick={() => {
            onClose(true);
          }}
        >
          {confirmText}
        </Button>
        <Button
          type="cancel"
          onClick={() => {
            onClose(false);
          }}
          title="Klicke um den Kalender nicht zu installieren"
        >
          Abbrechen
        </Button>
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
