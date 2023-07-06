import { render } from "@testing-library/react";
import { axe } from "jest-axe";

import Month from "./month";
import selectMonthData from "../lib/select-month-data";

describe("components/month", () => {
  it("should display the correct month data", () => {
    const { queryByText } = render(
      <Month
        year={2019}
        month={0}
        data={selectMonthData(2019, 0, false)}
        today={[2019, 0, 13]}
        group={0}
      />,
    );

    const caption = queryByText("Januar 2019 (Jetzt)");
    expect(caption).toBeTruthy();
    expect(caption.nodeName).toBe("CAPTION");
  });

  it("should pass aXe", async () => {
    const { container } = render(
      <Month
        year={2019}
        month={0}
        data={selectMonthData(2019, 0, false)}
        today={[2019, 0, 13]}
        group={0}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
