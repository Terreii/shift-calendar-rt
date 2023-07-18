import type { NextApiRequest, NextApiResponse } from "next";
import xl from "excel4node";

import {
  monthNames,
  shiftModelNames,
  ShiftModels,
  excelExportModelFullYearName,
} from "../../../../../lib/constants";
import {
  createShiftSheet,
  createStyles,
} from "../../../../../lib/excel_export";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const year = parseInt(req.query.year as string, 10);
  const model = req.query.model as ShiftModels;

  if (Number.isNaN(year) || year < 2010) {
    res.status(404).json({
      status: 404,
      error: "Unknown year",
      describtion:
        "This url must have a year! Example: /api/excel_export/shift/6-6/2023",
    });
    return;
  }
  if (!shiftModelNames.includes(model)) {
    res.status(404).json({
      status: 404,
      error: "Unknown shift model",
      describtion:
        "This url must have a valid shift model! Example: /api/excel_export/shift/6-6/2023",
      shiftModelNames,
    });
    return;
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

  wb.write(excelExportModelFullYearName(model, year), res);
}
