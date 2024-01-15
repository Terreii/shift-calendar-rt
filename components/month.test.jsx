import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";

import Month from "./month";
import selectMonthData from "../lib/select-month-data";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useSearchParams: () => {
    const router = require("next-router-mock").useRouter();
    const path = router.asPath.split("?")?.[1] ?? "";
    return new URLSearchParams(path);
  },
}));

describe("components/month", () => {
  it("should display the correct month data", () => {
    render(
      <Month
        year={2019}
        month={0}
        data={selectMonthData(2019, 0, "6-6")}
        today={[2019, 0, 13]}
        group={0}
      />,
    );

    const caption = screen.queryByText("Januar 2019 (Jetzt)");
    expect(caption).toBeTruthy();
    expect(caption.nodeName).toBe("CAPTION");
  });

  it("should pass aXe", async () => {
    const { container } = render(
      <Month
        year={2019}
        month={0}
        data={selectMonthData(2019, 0, "6-6")}
        today={[2019, 0, 13]}
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
