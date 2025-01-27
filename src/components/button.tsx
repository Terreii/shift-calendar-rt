/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type JSX } from "preact";
import classnames from "classnames";

const accept =
  "bg-violet-700 text-white hover:bg-violet-600 focus-visible:bg-violet-600";
const cancel =
  "border border-violet-700 bg-gray-50 text-violet-700 hover:border-violet-900 hover:text-violet-900 focus-visible:border-violet-900 focus-visible:text-violet-900";
export const acceptClasses = `btn ${accept}`;
export const cancelClasses = `btn ${cancel}`;

export default function Button({
  children,
  class: className,
  type,
  hasImg,
  ...args
}: JSX.HTMLAttributes<HTMLButtonElement> & {
  type: "cancel" | "accept";
  hasImg?: boolean;
}) {
  return (
    <button
      {...args}
      type="button"
      class={classnames("btn", className, {
        [cancel]: type === "cancel",
        [accept]: type === "accept",
        "px-3 py-1 *:first:size-7 *:first:-translate-x-1 *:first:pr-1 *:first:invert":
          hasImg,
      })}
    >
      {children}
    </button>
  );
}
