/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type NextRequest, NextResponse } from "next/server";
import xl from "excel4node";

import {
  monthNames,
  shiftModelNames,
  ShiftModels,
} from "../../../../../../lib/constants";
import {
  createShiftSheet,
  createStyles,
} from "../../../../../../lib/excel_export";

export async function GET(
  _request: NextRequest,
  { params }: { params: { year: string; model: string } },
) {
  const year = parseInt(params.year as string, 10);
  const model = params.model as ShiftModels;

  if (Number.isNaN(year) || year < 2010) {
    return NextResponse.json(
      {
        status: 404,
        error: "Unknown year",
        describtion:
          "This url must have a year! Example: /api/excel_export/shift/6-6/2023",
      },
      { status: 404 },
    );
  }
  if (!shiftModelNames.includes(model)) {
    return NextResponse.json(
      {
        status: 404,
        error: "Unknown shift model",
        describtion:
          "This url must have a valid shift model! Example: /api/excel_export/shift/6-6/2023",
        shiftModelNames,
      },
      { status: 404 },
    );
  }

  const wb = new xl.Workbook();
  const styles = createStyles(wb);

  for (let i = 0; i < 12; i++) {
    createShiftSheet(
      wb.addWorksheet(monthNames[i]),
      model,
      year,
      i + 1,
      styles,
    );
  }

  const buffer = await wb.writeToBuffer();
  return new NextResponse(buffer);
}
