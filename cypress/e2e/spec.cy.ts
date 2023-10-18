/* eslint-disable jest/expect-expect */

import {
  shiftModelText,
  shiftModelNames,
  monthNames,
} from "../../lib/constants";

describe("basic usage", () => {
  it("should have all shift models on index", () => {
    cy.visit("http://localhost:3000/");

    for (const [key, name] of Object.entries(shiftModelText)) {
      cy.contains("main a", name)
        .should("have.attr", "href")
        .and("include", key);
    }
  });

  it("visit impressum", () => {
    cy.visit("http://localhost:3000/");
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
      `http://localhost:3000/cal/${
        shiftModelNames[Math.floor(Math.random() * shiftModelNames.length)]
      }`,
    );
    cy.contains("Es gibt mehr Download-Optionen!").click();

    cy.url().should("include", "/download");

    const now = new Date();
    const href = `/api/excel_export/all/${now.getFullYear()}/${
      now.getMonth() + 1
    }`;
    cy.contains(
      `Alle Schichten für ${
        monthNames[now.getMonth()]
      } ${now.getFullYear()} als Tabelle:`,
    )
      .next()
      .should("have.attr", "href")
      .and("include", href);
  });

  it("should have a year calendar for every shift model", () => {
    cy.visit("http://localhost:3000/download");
    const year = new Date().getFullYear();

    for (const name of shiftModelNames) {
      cy.contains(shiftModelText[name] + ":")
        .next()
        .should("have.attr", "href")
        .and("include", `/api/excel_export/shift/${name}/${year}`);
    }
  });
});
