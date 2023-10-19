/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type NextRequest, NextResponse } from "next/server";
import xl from "excel4node";

import {
  shiftModelNames,
  shiftModelText,
} from "../../../../../../lib/constants";
import {
  createShiftSheet,
  createStyles,
} from "../../../../../../lib/excel_export";

export async function GET(
  _request: NextRequest,
  { params }: { params: { year: string; month: string } },
) {
  const year = parseInt(params.year as string, 10);
  const month = parseInt(params.month as string, 10);

  if (
    Number.isNaN(year) ||
    year < 2010 ||
    Number.isNaN(month) ||
    month < 1 ||
    month > 12
  ) {
    return NextResponse.json(
      {
        status: 404,
        error: "Unknown year or month",
        describtion:
          "This url must have a year and month! Example: /api/excel_export/all/2023/4",
      },
      { status: 404 },
    );
  }

  const wb = new xl.Workbook();
  const styles = createStyles(wb);

  for (const model of shiftModelNames) {
    createShiftSheet(
      wb.addWorksheet(shiftModelText[model]),
      model,
      year,
      month,
      styles,
    );
  }

  const buffer = await wb.writeToBuffer();
  return new NextResponse(buffer);
}
