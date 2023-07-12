import type { NextApiRequest, NextApiResponse } from "next";
import xl from "excel4node";

import {
  shiftModelNames,
  shiftModelNumberOfGroups,
  shiftModelText,
  maxGroupCount,
} from "../../../../lib/constants";
import getMonthData from "../../../../lib/workdata";

type Styles = Map<string | number, any>;

const titleStyleKey = "title";
const dayCellStyleKey = "day";
const headerCellsStyleKey = "header";

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

  const styles = createStyles(wb);

  for (const model of shiftModelNames) {
    createShiftSheet(
      model,
      year,
      month,
      wb.addWorksheet(shiftModelText[model]),
      styles,
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
  styles: Styles,
): void {
  const headerWidth = 2 + shiftModelNumberOfGroups[model];
  sheet
    .cell(titleRow, 1, titleRow, headerWidth, true)
    .string(
      `${shiftModelText[model]} ${year}-${String(month).padStart(2, "0")}`,
    )
    .style(styles.get(titleStyleKey));

  const headerStyle = styles.get(headerCellsStyleKey);

  sheet.cell(headerRow, dayCol).string("Tag").style(headerStyle);
  for (let i = 0, max = shiftModelNumberOfGroups[model]; i < max; i++) {
    sheet
      .cell(headerRow, i + startGroupCol)
      .string(`Gr. ${i + 1}`)
      .style(headerStyle);
  }

  buildBody(sheet, model, year, month, styles);

  sheet.row(1).setHeight(20);
  for (let i = 0; i < headerWidth; i++) {
    sheet.column(i + 1).setWidth(i < 2 ? 5 : 7);
  }
}

function buildBody(
  sheet: any,
  model: string,
  year: number,
  month: number,
  styles: Styles,
) {
  const data = getMonthData(year, month, model);

  for (let i = 0, max = data.days.length; i < max; i++) {
    const day = data.days[i];
    const dayRow = i + startBodyRow;

    sheet
      .cell(dayRow, dayCol)
      .number(i + 1)
      .style(styles.get(dayCellStyleKey));
    sheet
      .cell(dayRow, weekDayCol)
      .formula(`TEXT(DATE(${year},${month},${i + 1}),"ddd")`);

    for (let j = 0, groupCount = day.length; j < groupCount; j++) {
      const shift = day[j];
      if (shift !== "K") {
        sheet
          .cell(dayRow, startGroupCol + j)
          .string(shift)
          .style(styles.get(j));
      }
    }
  }
}

function createStyles(wb: any): Styles {
  const styles: Styles = new Map();

  styles.set(
    titleStyleKey,
    wb.createStyle({
      alignment: { horizontal: "center" },
      font: { bold: true, size: 16 },
    }),
  );

  styles.set(
    headerCellsStyleKey,
    wb.createStyle({
      alignment: { horizontal: "center" },
      font: { bold: true, size: 14 },
    }),
  );

  styles.set(
    dayCellStyleKey,
    wb.createStyle({
      alignment: {
        horizontal: "left",
      },
    }),
  );

  const groupColors = ["pink", "yellow", "red", "green", "light blue", "brown"];
  for (let i = 0; i < maxGroupCount; i++) {
    styles.set(
      i,
      wb.createStyle({
        alignment: { horizontal: "center" },
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: groupColors[i],
          fgColor: groupColors[i],
        },
      }),
    );
  }
  return styles;
}
