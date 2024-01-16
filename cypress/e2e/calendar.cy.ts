/* eslint-disable jest/expect-expect, cypress/no-unnecessary-waiting */

import { addMonths } from "date-fns/addMonths";
import { formatISO } from "date-fns/formatISO";
import { startOfMonth } from "date-fns/startOfMonth";
import shifts from "../../config/shifts";
import {
  shiftModelText,
  shiftModelNames,
  monthNames,
  shiftModelNumberOfGroups,
} from "../../lib/constants";
import { getToday } from "../../lib/utils";
import { getMonthData } from "../../lib/workdata";

const model =
  shiftModelNames[Math.floor(Math.random() * shiftModelNames.length)];

describe("shift calendar current view", () => {
  it(`renders ${model}`, () => {
    cy.visit("http://localhost:3000/");

    cy.contains("main a", shiftModelText[model]).click();

    cy.url().should("include", `/cal/${model}`);

    const today = getToday();
    const now = new Date(today[0], today[1] - 1, today[2], today[3]);
    cy.contains(`${monthNames[now.getMonth()]} ${now.getFullYear()} (Jetzt)`);
    cy.get(`#day_${formatISO(now, { representation: "date" })}`).should(
      "have.attr",
      "data-interest",
      "today",
    );
  });

  it("renders the shifts of " + model, () => {
    cy.visit("http://localhost:3000/cal/" + model);

    const today = getToday();
    const now = startOfMonth(
      new Date(today[0], today[1] - 1, today[2], today[3]),
    );
    const getDayRow = () =>
      cy.get(`#day_${formatISO(now, { representation: "date" })}`);
    const getChild = (index: number) =>
      getDayRow().children(`:nth-child(${index + 2})`);

    const childrenCount = 3 + shiftModelNumberOfGroups[model];
    getDayRow().children().should("have.length", childrenCount);

    // day in month
    getChild(0).should("have.text", now.getDate());
    // day of the week
    getChild(1).contains(
      new Intl.DateTimeFormat("de-DE", { weekday: "short" }).format(now),
    );
    getChild(1).contains(
      new Intl.DateTimeFormat("de-DE", { weekday: "long" }).format(now),
    );

    // shifts
    const data = getMonthData(now.getFullYear(), now.getMonth(), model);
    const dataOfTheDay = data.days[0];
    dataOfTheDay.forEach((shift, index) => {
      if (shift === "K") {
        getChild(index + 2).should("not.have.text");
      } else {
        getChild(index + 2)
          .should("have.text", shift)
          .and("have.attr", "data-group", index + 1);
      }
    });
  });

  it("should render all shifts in legend", () => {
    cy.visit("http://localhost:3000/cal/" + model);

    const shift = shifts[model];
    for (const key in shift.shifts) {
      cy.contains("dt", key);
      cy.contains("dd", shift.shifts[key].name);
    }
  });

  it("should have nav buttons", () => {
    cy.visit("http://localhost:3000/cal/" + model);

    const today = getToday();
    const now = new Date(today[0], today[1] - 1, today[2], today[3]);
    const getMonthPath = (diff: number) => {
      const month = addMonths(now, diff);
      const monthString = (month.getMonth() + 1).toString().padStart(2, "0");
      return `/cal/${model}/${month.getFullYear()}/${monthString}`;
    };
    cy.contains("nav a", "<").should("have.attr", "href", getMonthPath(-1));
    cy.contains("nav a", ">").should("have.attr", "href", getMonthPath(1));
  });

  it("should render holidays", () => {
    // school breaks
    cy.visit(`http://localhost:3000/cal/${model}/2023/07`);
    cy.get('#day_2023-07-27 > td[title="Sommerferien"][data-holiday="school"]');

    // holidays
    cy.visit(`http://localhost:3000/cal/${model}/2023/10`);
    cy.get(
      '#day_2023-10-03 > td[title="Tag der deutschen Einheit"][data-holiday="holiday"]',
    );
  });

  it("should navigate to next and previous month on swipe on mobile", () => {
    cy.visit("http://localhost:3000/cal/" + model);
    const today = new Date();
    const nextMonth = addMonths(today, 1);

    const triggerPointer = (
      name: "pointerdown" | "pointermove" | "pointerup",
      position: "topRight" | "topLeft",
    ) => {
      const clientX = position === "topLeft" ? 50 : 100;
      cy.get("#calendar_main_out").trigger(name, position, {
        pointerType: "touch",
        pointerId: 1,
        isPrimary: true,
        clientX,
        clientY: 100,
        eventConstructor: "PointerEvent",
      });
    };

    triggerPointer("pointerdown", "topRight");
    cy.wait(25);
    triggerPointer("pointermove", "topLeft");
    cy.wait(25);
    triggerPointer("pointerup", "topLeft");
    cy.wait(100); // Needed for Firefox
    cy.url().should(
      "include",
      `/cal/${model}/${nextMonth.getFullYear()}/${String(
        nextMonth.getMonth() + 1,
      ).padStart(2, "0")}`,
    );

    triggerPointer("pointerdown", "topLeft");
    cy.wait(25);
    triggerPointer("pointermove", "topRight");
    cy.wait(25);
    triggerPointer("pointerup", "topRight");
    cy.wait(100); // Needed for Firefox
    cy.url().should(
      "include",
      `/cal/${model}/${today.getFullYear()}/${String(
        today.getMonth() + 1,
      ).padStart(2, "0")}`,
    );
  });
});

describe("full year", () => {
  it("should be accessible by the menu", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("main a", shiftModelText[model]).click();

    cy.get("#menu_summary").click();
    cy.get("#hamburger_menu").contains("Zeige ganzes Jahr").click();

    const today = getToday();
    const now = new Date(today[0], today[1] - 1, today[2], today[3]);
    cy.url().should("include", `/cal/${model}/${now.getFullYear()}`);

    for (let i = 1; i <= 12; i++) {
      // i starts at 1!
      cy.get(`#month_${now.getFullYear()}-${i}`);
    }
  });

  it("today button should go back to current month view", () => {
    cy.visit(`http://localhost:3000/cal/${model}/2022`);
    const today = getToday();
    const now = new Date(today[0], today[1] - 1, today[2], today[3]);

    cy.contains("nav a", "<").should("have.attr", "href", `/cal/${model}/2021`);
    cy.contains("nav a", ">").should("have.attr", "href", `/cal/${model}/2023`);

    cy.contains("Heute").click();

    cy.url()
      .should("not.include", `/cal/${model}/${now.getFullYear()}`)
      .and(
        "include",
        `/cal/${model}#day_${formatISO(now, { representation: "date" })}`,
      );
  });
});
