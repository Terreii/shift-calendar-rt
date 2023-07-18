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
  const wb = new xl.Workbook();
  const year = parseInt(req.query.year as string, 10);
  const month = parseInt(req.query.month as string, 10);

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
