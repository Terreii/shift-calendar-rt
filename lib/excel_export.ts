import xl from "excel4node";

import {
  shiftModelNumberOfGroups,
  shiftModelText,
  maxGroupCount,
  type ShiftModels,
} from "./constants";
import getMonthData from "./workdata";

export type Styles = Map<string | number, any>;

const titleStyleKey = "title";
const dayCellStyleKey = "day";
const headerCellsStyleKey = "header";

const titleRow = 1;
const headerRow = 2;
const startBodyRow = 3;
const dayCol = 1;
const weekDayCol = 2;
const startGroupCol = 3;
const weekDay = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function createDocument() {
  return new xl.Workbook();
}

/**
 * Create a Month of a Workbook/document.
 * @param sheet     An Instance of a excel4node Worksheet.
 * @param model     Shift Model used.
 * @param year      Full Year.
 * @param month     Month where January = 1
 * @param styles    Predefined Styles from createStyles
 */
export function createShiftSheet(
  sheet: any,
  model: ShiftModels,
  year: number,
  month: number,
  styles: Styles,
): void {
  const headerWidth = 2 + shiftModelNumberOfGroups[model];
  sheet
    .cell(titleRow, 1, titleRow, Math.max(headerWidth, 6), true)
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

  buildBody(sheet, model, year, month - 1, styles);

  sheet.row(1).setHeight(20);
  for (let i = 0; i < headerWidth; i++) {
    sheet.column(i + 1).setWidth(i < 2 ? 5 : 7);
  }
}

/**
 * Create the Sheet/Body for this month.
 * @param sheet   The excel4node Sheet.
 * @param model   Name of the model, which should be created.
 * @param year    Year to render.
 * @param month   Month to render (zero indexed).
 * @param styles  Map of all styles.
 */
function buildBody(
  sheet: any,
  model: ShiftModels,
  year: number,
  month: number,
  styles: Styles,
) {
  const data = getMonthData(year, month, model);

  for (let i = 0, max = data.days.length; i < max; i++) {
    const day = data.days[i];
    const dayRow = i + startBodyRow;
    const date = new Date(year, month, i + 1);

    sheet
      .cell(dayRow, dayCol)
      .number(i + 1)
      .style(styles.get(dayCellStyleKey));
    sheet.cell(dayRow, weekDayCol).string(weekDay[date.getDay()]);

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

/**
 * Create predefined document global styles.
 * @param wb An Instance of a excel4node Workbook.
 * @returns  A map of all predefined styles.
 */
export function createStyles(wb: any): Styles {
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
