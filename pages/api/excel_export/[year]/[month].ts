import type { NextApiRequest, NextApiResponse } from "next";
import xl from "excel4node";

import { shiftModelNames } from "../../../../lib/constants";
import { createShiftSheet, createStyles } from "../../../../lib/excel_export";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const wb = new xl.Workbook();
  const year = parseInt(req.query.year as string, 10);
  const month = parseInt(req.query.month as string, 10);

  const styles = createStyles(wb);

  for (const model of shiftModelNames) {
    createShiftSheet(wb, model, year, month, styles);
  }

  wb.write(
    `Shift_Export_${year}-${month.toString().padStart(2, "0")}.xlsx`,
    res,
  );
}
