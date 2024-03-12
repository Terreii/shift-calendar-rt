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
  today: currentToday,
}: {
  today: [number, number, number, number];
}) {
  const router = useRouter();
  const today = useTodayZeroIndex();
  useEffect(() => {
    if (currentToday.some((item, index) => item !== today[index])) {
      router.refresh();
    }
  }, [router, currentToday, today]);
  return null;
}
