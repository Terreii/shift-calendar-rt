"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import type { ReactNode } from "react";

import { useTitleAlert } from "../../../../../hooks/utils";
import { useUnloadedFix } from "../../../../../hooks/time";

import style from "../../../../../styles/calendar.module.css";

export default function Container({ children }: { children: ReactNode }) {
  const clickHandler = useTitleAlert();

  const shouldRemoveCalendar = useUnloadedFix();
  if (shouldRemoveCalendar) {
    return null;
  }

  return (
    <div
      id="calendar_main_out"
      className={style.container}
      onClick={clickHandler}
      aria-live="polite"
    >
      {children}
    </div>
  );
}
