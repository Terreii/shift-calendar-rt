import type { NextApiRequest, NextApiResponse } from "next";
import xl from "excel4node";

import {
  monthNames,
  ShiftModels,
  excelExportModelFullYearName,
} from "../../../../../lib/constants";
import {
  createShiftSheet,
  createStyles,
} from "../../../../../lib/excel_export";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const wb = new xl.Workbook();
  const year = parseInt(req.query.year as string, 10);
  const model = req.query.model as ShiftModels;

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
