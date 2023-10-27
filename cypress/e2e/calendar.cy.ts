/* eslint-disable jest/expect-expect */

import formatISO from "date-fns/formatISO";
import startOfMonth from "date-fns/startOfMonth";
import {
  shiftModelText,
  shiftModelNames,
  monthNames,
  shiftModelNumberOfGroups,
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
  }
});
