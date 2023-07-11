import type { NextApiRequest, NextApiResponse } from "next";
import xl from "excel4node";

import {
  shiftModelNames,
  shiftModelNumberOfGroups,
  shiftModelText,
} from "../../../../lib/constants";
import getMonthData from "../../../../lib/workdata";

const titleRow = 1;
const headerRow = 2;
const startBodyRow = 3;
const dayCol = 1;
const weekDayCol = 2;
const startGroupCol = 3;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const wb = new xl.Workbook();
  const year = parseInt(req.query.year as string, 10);
  const month = parseInt(req.query.month as string, 10);

  for (const model of shiftModelNames) {
    createShiftSheet(
      model,
      year,
      month,
      wb.addWorksheet(shiftModelText[model]),
    );
  }

  wb.write(
    `Shift_Export_${year}-${month.toString().padStart(2, "0")}.xlsx`,
    res,
  );
}

function createShiftSheet(
  model: string,
  year: number,
  month: number,
  sheet: any,
): void {
  sheet
    .cell(titleRow, 1, titleRow, 2, true)
    .string(
      `${shiftModelText[model]} ${year}-${String(month).padStart(2, "0")}`,
    );

  sheet.cell(headerRow, dayCol).string("Tag");
  for (let i = 0, max = shiftModelNumberOfGroups[model]; i < max; i++) {
    sheet.cell(headerRow, i + startGroupCol).string(`Gr. ${i + 1}`);
  }

  buildBody(sheet, model, year, month);
}

function buildBody(sheet: any, model: string, year: number, month: number) {
  const data = getMonthData(year, month, model);

  for (let i = 0, max = data.days.length; i < max; i++) {
    const day = data.days[i];
    const dayRow = i + startBodyRow;

    sheet.cell(dayRow, dayCol).number(i + 1);
    sheet
      .cell(dayRow, weekDayCol)
      .formula(`TEXT(DATE(${year},${month},${i + 1}),"ddd")`);

    for (let j = 0, groupCount = day.length; j < groupCount; j++) {
      const shift = day[j];
      if (shift !== "K") {
        sheet.cell(dayRow, startGroupCol + j).string(shift);
      }
    }
  }
}
