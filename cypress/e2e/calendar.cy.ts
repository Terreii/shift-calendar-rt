/* eslint-disable jest/expect-expect */

import addMonths from "date-fns/addMonths";
import formatISO from "date-fns/formatISO";
import startOfMonth from "date-fns/startOfMonth";
import {
  shiftModelText,
  shiftModelNames,
  monthNames,
  shiftModelNumberOfGroups,
} from "../../lib/constants";
import { getMonthData } from "../../lib/workdata";

const model =
  shiftModelNames[Math.floor(Math.random() * shiftModelNames.length)];

describe("shift calendar current view", () => {
  it(`renders ${model}`, () => {
    cy.visit("http://localhost:3000/");

    cy.contains("main a", shiftModelText[model]).click();

    cy.url().should("include", `/cal/${model}`);

    const now = new Date();
    cy.contains(`${monthNames[now.getMonth()]} ${now.getFullYear()} (Jetzt)`);
    cy.get(`#day_${formatISO(now, { representation: "date" })}`).should(
      "have.attr",
      "data-interest",
      "today",
    );
  });

  it("renders the shifts of " + model, () => {
    cy.visit("http://localhost:3000/cal/" + model);

    const now = startOfMonth(new Date());
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

  it("should have nav buttons", () => {
    cy.visit("http://localhost:3000/cal/" + model);

    const now = new Date();
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
});

describe("full year", () => {
  it("should be accessible by the menu", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("main a", shiftModelText[model]).click();

    cy.get("#menu_summary").click();
    cy.get("#hamburger_menu").contains("Zeige ganzes Jahr").click();

    const now = new Date();
    cy.url().should("include", `/cal/${model}/${now.getFullYear()}`);

    for (let i = 1; i <= 12; i++) {
      // i starts at 1!
      cy.get(`#month_${now.getFullYear()}-${i}`);
    }
  });

  it("today button should go back to current month view", () => {
    cy.visit(`http://localhost:3000/cal/${model}/2022`);
    const now = new Date();

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
