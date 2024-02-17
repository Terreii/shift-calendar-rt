/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { NextResponse, type NextRequest } from "next/server";

import generate from "../../../../../lib/ics_generator";
import {
  shiftModelNames,
  maxGroupCount,
  ShiftModels,
} from "../../../../../lib/constants";

export async function GET(
  _request: NextRequest,
  {
    params: { model, group: groupStr },
  }: { params: { model: ShiftModels; group: string } },
) {
  if (!shiftModelNames.includes(model)) {
    return NextResponse.json(
      {
        status: 404,
        error: "Unknown shift model",
        describtion:
          "This url must have a valid shift model! Example: /api/ics/6-6/5",
        shiftModelNames,
      },
      { status: 404 },
    );
  }
  const group = parseInt(groupStr, 10);
  if (Number.isNaN(group) || group <= 0 || group > maxGroupCount[model]) {
    return NextResponse.json(
      {
        status: 404,
        error: "Unknown group",
        describtion:
          "This url must have a valid shift model group!\nIt can't be 0 or less and bigger" +
          " then model_number_of_groups. Example: /api/ics/6-6/5",
        shift_model_name: model,
        model_number_of_groups: maxGroupCount[model],
      },
      { status: 404 },
    );
  }

  const icsFile = generate(model, group - 1);
  const body = new ReadableStream({
    pull(controller) {
      const { value, done } = icsFile.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  }).pipeThrough(new TextEncoderStream());

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar",
      "Cache-Control": "s-maxage=2592000, public",
    },
  });
}
