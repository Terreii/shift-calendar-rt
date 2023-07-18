import type { NextApiRequest, NextApiResponse } from "next";
import xl from "excel4node";

import {
  shiftModelNames,
  excelExportName,
  shiftModelText,
} from "../../../../../lib/constants";
import {
  createShiftSheet,
  createStyles,
} from "../../../../../lib/excel_export";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const year = parseInt(req.query.year as string, 10);
  const month = parseInt(req.query.month as string, 10);

  if (
    Number.isNaN(year) ||
    year < 2010 ||
    Number.isNaN(month) ||
    month < 1 ||
    month > 12
  ) {
    res.status(404).json({
      status: 404,
      error: "Unknown year or month",
      describtion:
        "This url must have a year and month! Example: /api/excel_export/all/2023/4",
    });
    return;
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

  wb.write(excelExportName(year, month), res);
}
