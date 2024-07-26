/* eslint-disable cypress/no-unnecessary-waiting */

import {
  shiftModelText,
  shiftModelNames,
  monthNames,
  excelExportName,
  excelExportModelFullYearName,
} from "../../lib/constants";
import { shift44Name } from "../../lib/shifts";

const baseUrl = Cypress.config("baseUrl")!;

describe("basic usage", () => {
  it("should have all shift models on index", () => {
    cy.visit(baseUrl);

    for (const key of shiftModelNames) {
      const name = shiftModelText[key];
      cy.contains("main a", name)
        .should("have.attr", "href")
        .and("include", key);
    }
    cy.contains("main a", shift44Name).should("not.exist");
  });

  it("should redirect a user to their last viewed shift model on /?pwa", () => {
    const shiftModel =
      shiftModelNames[Math.floor(Math.random() * shiftModelNames.length)];
    cy.visit("/?pwa");
    cy.wait(250);
    cy.contains(shiftModelText[shiftModel]).click();
    cy.url().should("include", "/cal/" + shiftModel);

    cy.wait(250);
    cy.visit("/?pwa");
    cy.url().should("include", "/cal/" + shiftModel);
  });

  it("visit impressum", () => {
    cy.visit(baseUrl);
    cy.contains("Impressum").click();

    cy.url().should("include", "/impressum");
    cy.contains("h3", "Verantwortlicher");

    cy.get("header h1").click();
    cy.url().should("not.include", "/impressum");
  });
});

describe("download", () => {
  it("should be accessable by the calendars", () => {
    cy.visit(
      `${baseUrl}/cal/${
        shiftModelNames[Math.floor(Math.random() * shiftModelNames.length)]
      }`,
    );
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(250); // needed because it has to render the next month after load.
    cy.contains("Alle Download-Optionen!").click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(250);
    cy.url().should("include", "/download");

    const now = new Date();
    cy.contains(
      `Alle Schichten für ${
        monthNames[now.getMonth()]
      } ${now.getFullYear()} als Tabelle:`,
    )
      .next()
      .click();
    cy.get("dialog").contains("Downloade Tabelle");
    cy.get("dialog").contains(
      `Download ${excelExportName(now.getFullYear(), now.getMonth() + 1)}`,
    );
    cy.contains("Schließen").click();

    cy.get("header h1").click();
    cy.url().should("not.include", "/download");
  });

  it("should have a year calendar for every shift model", () => {
    cy.visit(baseUrl + "/download");
    const year = new Date().getFullYear();

    for (const name of shiftModelNames) {
      cy.contains(shiftModelText[name] + ":")
        .next()
        .click();

      cy.get("dialog").contains("Downloade Tabelle");
      cy.get("dialog").contains(
        `Download ${excelExportModelFullYearName(name, year)}`,
      );
      cy.contains("Schließen").click();
    }
  });
});
