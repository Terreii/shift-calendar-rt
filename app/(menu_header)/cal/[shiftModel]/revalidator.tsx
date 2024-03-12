"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useTodayZeroIndex } from "../../../../hooks/time";

export default function Revalidator({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const router = useRouter();
  const [yearNow, monthNow] = useTodayZeroIndex();
  useEffect(() => {
    if (yearNow !== year || monthNow !== month) {
      router.refresh();
    }
  }, [router, yearNow, monthNow, year, month]);
  return null;
}
