import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";

import Month from "./month";
import selectMonthData from "../lib/select-month-data";
import { shift66Name } from "../config/shifts";
import { getTodayZeroIndex } from "../lib/utils";
import { monthNames } from "../lib/constants";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useParams: () => {
    return { shiftModel: shift66Name };
  },
}));

describe("components/month", () => {
  it("should display the correct month data", () => {
    const [year, month] = getTodayZeroIndex();
    render(
      <Month
        year={year}
        month={month}
        data={selectMonthData(year, month, "6-6")}
        group={0}
      />,
    );

    const caption = screen.queryByText(`${monthNames[month]} ${year} (Jetzt)`);
    expect(caption).toBeTruthy();
    expect(caption.nodeName).toBe("CAPTION");
  });

  it("should pass aXe", async () => {
    const { container } = render(
      <Month
        year={2019}
        month={0}
        data={selectMonthData(2019, 0, "6-6")}
        group={0}
      />,
    );

    let axeResult;
    await act(async () => {
      axeResult = await axe(container);
    });
    expect(axeResult).toHaveNoViolations();
  });
});
