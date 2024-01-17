import { render, screen } from "@testing-library/react";

import Header from ".";

jest.mock("../../hooks/settings");
jest.mock("../../hooks/time");
jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useSearchParams: () => {
    const router = require("next-router-mock").useRouter();
    const path = router.asPath.split("?")?.[1] ?? "";
    return new URLSearchParams(path);
  },
}));

describe("components/Header", () => {
  it("should show the correct navigation links and buttons", () => {
    render(<Header />);

    const link = screen.queryByText("Kalender");
    expect(link).toBeTruthy();
    expect(link.nodeName).toBe("SPAN");

    const todayButton = screen.queryByText("Heute");
    expect(todayButton).toBeTruthy();
    expect(todayButton.nodeName).toBe("A");
    expect(todayButton.href).toBe("http://localhost/cal/6-6#day_2021-01-25");
    expect(todayButton.title).toBe("zeige aktuellen Monat");

    const yesterday = screen.queryByText("<");
    expect(yesterday).toBeTruthy();
    expect(yesterday.nodeName).toBe("A");
    expect(yesterday.href).toBe("http://localhost/cal/6-6/2020/12");
    expect(yesterday.title).toBe("vorigen Monat");

    const tomorrow = screen.queryByText(">");
    expect(tomorrow).toBeTruthy();
    expect(tomorrow.nodeName).toBe("A");
    expect(tomorrow.href).toBe("http://localhost/cal/6-6/2021/02");
    expect(tomorrow.title).toBe("nächster Monat");
  });
});
