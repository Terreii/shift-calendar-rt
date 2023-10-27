/* eslint-disable jest/expect-expect */

import addMonths from "date-fns/addMonths";
import formatISO from "date-fns/formatISO";
import startOfMonth from "date-fns/startOfMonth";
import {
  shiftModelText,
  shiftModelNames,
  monthNames,
  shiftModelNumberOfGroups,
  shift66Name,
} from "../../lib/constants";
import getShiftData from "../../lib/workdata";

describe("shift calendar current view", () => {
  for (const model of shiftModelNames) {
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
      const data = getShiftData(now.getFullYear(), now.getMonth(), model);
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
  }
});

describe("full year", () => {
  it("should be accessible by the menu", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("main a", shiftModelText[shift66Name]).click();

    cy.get("#menu_summary").click();
    cy.get("#hamburger_menu").contains("Zeige ganzes Jahr").click();

    const now = new Date();
    cy.url().should("include", `/cal/${shift66Name}/${now.getFullYear()}`);

    for (let i = 1; i <= 12; i++) {
      // i starts at 1!
      cy.get(`#month_${now.getFullYear()}-${i}`);
    }
  });

  it("today button should go back to current month view", () => {
    cy.visit(`http://localhost:3000/cal/${shift66Name}/2022`);
    const now = new Date();

    cy.contains("nav a", "<").should(
      "have.attr",
      "href",
      `/cal/${shift66Name}/2021`,
    );
    cy.contains("nav a", ">").should(
      "have.attr",
      "href",
      `/cal/${shift66Name}/2023`,
    );

    cy.contains("Heute").click();

    cy.url()
      .should("not.include", `/cal/${shift66Name}/${now.getFullYear()}`)
      .and(
        "include",
        `/cal/${shift66Name}#day_${formatISO(now, { representation: "date" })}`,
      );
  });
});
