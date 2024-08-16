/* eslint-disable cypress/no-unnecessary-waiting */

import {
  shiftModelText,
  shiftModelNames,
  monthNames,
  excelExportName,
  excelExportModelFullYearName,
  shiftModelNumberOfGroups,
} from "../../lib/constants";
import { shift44Name } from "../../lib/shifts";

describe("basic usage", () => {
  it("should have all shift models on index", () => {
    cy.visit("/");

    for (const key of shiftModelNames) {
      const name = shiftModelText[key];
      cy.contains("main a", name)
        .should("have.attr", "href")
        .and("include", key);
    }
    cy.contains("main a", shift44Name).should("not.exist");
  });

  it("visit impressum", () => {
    cy.visit("/");
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
      `/cal/${
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

  it("should have a ics file for every shift and group", () => {
    const model =
      shiftModelNames[Math.floor(Math.random() * shiftModelNames.length)];

    cy.visit("/download");

    for (let i = 0; i < shiftModelNumberOfGroups[model]; i++) {
      cy.contains(shiftModelText[model])
        .next()
        .contains(i + 1)
        .click();

      cy.get("dialog").contains("Downloade Kalender Datei");
      cy.get("dialog").contains(
        `Download ${shiftModelText[model]} - Gruppe ${i + 1}.ics`,
      );
      cy.contains("Schließen").click();
    }
  });

  it("should have a year calendar for every shift model", () => {
    cy.visit("/download");
    const year = new Date().getFullYear();

    for (const name of shiftModelNames) {
      cy.contains(`${shiftModelText[name]}:`).next().click();

      cy.get("dialog").contains("Downloade Tabelle");
      cy.get("dialog").contains(
        `Download ${excelExportModelFullYearName(name, year)}`,
      );
      cy.contains("Schließen").click();
    }
  });
});
