/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type ComponentChildren } from "preact";
import Helmet from "preact-helmet";

import Legend from "../legend";
import Downloader from "../download";
import { type ShiftModelKeys } from "../../../lib/shifts";

export default function Container({
  title,
  model,
  year,
  month,
  children,
}: {
  title: string;
  model: ShiftModelKeys;
  year: number;
  month: number;
  children: ComponentChildren;
}) {
  return (
    <main class="flex flex-col items-center pt-4 mx-safe max-[365px]:mx-auto max-[365px]:mb-safe">
      <Helmet title={title} />

      <Legend shiftKey={model} year={year} month={month} />

      {children}

      <Downloader />
    </main>
  );
}
